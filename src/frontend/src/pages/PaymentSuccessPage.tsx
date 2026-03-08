import { Link } from "@tanstack/react-router";
import { CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

export default function PaymentSuccessPage() {
  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-muted-foreground">
              Your payment has been processed successfully. Thank you for using
              Pennywise!
            </p>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono text-sm">TXN-{Date.now()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <h3 className="font-semibold">What's Next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Your booking is now fully confirmed</li>
                <li>• The provider has been notified of your payment</li>
                <li>• You can leave a review after the service is completed</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild className="flex-1">
                <Link to="/taker">View My Bookings</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
