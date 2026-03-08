import {
  Mic,
  MicOff,
  PauseCircle,
  Phone,
  PhoneOff,
  PlayCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallManager } from "../../context/CallManagerContext";
import type { CallState } from "../../hooks/useCallAgent";
import { Button } from "../ui/button";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function CallStateBadge({ state }: { state: CallState }) {
  const config: Record<CallState, { label: string; className: string }> = {
    idle: { label: "Idle", className: "bg-muted text-muted-foreground" },
    calling: {
      label: "Calling…",
      className: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
    },
    ringing: {
      label: "Ringing…",
      className: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
    },
    connected: {
      label: "Connected",
      className: "bg-green-500/20 text-green-700 dark:text-green-300",
    },
    "on-hold": {
      label: "On Hold",
      className: "bg-orange-500/20 text-orange-700 dark:text-orange-300",
    },
    ended: { label: "Ended", className: "bg-muted text-muted-foreground" },
  };
  const { label, className } = config[state];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${className}`}
    >
      {state === "connected" && (
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
        />
      )}
      {label}
    </span>
  );
}

export default function ActiveCallPanel() {
  const {
    callState,
    callAgent,
    isMuted,
    isOnHold,
    activeCalleeName,
    callDurationSeconds,
    incomingCall,
  } = useCallManager();

  const showPanel =
    callState !== "idle" && callState !== "ended" && incomingCall === null;

  const showDuration = callState === "connected" || callState === "on-hold";

  return (
    <AnimatePresence>
      {showPanel && (
        <motion.section
          key="active-call-panel"
          data-ocid="active_call.panel"
          initial={{ opacity: 0, y: 40, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.94 }}
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
          className="fixed bottom-6 right-6 z-40 w-72"
          aria-label="Active call panel"
        >
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            {/* Top accent line that pulses when connected */}
            <motion.div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-0.5"
              animate={
                callState === "connected"
                  ? {
                      opacity: [0.5, 1, 0.5],
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }
                  : {}
              }
              transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
              style={{
                background:
                  "linear-gradient(to right, transparent, oklch(var(--primary)), transparent)",
              }}
            />

            <div className="p-4">
              {/* Call info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative shrink-0">
                  {callState === "connected" && (
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                      className="absolute inset-0 rounded-full bg-primary/30"
                    />
                  )}
                  <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shadow-md">
                    <Phone className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate text-foreground">
                    {activeCalleeName ?? "Unknown"}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <CallStateBadge state={callState} />
                    {showDuration && (
                      <span className="text-xs font-mono text-muted-foreground tabular-nums">
                        {formatDuration(callDurationSeconds)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                {/* Mute toggle */}
                <Button
                  data-ocid="active_call.toggle"
                  variant={isMuted ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => callAgent.toggleMute()}
                  className="flex-1 gap-1.5 rounded-xl text-xs font-medium h-9"
                  aria-label={isMuted ? "Unmute microphone" : "Mute microphone"}
                  aria-pressed={isMuted}
                >
                  {isMuted ? (
                    <>
                      <MicOff className="w-3.5 h-3.5 text-destructive" />
                      <span>Unmute</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5" />
                      <span>Mute</span>
                    </>
                  )}
                </Button>

                {/* Hold toggle */}
                <Button
                  data-ocid="active_call.toggle"
                  variant={isOnHold ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => callAgent.toggleHold()}
                  className="flex-1 gap-1.5 rounded-xl text-xs font-medium h-9"
                  aria-label={isOnHold ? "Resume call" : "Hold call"}
                  aria-pressed={isOnHold}
                  disabled={callState === "calling" || callState === "ringing"}
                >
                  {isOnHold ? (
                    <>
                      <PlayCircle className="w-3.5 h-3.5 text-orange-500" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <PauseCircle className="w-3.5 h-3.5" />
                      <span>Hold</span>
                    </>
                  )}
                </Button>

                {/* End call */}
                <Button
                  data-ocid="active_call.delete_button"
                  variant="destructive"
                  size="sm"
                  onClick={() => callAgent.endCall()}
                  className="rounded-xl w-9 h-9 p-0 shrink-0"
                  aria-label="End call"
                >
                  <PhoneOff className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
