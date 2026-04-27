import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, Moon, Sun, X, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "../hooks/useTheme";
import { Chatbot } from "./Chatbot";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/auth", label: "Login / Signup" },
  { href: "/ngo", label: "NGO Dashboard" },
  { href: "/volunteer", label: "Volunteer Hub" },
  { href: "/request", label: "Request Form" },
  { href: "/map", label: "Impact Map" },
  { href: "/profile", label: "Profile" },
];

function NavLink({
  href,
  label,
  onClick,
}: { href: string; label: string; onClick?: () => void }) {
  const location = useLocation();
  const isActive = location.pathname === href;
  return (
    <Link
      to={href}
      onClick={onClick}
      data-ocid={`nav.${label.toLowerCase().replace(/[\s/]/g, "_")}.link`}
      className={`relative text-sm font-medium transition-colors duration-200 px-1 py-0.5 ${
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
      {isActive && (
        <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-gradient-to-r from-primary to-accent rounded-full" />
      )}
    </Link>
  );
}

function ThemeToggle({ className = "" }: { className?: string }) {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      data-ocid="nav.theme_toggle"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 glass hover:border-primary/40 hover:shadow-glow-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
    >
      <span
        className={`absolute transition-all duration-300 ${
          isDark
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 rotate-90 scale-75"
        }`}
      >
        <Moon className="w-4 h-4 text-primary" />
      </span>
      <span
        className={`absolute transition-all duration-300 ${
          isDark
            ? "opacity-0 -rotate-90 scale-75"
            : "opacity-100 rotate-0 scale-100"
        }`}
      >
        <Sun className="w-4 h-4 text-accent" />
      </span>
    </button>
  );
}

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Floating glassmorphic header */}
      <header
        data-ocid="nav.header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "py-2 glass-strong shadow-glass-md" : "py-4 glass"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            data-ocid="nav.logo.link"
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow-primary group-hover:shadow-glow-cyan transition-shadow duration-300">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-foreground">
              Aid<span className="text-primary">Link</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} />
            ))}
          </nav>

          {/* CTA + Theme toggle + Mobile menu */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <ThemeToggle className="hidden md:flex" />

            <Link to="/auth" className="hidden md:block">
              <Button
                data-ocid="nav.connect_button"
                size="sm"
                className="gradient-primary text-primary-foreground hover:opacity-90 transition-smooth glow-primary border-0 ml-1"
              >
                Connect Now
              </Button>
            </Link>

            {/* Mobile hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  data-ocid="nav.mobile_menu.toggle"
                  aria-label="Open menu"
                >
                  {mobileOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="glass-strong border-border w-72"
                data-ocid="nav.mobile_menu.sheet"
              >
                <div className="flex flex-col gap-2 mt-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                        <Zap className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <span className="font-display font-bold text-xl">
                        Aid<span className="text-primary">Link</span>
                      </span>
                    </div>
                    <ThemeToggle />
                  </div>
                  {NAV_LINKS.map((link) => (
                    <NavLink
                      key={link.href}
                      href={link.href}
                      label={link.label}
                      onClick={() => setMobileOpen(false)}
                    />
                  ))}
                  <Link
                    to="/auth"
                    className="mt-4"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button
                      className="w-full gradient-primary text-primary-foreground border-0"
                      data-ocid="nav.mobile_connect.button"
                    >
                      Connect Now
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 pt-16">{children}</main>

      {/* Footer */}
      <footer
        className="relative z-10 border-t border-border"
        style={{
          background: "oklch(0.1 0.02 260 / 0.6)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded gradient-primary flex items-center justify-center">
                <Zap className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold text-foreground">
                AidLink
              </span>
              <span className="text-muted-foreground text-sm">
                — Smart Resource Allocation
              </span>
            </div>
           <p className="text-muted-foreground text-sm">
  © {new Date().getFullYear()} VolunteerConnect AI. All rights reserved.
         </p>
          </div>
        </div>
      </footer>

      {/* Persistent chatbot */}
      <Chatbot />
    </div>
  );
}
