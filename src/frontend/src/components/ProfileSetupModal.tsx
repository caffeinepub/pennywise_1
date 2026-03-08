import { useState } from "react";
import { toast } from "sonner";
import { Variant_taker_provider_both_none } from "../backend";
import { useSaveUserProfile } from "../hooks/useQueries";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function ProfileSetupModal() {
  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [userType, setUserType] = useState<"provider" | "taker" | "both">(
    "taker",
  );
  const saveProfile = useSaveUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !contactInfo.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        contactInfo: contactInfo.trim(),
        userType: Variant_taker_provider_both_none[userType],
      });
      toast.success("Profile created successfully!");
    } catch (error) {
      toast.error("Failed to create profile");
      console.error(error);
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Welcome to Pennywise</DialogTitle>
          <DialogDescription>
            Let's set up your profile to get started
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact">Contact Info</Label>
            <Input
              id="contact"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="Email or phone number"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userType">I want to</Label>
            <Select
              value={userType}
              onValueChange={(value: any) => setUserType(value)}
            >
              <SelectTrigger id="userType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="taker">Find Services</SelectItem>
                <SelectItem value="provider">Offer Services</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={saveProfile.isPending}
          >
            {saveProfile.isPending ? "Creating Profile..." : "Get Started"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
