import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export type CallState =
  | "idle"
  | "calling"
  | "ringing"
  | "connected"
  | "on-hold"
  | "ended";

export interface IncomingCallInfo {
  callerId: string;
  callerName: string;
  callId: string;
}

export interface CallAgent {
  startCall: (calleeId: string, calleeName?: string) => void;
  answerCall: () => void;
  rejectCall: () => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleHold: () => void;
}

export interface UseCallAgentReturn {
  callAgent: CallAgent;
  callState: CallState;
  isMuted: boolean;
  isOnHold: boolean;
  incomingCall: IncomingCallInfo | null;
  activeCallId: string | null;
  callDurationSeconds: number;
  activeCalleeName: string | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}

function generateCallId(): string {
  return `call-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useCallAgent(): UseCallAgentReturn {
  const [callState, setCallState] = useState<CallState>("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [incomingCall, setIncomingCall] = useState<IncomingCallInfo | null>(
    null,
  );
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [activeCalleeName, setActiveCalleeName] = useState<string | null>(null);
  const [callDurationSeconds, setCallDurationSeconds] = useState(0);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const durationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const simulatedCallTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const autoAnswerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const incomingSimTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const clearDurationTimer = useCallback(() => {
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }
  }, []);

  const startDurationTimer = useCallback(() => {
    clearDurationTimer();
    setCallDurationSeconds(0);
    durationTimerRef.current = setInterval(() => {
      setCallDurationSeconds((prev) => prev + 1);
    }, 1000);
  }, [clearDurationTimer]);

  const cleanupMedia = useCallback(() => {
    if (localStreamRef.current) {
      for (const track of localStreamRef.current.getTracks()) {
        track.stop();
      }
      localStreamRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setLocalStream(null);
    setRemoteStream(null);
  }, []);

  const resetCallState = useCallback(() => {
    clearDurationTimer();
    cleanupMedia();
    setCallState("idle");
    setIsMuted(false);
    setIsOnHold(false);
    setActiveCallId(null);
    setActiveCalleeName(null);
    setCallDurationSeconds(0);
    setIncomingCall(null);
  }, [clearDurationTimer, cleanupMedia]);

  const acquireMicStream =
    useCallback(async (): Promise<MediaStream | null> => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        localStreamRef.current = stream;
        setLocalStream(stream);
        return stream;
      } catch {
        toast.error("Microphone unavailable — running in demo mode");
        return null;
      }
    }, []);

  const setupPeerConnection = useCallback((stream: MediaStream | null) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.ontrack = (event) => {
      if (event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    if (stream) {
      for (const track of stream.getTracks()) {
        pc.addTrack(track, stream);
      }
    }

    peerConnectionRef.current = pc;
    return pc;
  }, []);

  // ─── CallAgent methods ──────────────────────────────────────────────────────

  const startCall = useCallback(
    async (calleeId: string, calleeName?: string) => {
      if (callState !== "idle") return;

      const callId = generateCallId();
      setActiveCallId(callId);
      setActiveCalleeName(calleeName ?? calleeId);
      setCallState("calling");

      const stream = await acquireMicStream();
      setupPeerConnection(stream);

      // Simulate SDP offer creation (no real signaling server)
      if (peerConnectionRef.current && stream) {
        try {
          await peerConnectionRef.current.createOffer();
        } catch {
          // Silently continue — demo mode
        }
      }

      // Simulate callee answering after 1.5 s
      simulatedCallTimerRef.current = setTimeout(() => {
        setCallState("ringing");
        autoAnswerTimerRef.current = setTimeout(() => {
          setCallState("connected");
          startDurationTimer();
          toast.success(`Connected with ${calleeName ?? calleeId}`);
        }, 2000);
      }, 1500);
    },
    [callState, acquireMicStream, setupPeerConnection, startDurationTimer],
  );

  const answerCall = useCallback(async () => {
    if (!incomingCall) return;
    const name = incomingCall.callerName;
    setIncomingCall(null);
    setActiveCallId(incomingCall.callId);
    setActiveCalleeName(name);

    const stream = await acquireMicStream();
    setupPeerConnection(stream);

    setCallState("connected");
    startDurationTimer();
    toast.success(`Call answered — connected with ${name}`);
  }, [incomingCall, acquireMicStream, setupPeerConnection, startDurationTimer]);

  const rejectCall = useCallback(() => {
    if (!incomingCall) return;
    toast("Call declined");
    setIncomingCall(null);
  }, [incomingCall]);

  const endCall = useCallback(() => {
    if (simulatedCallTimerRef.current) {
      clearTimeout(simulatedCallTimerRef.current);
      simulatedCallTimerRef.current = null;
    }
    if (autoAnswerTimerRef.current) {
      clearTimeout(autoAnswerTimerRef.current);
      autoAnswerTimerRef.current = null;
    }
    toast("Call ended");
    setCallState("ended");
    setTimeout(() => resetCallState(), 1200);
  }, [resetCallState]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (localStreamRef.current) {
        for (const track of localStreamRef.current.getAudioTracks()) {
          track.enabled = !next;
        }
      }
      return next;
    });
  }, []);

  const toggleHold = useCallback(() => {
    setIsOnHold((prev) => {
      const next = !prev;
      setCallState(next ? "on-hold" : "connected");
      if (next) {
        clearDurationTimer();
      } else {
        startDurationTimer();
      }
      return next;
    });
  }, [clearDurationTimer, startDurationTimer]);

  // ─── Incoming call simulation (runs once on mount) ──────────────────────────
  useEffect(() => {
    incomingSimTimerRef.current = setTimeout(() => {
      // Only show incoming if not already in a call
      setCallState((current) => {
        if (current === "idle") {
          setIncomingCall({
            callerId: "client-alice-001",
            callerName: "Alice Johnson",
            callId: generateCallId(),
          });
        }
        return current;
      });
    }, 8000);

    return () => {
      if (incomingSimTimerRef.current) {
        clearTimeout(incomingSimTimerRef.current);
      }
    };
  }, []);

  // ─── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearDurationTimer();
      cleanupMedia();
      if (simulatedCallTimerRef.current)
        clearTimeout(simulatedCallTimerRef.current);
      if (autoAnswerTimerRef.current) clearTimeout(autoAnswerTimerRef.current);
      if (incomingSimTimerRef.current)
        clearTimeout(incomingSimTimerRef.current);
    };
  }, [clearDurationTimer, cleanupMedia]);

  const callAgent: CallAgent = {
    startCall,
    answerCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleHold,
  };

  return {
    callAgent,
    callState,
    isMuted,
    isOnHold,
    incomingCall,
    activeCallId,
    activeCalleeName,
    callDurationSeconds,
    localStream,
    remoteStream,
  };
}
