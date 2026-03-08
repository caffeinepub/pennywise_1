import { createContext, useContext } from "react";
import { useCallAgent } from "../hooks/useCallAgent";
import type { UseCallAgentReturn } from "../hooks/useCallAgent";

export type CallManagerContextType = UseCallAgentReturn;

export const CallManagerContext = createContext<CallManagerContextType | null>(
  null,
);

export function CallManagerProvider({
  children,
}: { children: React.ReactNode }) {
  const callData = useCallAgent();
  return (
    <CallManagerContext.Provider value={callData}>
      {children}
    </CallManagerContext.Provider>
  );
}

export function useCallManager(): CallManagerContextType {
  const ctx = useContext(CallManagerContext);
  if (!ctx)
    throw new Error("useCallManager must be used within CallManagerProvider");
  return ctx;
}
