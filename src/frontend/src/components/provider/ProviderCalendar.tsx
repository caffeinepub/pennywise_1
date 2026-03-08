import { Calendar as CalendarIcon, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import {
  useGetProviderAvailability,
  useUpdateAvailability,
} from "../../hooks/useQueries";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function ProviderCalendar() {
  const { identity } = useInternetIdentity();
  const { data: availability, isLoading } = useGetProviderAvailability(
    identity?.getPrincipal() || null,
  );
  const updateAvailability = useUpdateAvailability();
  const [newSlot, setNewSlot] = useState("");
  const [slots, setSlots] = useState<string[]>([]);

  const handleAddSlot = () => {
    if (!newSlot.trim()) {
      toast.error("Please enter a time slot");
      return;
    }
    setSlots([...slots, newSlot.trim()]);
    setNewSlot("");
  };

  const handleRemoveSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const handleSaveAvailability = async () => {
    try {
      await updateAvailability.mutateAsync(slots);
      toast.success("Availability updated successfully!");
      setSlots([]);
    } catch (error) {
      toast.error("Failed to update availability");
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading calendar...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Calendar & Availability</h2>
        <p className="text-muted-foreground">
          Manage your schedule and available time slots
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Availability</CardTitle>
            <CardDescription>Your available time slots</CardDescription>
          </CardHeader>
          <CardContent>
            {availability && availability.length > 0 ? (
              <div className="space-y-2">
                {availability.map((slot) => (
                  <div
                    key={slot}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                      <span>{slot}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No availability set yet. Add time slots to let clients book you.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Availability</CardTitle>
            <CardDescription>Set your available time slots</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="slot">Time Slot</Label>
              <div className="flex gap-2">
                <Input
                  id="slot"
                  value={newSlot}
                  onChange={(e) => setNewSlot(e.target.value)}
                  placeholder="e.g., Monday 9:00 AM - 5:00 PM"
                  onKeyPress={(e) => e.key === "Enter" && handleAddSlot()}
                />
                <Button onClick={handleAddSlot} size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {slots.length > 0 && (
              <div className="space-y-2">
                <Label>New Slots to Add</Label>
                {slots.map((slot, index) => (
                  <div
                    key={slot}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <span className="text-sm">{slot}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSlot(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={handleSaveAvailability}
                  className="w-full"
                  disabled={updateAvailability.isPending}
                >
                  {updateAvailability.isPending
                    ? "Saving..."
                    : "Save Availability"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Bookings</CardTitle>
          <CardDescription>Your scheduled appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No upcoming bookings. Your calendar will show confirmed appointments
            here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
