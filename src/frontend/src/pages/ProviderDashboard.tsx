import { Navigate } from "@tanstack/react-router";
import { Briefcase, Calendar, DollarSign, MessageSquare } from "lucide-react";
import EarningsDashboard from "../components/provider/EarningsDashboard";
import MessageCenter from "../components/provider/MessageCenter";
import ProviderCalendar from "../components/provider/ProviderCalendar";
import ServiceListings from "../components/provider/ServiceListings";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetAllServices,
  useGetCallerUserProfile,
} from "../hooks/useQueries";

export default function ProviderDashboard() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();

  if (!identity) {
    return <Navigate to="/" />;
  }

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const isProvider =
    userProfile?.userType === "provider" || userProfile?.userType === "both";

  if (!isProvider) {
    return (
      <div className="container py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">
            You need to be registered as a provider to access this dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Provider Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your services, bookings, and client communications
        </p>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            <span className="hidden sm:inline">Services</span>
          </TabsTrigger>
          <TabsTrigger value="earnings" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span className="hidden sm:inline">Earnings</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Messages</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services">
          <ServiceListings />
        </TabsContent>

        <TabsContent value="earnings">
          <EarningsDashboard />
        </TabsContent>

        <TabsContent value="calendar">
          <ProviderCalendar />
        </TabsContent>

        <TabsContent value="messages">
          <MessageCenter />
        </TabsContent>
      </Tabs>
    </div>
  );
}
