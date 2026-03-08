import { useNavigate } from "@tanstack/react-router";
import { Calendar, Clock, DollarSign } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Service } from "../../backend";
import {
  useGetProviderAvailability,
  useMakeBooking,
} from "../../hooks/useQueries";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface BookingFlowProps {
  service: Service;
  onSuccess?: () => void;
}

export default function BookingFlow({ service, onSuccess }: BookingFlowProps) {
  const { data: availability, isLoading } = useGetProviderAvailability(
    service.provider,
  );
  const makeBooking = useMakeBooking();
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const handleBooking = async () => {
    if (!selectedSlot) {
      toast.error("Please select a time slot");
      return;
    }

    try {
      const now = BigInt(Date.now() * 1000000);
      const endTime = now + BigInt(Number(service.duration) * 60 * 1000000000);

      await makeBooking.mutateAsync({
        serviceTitle: service.title,
        startTime: now,
        endTime: endTime,
      });

      toast.success("Booking confirmed!");
      onSuccess?.();
      navigate({ to: "/booking-confirmation" });
    } catch (error) {
      toast.error("Failed to create booking");
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading availability...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Service</span>
            <span className="font-semibold">{service.title}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              Price
            </span>
            <span className="font-semibold">
              ${Number(service.price) / 100}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Duration
            </span>
            <span className="font-semibold">
              {Number(service.duration)} minutes
            </span>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Select a Time Slot
        </h3>
        {availability && availability.length > 0 ? (
          <div className="grid gap-2">
            {availability.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedSlot(slot)}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${
                  selectedSlot === slot
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No availability set by provider yet. Please check back later.
          </div>
        )}
      </div>

      <Button
        onClick={handleBooking}
        className="w-full"
        disabled={!selectedSlot || makeBooking.isPending}
      >
        {makeBooking.isPending ? "Confirming..." : "Confirm Booking"}
      </Button>
    </div>
  );
}
