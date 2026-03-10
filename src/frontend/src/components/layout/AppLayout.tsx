import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Briefcase, Menu, Search, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { SiFacebook, SiInstagram, SiLinkedin, SiX } from "react-icons/si";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../../hooks/useQueries";
import { Button } from "../ui/button";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const disabled = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error("Login error:", error);
        if (error.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const isProvider =
    userProfile?.userType === "provider" || userProfile?.userType === "both";
  const isTaker =
    userProfile?.userType === "taker" || userProfile?.userType === "both";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="font-bold text-xl">Pennywise</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="text-sm font-medium transition-colors hover:text-primary"
                data-ocid="nav.home.link"
              >
                Home
              </Link>
              <Link
                to="/contact"
                className="text-sm font-medium transition-colors hover:text-primary"
                data-ocid="nav.contact.link"
              >
                Contact
              </Link>
              {isAuthenticated && isProvider && (
                <Link
                  to="/provider"
                  className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
                  data-ocid="nav.provider.link"
                >
                  <Briefcase className="w-4 h-4" />
                  Provider Dashboard
                </Link>
              )}
              {isAuthenticated && isTaker && (
                <Link
                  to="/taker"
                  className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1"
                  data-ocid="nav.taker.link"
                >
                  <Search className="w-4 h-4" />
                  Find Services
                </Link>
              )}
              <Link
                to="/admin"
                className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 text-amber-700"
                data-ocid="nav.admin.link"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && userProfile && (
              <span className="hidden sm:inline text-sm text-muted-foreground">
                Welcome, {userProfile.name}
              </span>
            )}
            <Button
              onClick={handleAuth}
              disabled={disabled}
              variant={isAuthenticated ? "outline" : "default"}
            >
              {loginStatus === "logging-in"
                ? "Logging in..."
                : isAuthenticated
                  ? "Logout"
                  : "Login"}
            </Button>
            <button
              type="button"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <nav className="container py-4 flex flex-col gap-4">
              <Link
                to="/"
                className="text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/contact"
                className="text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              {isAuthenticated && isProvider && (
                <Link
                  to="/provider"
                  className="text-sm font-medium flex items-center gap-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Briefcase className="w-4 h-4" />
                  Provider Dashboard
                </Link>
              )}
              {isAuthenticated && isTaker && (
                <Link
                  to="/taker"
                  className="text-sm font-medium flex items-center gap-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Search className="w-4 h-4" />
                  Find Services
                </Link>
              )}
              <Link
                to="/admin"
                className="text-sm font-medium flex items-center gap-1 text-amber-700"
                onClick={() => setMobileMenuOpen(false)}
                data-ocid="nav.admin.link"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-muted/30">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="font-bold text-lg">Pennywise</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting service providers with those who need them.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Providers</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>List Your Services</li>
                <li>Manage Bookings</li>
                <li>Track Earnings</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">For Clients</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Find Services</li>
                <li>Book Appointments</li>
                <li>Leave Reviews</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex gap-4">
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SiX className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SiFacebook className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SiLinkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SiInstagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Pennywise. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
