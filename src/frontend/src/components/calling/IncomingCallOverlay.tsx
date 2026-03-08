import { Phone, PhoneOff, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallManager } from "../../context/CallManagerContext";
import { Button } from "../ui/button";

const WAVEFORM_BARS = [
  { id: "w0", h: 3, delay: 0.0 },
  { id: "w1", h: 6, delay: 0.07 },
  { id: "w2", h: 9, delay: 0.14 },
  { id: "w3", h: 12, delay: 0.21 },
  { id: "w4", h: 9, delay: 0.28 },
  { id: "w5", h: 14, delay: 0.35 },
  { id: "w6", h: 9, delay: 0.42 },
  { id: "w7", h: 12, delay: 0.49 },
  { id: "w8", h: 9, delay: 0.56 },
  { id: "w9", h: 6, delay: 0.63 },
  { id: "w10", h: 3, delay: 0.7 },
];

export default function IncomingCallOverlay() {
  const { incomingCall, callAgent } = useCallManager();

  return (
    <AnimatePresence>
      {incomingCall && (
        <motion.div
          key="incoming-call"
          data-ocid="incoming_call.dialog"
          initial={{ opacity: 0, y: 40, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.92 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="fixed bottom-6 right-6 z-50 w-80"
          role="alertdialog"
          aria-live="assertive"
          aria-label={`Incoming call from ${incomingCall.callerName}`}
        >
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-2xl backdrop-blur-sm">
            {/* Ambient glow strip */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent"
            />

            <div className="p-5">
              {/* Header */}
              <div className="flex items-center gap-4 mb-5">
                {/* Pulsing avatar */}
                <div className="relative shrink-0">
                  <motion.div
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{
                      duration: 1.4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-full bg-green-500/20"
                  />
                  <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-green-600 dark:text-green-400 mb-0.5">
                    Incoming Call
                  </p>
                  <p className="text-base font-bold text-foreground truncate">
                    {incomingCall.callerName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    ID: {incomingCall.callerId}
                  </p>
                </div>
              </div>

              {/* Waveform decoration */}
              <div
                className="flex items-center gap-0.5 justify-center mb-5"
                aria-hidden="true"
              >
                {WAVEFORM_BARS.map(({ h, delay, id }) => (
                  <motion.div
                    key={id}
                    className="w-1 rounded-full bg-green-500/60"
                    animate={{ height: [h, h * 2, h] }}
                    transition={{
                      duration: 0.9,
                      repeat: Number.POSITIVE_INFINITY,
                      delay,
                      ease: "easeInOut",
                    }}
                    style={{ height: h }}
                  />
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <Button
                  data-ocid="incoming_call.cancel_button"
                  variant="destructive"
                  size="sm"
                  onClick={() => callAgent.rejectCall()}
                  className="flex-1 gap-2 rounded-xl font-semibold"
                  aria-label="Decline call"
                >
                  <PhoneOff className="w-4 h-4" />
                  Decline
                </Button>
                <Button
                  data-ocid="incoming_call.confirm_button"
                  size="sm"
                  onClick={() => callAgent.answerCall()}
                  className="flex-1 gap-2 rounded-xl font-semibold bg-green-600 hover:bg-green-700 text-white border-0"
                  aria-label="Answer call"
                >
                  <Phone className="w-4 h-4" />
                  Answer
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
