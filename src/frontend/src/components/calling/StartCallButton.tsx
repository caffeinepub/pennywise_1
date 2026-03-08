import { Phone } from "lucide-react";
import { useCallManager } from "../../context/CallManagerContext";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

interface StartCallButtonProps {
  calleeId: string;
  calleeName?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export default function StartCallButton({
  calleeId,
  calleeName,
  variant = "default",
  size = "default",
  className,
}: StartCallButtonProps) {
  const { callAgent, callState } = useCallManager();
  const isDisabled = callState !== "idle";

  return (
    <Button
      data-ocid="start_call.primary_button"
      variant={variant}
      size={size}
      disabled={isDisabled}
      onClick={() => callAgent.startCall(calleeId, calleeName)}
      className={cn("gap-2", className)}
      aria-label={`Call ${calleeName ?? calleeId}`}
    >
      <Phone className="w-4 h-4" />
      <span>Call</span>
    </Button>
  );
}
