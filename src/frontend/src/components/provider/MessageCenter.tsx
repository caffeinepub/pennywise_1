import { MessageSquare, Phone, UserCircle2 } from "lucide-react";
import StartCallButton from "../calling/StartCallButton";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const DEMO_CLIENTS = [
  { id: "demo-client-001", name: "Sample Client", status: "online" },
  { id: "demo-client-002", name: "Marcus Lee", status: "away" },
  { id: "demo-client-003", name: "Priya Singh", status: "offline" },
];

const statusColors: Record<string, string> = {
  online: "bg-green-500",
  away: "bg-amber-500",
  offline: "bg-muted-foreground/40",
};

export default function MessageCenter() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Message Center</h2>
        <p className="text-muted-foreground">Communicate with your clients</p>
      </div>

      {/* ── Communications (Call) ────────────────────────────────── */}
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
          {DEMO_CLIENTS.map((client, i) => (
            <div
              key={client.id}
              data-ocid={`message_center.item.${i + 1}`}
              className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/60 to-primary/80 flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-sm">
                    {client.name.charAt(0)}
                  </div>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card ${statusColors[client.status]}`}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {client.name}
                  </p>
                  <p className="text-xs capitalize text-muted-foreground">
                    {client.status}
                  </p>
                </div>
              </div>
              <StartCallButton
                calleeId={client.id}
                calleeName={client.name}
                variant="outline"
                size="sm"
                className="rounded-lg text-xs"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── Messages ─────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
          <CardDescription>Your client messages</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="text-center py-12"
            data-ocid="message_center.empty_state"
          >
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
            <p className="text-muted-foreground">
              When clients book your services, you&apos;ll be able to message
              them here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
