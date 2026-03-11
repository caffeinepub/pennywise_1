import type { Principal } from "@dfinity/principal";
import { Loader2, MessageSquare, Phone, Send } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import {
  useGetBookingsForProvider,
  useGetMessagesWithUser,
  useSendMessage,
} from "../../hooks/useQueries";
import StartCallButton from "../calling/StartCallButton";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";

function truncatePrincipal(p: Principal): string {
  const s = p.toString();
  return `${s.slice(0, 8)}…`;
}

function ContactItem({
  principal,
  isSelected,
  onClick,
  index,
}: {
  principal: Principal;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}) {
  const label = truncatePrincipal(principal);
  return (
    <button
      type="button"
      data-ocid={`message_center.item.${index + 1}`}
      className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 transition-colors cursor-pointer ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border bg-muted/30 hover:bg-muted/50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/60 to-primary/80 flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-sm">
          {label.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground font-mono">
            {label}
          </p>
          <p className="text-xs text-muted-foreground">Client</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StartCallButton
          calleeId={principal.toString()}
          calleeName={label}
          variant="outline"
          size="sm"
          className="rounded-lg text-xs"
        />
      </div>
    </button>
  );
}

function ConversationPanel({ peer }: { peer: Principal }) {
  const { identity } = useInternetIdentity();
  const { data: messages, isLoading } = useGetMessagesWithUser(peer);
  const sendMessage = useSendMessage();
  const [draft, setDraft] = useState("");
  const myPrincipal = identity?.getPrincipal().toString();

  function handleSend() {
    const content = draft.trim();
    if (!content) return;
    sendMessage.mutate({ receiver: peer, content });
    setDraft("");
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-border">
        <p className="text-sm font-semibold font-mono">
          {truncatePrincipal(peer)}
        </p>
        <p className="text-xs text-muted-foreground">Direct message</p>
      </div>

      <ScrollArea className="flex-1 px-4 py-3">
        {isLoading ? (
          <div
            className="flex items-center justify-center h-24 text-muted-foreground"
            data-ocid="conversation.loading_state"
          >
            <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading…
          </div>
        ) : !messages || messages.length === 0 ? (
          <div
            className="text-center py-8 text-muted-foreground"
            data-ocid="conversation.empty_state"
          >
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No messages yet. Say hello!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, i) => {
              const isMine = msg.sender.toString() === myPrincipal;
              return (
                <div
                  key={`${msg.timestamp}-${i}`}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                      isMine
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      <div className="px-4 py-3 border-t border-border flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Type a message…"
          className="flex-1"
          data-ocid="conversation.message.input"
        />
        <Button
          size="sm"
          onClick={handleSend}
          disabled={!draft.trim() || sendMessage.isPending}
          data-ocid="conversation.message.submit_button"
        >
          {sendMessage.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

export default function MessageCenter() {
  const { data: bookingPairs, isLoading } = useGetBookingsForProvider();
  const [selectedPeer, setSelectedPeer] = useState<Principal | null>(null);

  // Unique takers from bookings
  const uniqueTakers: Principal[] = [];
  const seen = new Set<string>();
  for (const [, booking] of bookingPairs ?? []) {
    const key = booking.taker.toString();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueTakers.push(booking.taker);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Message Center</h2>
        <p className="text-muted-foreground">Communicate with your clients</p>
      </div>

      {/* ── Communications (Call) ──────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Phone className="w-4 h-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Communications</CardTitle>
              <CardDescription className="text-xs">
                Initiate a voice call with your clients
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading ? (
            <div
              className="flex items-center justify-center py-6 text-muted-foreground"
              data-ocid="message_center.loading_state"
            >
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <span>Loading clients…</span>
            </div>
          ) : uniqueTakers.length === 0 ? (
            <div
              className="text-center py-6 text-muted-foreground"
              data-ocid="message_center.empty_state"
            >
              <p className="text-sm">
                No clients yet. Once someone books your services they'll appear
                here.
              </p>
            </div>
          ) : (
            uniqueTakers.map((taker, i) => (
              <ContactItem
                key={taker.toString()}
                principal={taker}
                isSelected={selectedPeer?.toString() === taker.toString()}
                onClick={() =>
                  setSelectedPeer(
                    selectedPeer?.toString() === taker.toString()
                      ? null
                      : taker,
                  )
                }
                index={i}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* ── Messages ──────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
          <CardDescription>
            {selectedPeer
              ? `Chatting with ${truncatePrincipal(selectedPeer)}`
              : "Select a client above to start a conversation"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 min-h-[300px]">
          {selectedPeer ? (
            <ConversationPanel peer={selectedPeer} />
          ) : (
            <div
              className="text-center py-12 text-muted-foreground"
              data-ocid="message_center.conversation.empty_state"
            >
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No conversation open
              </h3>
              <p className="text-muted-foreground">
                Select a client from the Communications section to start
                messaging.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
