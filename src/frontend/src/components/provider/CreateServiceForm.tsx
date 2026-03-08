import { useState } from "react";
import { toast } from "sonner";
import { useAddService } from "../../hooks/useQueries";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface CreateServiceFormProps {
  onSuccess?: () => void;
}

export default function CreateServiceForm({
  onSuccess,
}: CreateServiceFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const addService = useAddService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !price || !duration) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await addService.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        price: BigInt(Math.round(Number.parseFloat(price) * 100)),
        duration: BigInt(Number.parseInt(duration)),
      });

      toast.success("Service created successfully!");
      setTitle("");
      setDescription("");
      setPrice("");
      setDuration("");
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to create service");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Service Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Professional House Cleaning"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your service in detail..."
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="50.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="60"
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={addService.isPending}>
        {addService.isPending ? "Creating..." : "Create Service"}
      </Button>
    </form>
  );
}
