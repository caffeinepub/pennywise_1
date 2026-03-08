import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import ProfileSetupModal from "./components/ProfileSetupModal";
import ActiveCallPanel from "./components/calling/ActiveCallPanel";
import IncomingCallOverlay from "./components/calling/IncomingCallOverlay";
import AppLayout from "./components/layout/AppLayout";
import { Toaster } from "./components/ui/sonner";
import { CallManagerProvider } from "./context/CallManagerContext";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import ProviderDashboard from "./pages/ProviderDashboard";
import TakerDashboard from "./pages/TakerDashboard";

const rootRoute = createRootRoute({
  component: () => (
    <CallManagerProvider>
      <AppLayout>
        <Outlet />
      </AppLayout>
      <Toaster />
      <IncomingCallOverlay />
      <ActiveCallPanel />
    </CallManagerProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const providerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/provider",
  component: ProviderDashboard,
});

const takerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/taker",
  component: TakerDashboard,
});

const bookingConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/booking-confirmation",
  component: BookingConfirmationPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-success",
  component: PaymentSuccessPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  contactRoute,
  providerRoute,
  takerRoute,
  bookingConfirmationRoute,
  paymentSuccessRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      {showProfileSetup && <ProfileSetupModal />}
    </ThemeProvider>
  );
}

export default App;
