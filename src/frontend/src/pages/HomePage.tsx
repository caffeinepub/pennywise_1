import { Link } from "@tanstack/react-router";
import {
  Briefcase,
  Calendar,
  DollarSign,
  MessageSquare,
  Search,
  Star,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";

export default function HomePage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  return (
    <div className="flex flex-col">
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-yellow-950/20" />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Connect with the Right Service Provider
            </h1>
            <p className="text-xl text-muted-foreground">
              Pennywise makes it easy to find trusted professionals or offer
              your services to those who need them.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              {isAuthenticated ? (
                <>
                  {(userProfile?.userType === "taker" ||
                    userProfile?.userType === "both") && (
                    <Button asChild size="lg">
                      <Link to="/taker">
                        <Search className="w-5 h-5 mr-2" />
                        Find Services
                      </Link>
                    </Button>
                  )}
                  {(userProfile?.userType === "provider" ||
                    userProfile?.userType === "both") && (
                    <Button asChild size="lg" variant="outline">
                      <Link to="/provider">
                        <Briefcase className="w-5 h-5 mr-2" />
                        Provider Dashboard
                      </Link>
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button asChild size="lg">
                    <Link to="/taker">
                      <Search className="w-5 h-5 mr-2" />
                      Find Services
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Pennywise Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you're looking for services or offering them, we've made
              the process simple and secure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <CardTitle>For Service Seekers</CardTitle>
                <CardDescription>
                  Find and book the services you need
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold">1</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Search for services by keyword or category
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold">2</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Review provider profiles and ratings
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold">3</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Book appointments and make secure payments
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold">4</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Leave reviews to help others
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <CardTitle>For Service Providers</CardTitle>
                <CardDescription>
                  Grow your business and manage clients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold">1</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Create your profile and list your services
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold">2</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Set your availability and pricing
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold">3</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Manage bookings and communicate with clients
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold">4</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Track your earnings and grow your reputation
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <Calendar className="w-10 h-10 text-amber-600 mb-2" />
                <CardTitle className="text-lg">Calendar Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Providers can manage their availability and view all bookings
                  in one place.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <DollarSign className="w-10 h-10 text-amber-600 mb-2" />
                <CardTitle className="text-lg">Earnings Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Track your income, view transaction history, and monitor your
                  business growth.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="w-10 h-10 text-amber-600 mb-2" />
                <CardTitle className="text-lg">Direct Messaging</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Communicate directly with clients or providers to discuss
                  service details.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Star className="w-10 h-10 text-amber-600 mb-2" />
                <CardTitle className="text-lg">Reviews & Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Build trust through authentic reviews from satisfied clients.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Search className="w-10 h-10 text-amber-600 mb-2" />
                <CardTitle className="text-lg">Smart Search</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Find exactly what you need with our powerful search and
                  filtering system.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Briefcase className="w-10 h-10 text-amber-600 mb-2" />
                <CardTitle className="text-lg">Service Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Create detailed service listings with pricing, duration, and
                  descriptions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-yellow-950/20">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join Pennywise today and experience a better way to connect with
            service providers.
          </p>
          <Button asChild size="lg">
            <Link to="/contact">Contact Our Virtual Assistant</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
