import type { Volunteer } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useNGOs,
  useRecentVolunteers,
  useRequests,
  useVolunteers,
} from "@/hooks/useAidLink";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  Building2,
  CheckCircle,
  ChevronDown,
  HandHeart,
  MapPin,
  Package,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Animated counter ────────────────────────────────────────────────────────
function useCounter(target: number, duration = 2000, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let current = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(Math.floor(current));
      if (current >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, started]);
  return count;
}

// ─── Intersection-visible hook ───────────────────────────────────────────────
function useVisible(threshold = 0.25) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Particle canvas ─────────────────────────────────────────────────────────
const PARTICLE_COLORS = [
  "rgba(104,174,255,0.7)",
  "rgba(168,85,247,0.7)",
  "rgba(112,204,255,0.7)",
  "rgba(52,211,153,0.6)",
];

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 28 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 1,
      color:
        PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      tabIndex={-1}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

// ─── Stats data ──────────────────────────────────────────────────────────────
const STAT_CARDS = [
  {
    icon: Building2,
    label: "NGOs Registered",
    target: 500,
    suffix: "+",
    color: "text-primary",
    bg: "rgba(104,174,255,0.12)",
    glow: "rgba(104,174,255,0.25)",
  },
  {
    icon: Users,
    label: "Active Volunteers",
    target: 2000,
    suffix: "+",
    color: "text-accent",
    bg: "rgba(168,85,247,0.12)",
    glow: "rgba(168,85,247,0.25)",
  },
  {
    icon: Package,
    label: "Resources Allocated",
    target: 10000,
    suffix: "+",
    color: "text-secondary",
    bg: "rgba(112,204,255,0.12)",
    glow: "rgba(112,204,255,0.25)",
  },
  {
    icon: HandHeart,
    label: "Success Rate",
    target: 98,
    suffix: "%",
    color: "text-chart-4",
    bg: "rgba(52,211,153,0.12)",
    glow: "rgba(52,211,153,0.25)",
  },
];

