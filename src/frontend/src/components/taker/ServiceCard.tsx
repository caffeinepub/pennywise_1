import { Clock, DollarSign, User } from "lucide-react";
import { useState } from "react";
import type { Service } from "../../backend";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import BookingFlow from "./BookingFlow";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{service.title}</CardTitle>
          <CardDescription className="line-clamp-2">
            {service.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>${Number(service.price) / 100}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{Number(service.duration)} min</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span className="truncate">
              {service.provider.toString().slice(0, 20)}...
            </span>
          </div>
          <Button className="w-full" onClick={() => setBookingDialogOpen(true)}>
            Book Now
          </Button>
        </CardContent>
      </Card>

      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Book {service.title}</DialogTitle>
          </DialogHeader>
          <BookingFlow
            service={service}
            onSuccess={() => setBookingDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
