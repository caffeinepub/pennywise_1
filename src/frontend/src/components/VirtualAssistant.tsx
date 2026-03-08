import { Principal } from "@dfinity/principal";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSendMessage } from "../hooks/useQueries";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export default function VirtualAssistant() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const sendMessage = useSendMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !contact.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const assistantPrincipal = Principal.anonymous();
      const fullMessage = `Name: ${name}\nContact: ${contact}\n\nMessage: ${message}`;

      await sendMessage.mutateAsync({
        receiver: assistantPrincipal,
        content: fullMessage,
      });

      toast.success("Message sent! We'll get back to you soon.");
      setName("");
      setContact("");
      setMessage("");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
          <MessageSquare className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Virtual Assistant</h2>
          <p className="text-muted-foreground">
            Send us a message and we'll help you find the perfect service
            provider
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact">Contact Information</Label>
          <Input
            id="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Email or phone number"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Your Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what service you're looking for..."
            rows={6}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={sendMessage.isPending}
        >
          {sendMessage.isPending ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
}