function StatsSection({
  live,
}: { live: { ngos: number; volunteers: number; requests: number } }) {
  const { ref, visible } = useVisible(0.3);
  const n = useCounter(live.ngos || 500, 2000, visible);
  const v = useCounter(live.volunteers || 2000, 2200, visible);
  const r = useCounter(live.requests || 10000, 2500, visible);
  const s = useCounter(98, 1800, visible);
  const values = [n, v, r, s];

  return (
    <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {STAT_CARDS.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            data-ocid={`home.stats.item.${i + 1}`}
            className="glass rounded-2xl p-6 text-center group cursor-default"
            style={{
              transition:
                "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease",
              transitionDelay: `${i * 80}ms`,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <div
              className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center"
              style={{
                background: card.bg,
                boxShadow: `0 0 20px ${card.glow}`,
              }}
            >
              <Icon className={`w-7 h-7 ${card.color}`} />
            </div>
            <div
              className={`text-3xl font-display font-bold ${card.color} mb-1`}
            >
              {values[i].toLocaleString()}
              {card.suffix}
            </div>
            <div className="text-sm text-muted-foreground font-body">
              {card.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Volunteer avatar helpers ─────────────────────────────────────────────────
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #3b6fe8, #7c3aed)",
  "linear-gradient(135deg, #0ea5e9, #2563eb)",
  "linear-gradient(135deg, #8b5cf6, #ec4899)",
  "linear-gradient(135deg, #06b6d4, #10b981)",
  "linear-gradient(135deg, #f59e0b, #ef4444)",
  "linear-gradient(135deg, #10b981, #3b82f6)",
  "linear-gradient(135deg, #a855f7, #3b82f6)",
  "linear-gradient(135deg, #ec4899, #8b5cf6)",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatLocation(lat: number, lng: number): string {
  // Map coordinate ranges to descriptive region names
  if (lat > 20 && lat < 40 && lng > 68 && lng < 97) return "India";
  if (lat > 25 && lat < 50 && lng > -125 && lng < -65) return "North America";
  if (lat > 35 && lat < 70 && lng > -10 && lng < 40) return "Europe";
  if (lat > -35 && lat < 15 && lng > 10 && lng < 50) return "Africa";
  if (lat > -55 && lat < 15 && lng > -82 && lng < -34) return "South America";
  if (lat > 10 && lat < 55 && lng > 97 && lng < 145) return "East Asia";
  if (lat > -10 && lat < 15 && lng > 95 && lng < 140) return "Southeast Asia";
  if (lat > 8 && lat < 37 && lng > 35 && lng < 60) return "Middle East";
  return "Field Volunteer";
}

// ─── Volunteer Card ───────────────────────────────────────────────────────────
function VolunteerCard({
  volunteer,
  index,
  visible,
}: { volunteer: Volunteer; index: number; visible: boolean }) {
  const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
  const location = formatLocation(volunteer.lat, volunteer.lng);
  const shownSkills = volunteer.skills.slice(0, 2);
  const completedCount = Number(volunteer.completedTasks);

  return (
    <div
      data-ocid={`home.volunteers.item.${index + 1}`}
      className="glass rounded-2xl p-5 hover-lift flex flex-col gap-4 group relative overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition:
          "opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease",
        transitionDelay: `${index * 50}ms`,
        border: volunteer.isAvailable
          ? "1px solid rgba(52,211,153,0.2)"
          : "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Corner glow for available volunteers */}
      {volunteer.isAvailable && (
        <div
          className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(52,211,153,0.12), transparent)",
            filter: "blur(16px)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Top row: avatar + name + badge */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0"
          style={{
            background: gradient,
            boxShadow: volunteer.isAvailable
              ? "0 0 14px rgba(52,211,153,0.35)"
              : "0 0 8px rgba(104,174,255,0.2)",
          }}
        >
          {getInitials(volunteer.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-foreground text-sm truncate leading-tight">
            {volunteer.name}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <span className="text-xs text-muted-foreground truncate">
              {location}
            </span>
          </div>
        </div>
        {/* Availability badge */}
        <span
          data-ocid={`home.volunteers.badge.${index + 1}`}
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium flex-shrink-0"
          style={
            volunteer.isAvailable
              ? {
                  background: "rgba(52,211,153,0.15)",
                  color: "oklch(0.72 0.22 155)",
                  border: "1px solid rgba(52,211,153,0.3)",
                }
              : {
                  background: "rgba(255,255,255,0.05)",
                  color: "oklch(0.6 0.02 260)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }
          }
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: volunteer.isAvailable
                ? "oklch(0.72 0.22 155)"
                : "oklch(0.5 0.02 260)",
            }}
            aria-hidden="true"
          />
          {volunteer.isAvailable ? "Available" : "Unavailable"}
        </span>
      </div>

      {/* Skills chips */}
      {shownSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {shownSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
              style={{
                background: "rgba(104,174,255,0.1)",
                color: "rgba(104,174,255,0.9)",
                border: "1px solid rgba(104,174,255,0.2)",
              }}
            >
              {skill}
            </span>
          ))}
          {volunteer.skills.length > 2 && (
            <span
              className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium"
              style={{
                background: "rgba(168,85,247,0.1)",
                color: "rgba(168,85,247,0.9)",
                border: "1px solid rgba(168,85,247,0.2)",
              }}
            >
              +{volunteer.skills.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Completed tasks */}
      <div className="flex items-center gap-1.5 mt-auto">
        <CheckCircle className="w-3.5 h-3.5 text-chart-4 flex-shrink-0" />
        <span className="text-xs text-muted-foreground">
          <span className="text-foreground font-semibold">
            {completedCount}
          </span>{" "}
          tasks completed
        </span>
      </div>
    </div>
  );
}

const SKELETON_IDS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"] as const;

// ─── Volunteer loading skeleton ───────────────────────────────────────────────
function VolunteerSkeleton({ index }: { index: number }) {
  return (
    <div
      className="glass rounded-2xl p-5 flex flex-col gap-4"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center gap-3">
        <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
        <Skeleton className="h-5 w-20 rounded-full flex-shrink-0" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded" />
        <Skeleton className="h-5 w-20 rounded" />
      </div>
      <Skeleton className="h-4 w-32 rounded" />
    </div>
  );
}

// ─── New Volunteers section ───────────────────────────────────────────────────
function NewVolunteersSection() {
  const { ref, visible } = useVisible(0.15);
  const { data: volunteers, isLoading } = useRecentVolunteers(8);

  return (
    <section
      id="volunteers"
      data-ocid="home.volunteers.section"
      className="py-24 relative overflow-hidden"
      style={{ background: "oklch(0.11 0.015 260 / 1)" }}
    >
      {/* Background gradient orbs */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(52,211,153,0.06), transparent)",
          filter: "blur(60px)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(104,174,255,0.06), transparent)",
          filter: "blur(60px)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div
          className="text-center mb-14"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <Badge
            variant="outline"
            className="mb-4 border-chart-4/40 text-chart-4 text-xs tracking-widest uppercase"
          >
            Community Growth
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            New{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, oklch(0.72 0.22 155) 0%, oklch(0.72 0.21 270) 100%)",
              }}
            >
              Volunteers
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            Recently joined volunteers ready to help — connect and deploy them
            to where they're needed most.
          </p>
        </div>

        {/* Grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
        >
          {isLoading
            ? SKELETON_IDS.map((id, i) => (
                <VolunteerSkeleton key={id} index={i} />
              ))
            : (volunteers ?? []).map((v, i) => (
                <VolunteerCard
                  key={String(v.id)}
                  volunteer={v}
                  index={i}
                  visible={visible}
                />
              ))}
        </div>

        {/* Empty state */}
        {!isLoading && (!volunteers || volunteers.length === 0) && (
          <div
            data-ocid="home.volunteers.empty_state"
            className="glass rounded-2xl p-12 text-center max-w-md mx-auto mt-4"
          >
            <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              No volunteers registered yet. Be the first to join!
            </p>
            <Link to="/auth" className="mt-4 inline-block">
              <Button
                size="sm"
                className="mt-4 gradient-primary text-primary-foreground border-0"
              >
                Join as Volunteer
              </Button>
            </Link>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-10">
          <Link to="/volunteer">
            <Button
              size="lg"
              variant="outline"
              data-ocid="home.volunteers.view_all_button"
              className="border-border hover:border-chart-4 text-foreground hover:-translate-y-0.5 transition-smooth px-8 h-12 text-base"
              style={{ borderColor: "rgba(52,211,153,0.35)" }}
            >
              <Users className="w-4 h-4 mr-2" />
              View All Volunteers
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Features data ───────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Zap,
    title: "Smart Matching",
    description:
      "AI-powered algorithm instantly pairs NGOs with the most capable volunteers based on skills, proximity, and urgency.",
    borderColor: "rgba(104,174,255,0.6)",
    iconBg: "rgba(104,174,255,0.12)",
    iconColor: "text-primary",
    glowClass: "glow-primary",
  },
  {
    icon: MapPin,
    title: "Real-Time Tracking",
    description:
      "Live map command center gives full situational awareness — track every request, volunteer, and resource in motion.",
    borderColor: "rgba(112,204,255,0.6)",
    iconBg: "rgba(112,204,255,0.12)",
    iconColor: "text-secondary",
    glowClass: "glow-cyan",
  },
  {
    icon: Bot,
    title: "AI-Powered",
    description:
      "Gemini-powered chatbot answers queries, suggests optimal deployments, and automates routine coordination tasks.",
    borderColor: "rgba(168,85,247,0.6)",
    iconBg: "rgba(168,85,247,0.12)",
    iconColor: "text-accent",
    glowClass: "glow-accent",
  },
];

function FeaturesSection() {
  const { ref, visible } = useVisible(0.2);
  return (
    <section
      id="features"
      data-ocid="home.features.section"
      className="py-24"
      style={{ background: "oklch(0.1 0.015 260 / 1)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="mb-4 border-accent/40 text-accent text-xs tracking-widest uppercase"
          >
            Platform Capabilities
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              AidLink?
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            Three pillars that make humanitarian coordination faster, smarter,
            and more impactful.
          </p>
        </div>

        <div ref={ref} className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                data-ocid={`home.features.item.${i + 1}`}
                className="glass rounded-2xl p-8 hover-lift relative overflow-hidden group"
                style={{
                  borderTop: `2px solid ${f.borderColor}`,
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(32px)",
                  transition: "opacity 0.5s ease, transform 0.5s ease",
                  transitionDelay: `${i * 150}ms`,
                }}
              >
                {/* Subtle corner glow */}
                <div
                  className="absolute top-0 left-0 w-32 h-32 rounded-full pointer-events-none"
                  style={{
                    background: f.borderColor.replace("0.6", "0.06"),
                    filter: "blur(30px)",
                    transform: "translate(-30%,-30%)",
                  }}
                  aria-hidden="true"
                />
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:${f.glowClass} transition-shadow duration-300`}
                  style={{ background: f.iconBg }}
                >
                  <Icon className={`w-7 h-7 ${f.iconColor}`} />
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-3">
                  {f.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works data ───────────────────────────────────────────────────────
const STEPS = [
  {
    num: "1",
    title: "NGOs Post Needs",
    description:
      "Verified NGOs submit precise resource requests with urgency levels, quantities, and location data.",
    color: "rgba(104,174,255,0.8)",
  },
  {
    num: "2",
    title: "AI Matches Resources",
    description:
      "Our algorithm analyses available volunteers, skills, and proximity to surface the perfect match instantly.",
    color: "rgba(168,85,247,0.8)",
  },
  {
    num: "3",
    title: "Volunteers Deploy",
    description:
      "Matched volunteers receive instant alerts, confirm availability, and navigate to the site in real time.",
    color: "rgba(112,204,255,0.8)",
  },
];

function HowItWorksSection() {
  const { ref, visible } = useVisible(0.2);
  return (
    <section
      data-ocid="home.how_it_works.section"
      className="py-24 relative"
      style={{ background: "oklch(0.08 0.01 260 / 1)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="mb-4 border-primary/40 text-primary text-xs tracking-widest uppercase"
          >
            The Flow
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg">
            From posting a need to boots on the ground — in minutes.
          </p>
        </div>

        <div ref={ref} className="relative">
          {/* Connecting gradient line (desktop only) */}
          <div
            className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(104,174,255,0.6) 0%, rgba(168,85,247,0.6) 50%, rgba(112,204,255,0.6) 100%)",
              top: "2.5rem",
              left: "16.67%",
              right: "16.67%",
            }}
            aria-hidden="true"
          />

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                data-ocid={`home.steps.item.${i + 1}`}
                className="flex flex-col items-center text-center"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(28px)",
                  transition: "opacity 0.5s ease, transform 0.5s ease",
                  transitionDelay: `${i * 180}ms`,
                }}
              >
                {/* Step circle */}
                <div
                  className="w-20 h-20 rounded-full glass-strong flex items-center justify-center mb-6 relative z-10"
                  style={{
                    boxShadow: `0 0 28px ${step.color.replace("0.8", "0.35")}`,
                    border: `2px solid ${step.color}`,
                  }}
                >
                  <span
                    className="font-display font-bold text-2xl"
                    style={{ color: step.color }}
                  >
                    {step.num}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Impact CTA section ──────────────────────────────────────────────────────
function ImpactSection() {
  const { ref, visible } = useVisible(0.2);
  return (
    <section
      data-ocid="home.impact.section"
      className="py-24 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.12 0.03 290) 0%, oklch(0.1 0.04 270) 50%, oklch(0.14 0.03 200) 100%)",
      }}
    >
      {/* Background orbs */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.15), transparent)",
          filter: "blur(50px)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(112,204,255,0.12), transparent)",
          filter: "blur(50px)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          ref={ref}
          className="glass-strong rounded-3xl p-12 md:p-16 max-w-3xl mx-auto text-center"
          style={{
            border: "1px solid rgba(168,85,247,0.25)",
            boxShadow:
              "0 0 60px rgba(168,85,247,0.12), 0 0 30px rgba(112,204,255,0.08)",
            opacity: visible ? 1 : 0,
            transform: visible
              ? "translateY(0) scale(1)"
              : "translateY(32px) scale(0.97)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <Badge
            variant="outline"
            className="mb-6 border-accent/40 text-accent text-xs tracking-widest uppercase"
          >
            Join the Movement
          </Badge>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            Join{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, oklch(0.75 0.26 290), oklch(0.75 0.25 270))",
              }}
            >
              500+ NGOs
            </span>{" "}
            already using AidLink
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Connect resources with people who need them most. Start your
            verified profile today and amplify your humanitarian impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <Button
                size="lg"
                data-ocid="home.impact.get_started_button"
                className="gradient-primary text-primary-foreground border-0 glow-primary hover:-translate-y-0.5 transition-smooth px-10 h-12 text-base font-semibold"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/map">
              <Button
                size="lg"
                variant="outline"
                data-ocid="home.impact.map_button"
                className="border-border text-foreground hover:border-accent hover:-translate-y-0.5 transition-smooth px-10 h-12 text-base"
              >
                View Live Map
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main page component ──────────────────────────────────────────────────────
export function HomePage() {
  const { data: requests } = useRequests();
  const { data: ngos } = useNGOs();
  const { data: volunteers } = useVolunteers();

  const scrollDown = () => {
    document.getElementById("stats")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative overflow-hidden">
      {/* ── Hero ── */}
      <section
        data-ocid="home.hero.section"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #0f172a 0%, #1e3a8a 35%, #4c1d95 70%, #0d4a4a 100%)",
        }}
      >
        {/* Hero background image overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-aidlink-bg.dim_1400x900.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.25,
          }}
          aria-hidden="true"
        />

        {/* Animated particles */}
        <ParticleField />

        {/* Deep color orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(104,174,255,0.12), transparent)",
            filter: "blur(60px)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none animate-float"
          style={{
            background:
              "radial-gradient(circle, rgba(168,85,247,0.1), transparent)",
            filter: "blur(60px)",
            animationDelay: "1.5s",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full pointer-events-none animate-float"
          style={{
            background:
              "radial-gradient(circle, rgba(52,211,153,0.08), transparent)",
            filter: "blur(50px)",
            animationDelay: "2.8s",
          }}
          aria-hidden="true"
        />

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 animate-fade-in">
          <Badge
            variant="outline"
            className="mb-6 px-5 py-1.5 border-primary/30 text-primary font-body text-xs tracking-widest uppercase"
          >
            Smart Resource Allocation Platform
          </Badge>

          <h1
            className="font-display font-bold leading-tight tracking-tight mb-6"
            style={{
              fontSize: "clamp(3.5rem, 10vw, 7rem)",
              textShadow:
                "0 0 60px rgba(104,174,255,0.4), 0 0 120px rgba(168,85,247,0.2)",
              color: "white",
            }}
          >
            Aid
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              Link
            </span>
          </h1>

          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-4 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            Connecting NGOs, Volunteers &amp; Resources
          </p>
          <p
            className="text-base max-w-xl mx-auto mb-10 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            An intelligent platform that ensures the right help reaches the
            right place at exactly the right time — powered by AI.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth">
              <Button
                size="lg"
                data-ocid="home.hero.join_ngo_button"
                className="gradient-primary text-primary-foreground border-0 glow-primary hover:-translate-y-1 transition-smooth px-8 h-13 text-base font-semibold"
                style={{ height: "3.25rem" }}
              >
                <Building2 className="w-4 h-4 mr-2" />
                Join as NGO
              </Button>
            </Link>
            <Link to="/auth">
              <Button
                size="lg"
                variant="outline"
                data-ocid="home.hero.volunteer_button"
                className="border-border hover:border-primary text-foreground hover:-translate-y-1 transition-smooth px-8 h-13 text-base"
                style={{
                  height: "3.25rem",
                  borderColor: "rgba(112,204,255,0.4)",
                  color: "rgba(255,255,255,0.9)",
                  boxShadow: "0 0 16px rgba(112,204,255,0.15)",
                }}
              >
                <Users className="w-4 h-4 mr-2" />
                Volunteer Now
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <button
          type="button"
          onClick={scrollDown}
          aria-label="Scroll to stats"
          data-ocid="home.hero.scroll_cue"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          <ChevronDown className="w-7 h-7" />
        </button>
      </section>

      {/* ── Stats ── */}
      <section
        id="stats"
        data-ocid="home.stats.section"
        className="py-20"
        style={{ background: "oklch(0.12 0.02 260 / 1)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Measurable Impact at Scale
            </h2>
            <p className="text-muted-foreground">
              Real numbers from a growing global network of changemakers.
            </p>
          </div>
          <StatsSection
            live={{
              ngos: ngos?.length ?? 500,
              volunteers: volunteers?.length ?? 2000,
              requests: requests?.length ?? 10000,
            }}
          />
        </div>
      </section>

      {/* ── New Volunteers ── */}
      <NewVolunteersSection />

      {/* ── Features ── */}
      <FeaturesSection />

      {/* ── How It Works ── */}
      <HowItWorksSection />

      {/* ── Impact CTA ── */}
      <ImpactSection />
    </div>
  );
}
