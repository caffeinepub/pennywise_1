import { Calendar, DollarSign, Loader2, TrendingUp } from "lucide-react";
import { useGetBookingsForProvider } from "../../hooks/useQueries";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

function formatPrice(price: bigint): string {
  return `$${Number(price).toFixed(2)}`;
}

function formatDate(ns: bigint): string {
  return new Date(Number(ns / 1_000_000n)).toLocaleDateString();
}

export default function EarningsDashboard() {
  const { data: bookingPairs, isLoading } = useGetBookingsForProvider();

  const bookings = (bookingPairs ?? []).map(([, b]) => b);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalEarnings = bookings.reduce((sum, b) => sum + Number(b.price), 0);

  const monthlyEarnings = bookings
    .filter((b) => {
      const d = new Date(Number(b.startTime / 1_000_000n));
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, b) => sum + Number(b.price), 0);

  const completedJobs = bookings.filter((b) => b.completed).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Earnings Overview</h2>
        <p className="text-muted-foreground">
          Track your income and transaction history
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton
                className="h-8 w-24"
                data-ocid="earnings.total.loading_state"
              />
            ) : (
              <div className="text-2xl font-bold">{`$${totalEarnings.toFixed(2)}`}</div>
            )}
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{`$${monthlyEarnings.toFixed(2)}`}</div>
            )}
            <p className="text-xs text-muted-foreground">Current month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Jobs
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{completedJobs}</div>
            )}
            <p className="text-xs text-muted-foreground">Total bookings</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest bookings and payments</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div
              className="flex items-center justify-center py-8 gap-2 text-muted-foreground"
              data-ocid="earnings.transactions.loading_state"
            >
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading transactions…</span>
            </div>
          ) : bookings.length === 0 ? (
            <div
              className="text-center py-8 text-muted-foreground"
              data-ocid="earnings.transactions.empty_state"
            >
              No transactions yet. Complete your first booking to see earnings
              here.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody data-ocid="earnings.transactions.table">
                {bookings.map((booking, i) => (
                  <TableRow
                    key={booking.id}
                    data-ocid={`earnings.transactions.row.${i + 1}`}
                  >
                    <TableCell className="font-medium">
                      {booking.service}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDate(booking.startTime)}
                    </TableCell>
                    <TableCell className="font-semibold text-emerald-700">
                      {formatPrice(booking.price)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          booking.completed
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }
                      >
                        {booking.completed ? "Completed" : "Pending"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
