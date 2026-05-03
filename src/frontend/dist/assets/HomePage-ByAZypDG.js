import { c as createLucideIcon, j as jsxRuntimeExports, L as Link, B as Button, r as reactExports, Z as Zap, a as Bot } from "./index-BZ7Eu0u-.js";
import { B as Badge } from "./badge-B5n1u1Hh.js";
import { S as Skeleton } from "./skeleton-DMy__n21.js";
import { u as useRequests, a as useNGOs, b as useVolunteers, c as useRecentVolunteers, M as MapPin } from "./useAidLink-PClPnHG1.js";
import { B as Building2 } from "./building-2-DOluFPuN.js";
import { U as Users } from "./users-CHdSTdOG.js";
import { C as ChevronDown } from "./chevron-down-B8L5xDdJ.js";
import { P as Package } from "./package-CJb8kLTi.js";
import { C as CircleCheckBig } from "./circle-check-big-DnBn6vlC.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16", key: "1ifwr1" }],
  [
    "path",
    {
      d: "m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9",
      key: "17abbs"
    }
  ],
  ["path", { d: "m2 15 6 6", key: "10dquu" }],
  [
    "path",
    {
      d: "M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.73 2.73 0 0 0 16 4a2.78 2.78 0 0 0-5 1.8c0 1.2.8 2 1.5 2.8L16 12Z",
      key: "1h3036"
    }
  ]
];
const HandHeart = createLucideIcon("hand-heart", __iconNode);
function useCounter(target, duration = 2e3, started = false) {
  const [count, setCount] = reactExports.useState(0);
  reactExports.useEffect(() => {
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
function useVisible(threshold = 0.25) {
  const ref = reactExports.useRef(null);
  const [visible, setVisible] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}
const PARTICLE_COLORS = [
  "rgba(104,174,255,0.7)",
  "rgba(168,85,247,0.7)",
  "rgba(112,204,255,0.7)",
  "rgba(52,211,153,0.6)"
];
function ParticleField() {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId;
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
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      tabIndex: -1,
      className: "absolute inset-0 w-full h-full pointer-events-none"
    }
  );
}
const STAT_CARDS = [
  {
    icon: Building2,
    label: "NGOs Registered",
    target: 500,
    suffix: "+",
    color: "text-primary",
    bg: "rgba(104,174,255,0.12)",
    glow: "rgba(104,174,255,0.25)"
  },
  {
    icon: Users,
    label: "Active Volunteers",
    target: 2e3,
    suffix: "+",
    color: "text-accent",
    bg: "rgba(168,85,247,0.12)",
    glow: "rgba(168,85,247,0.25)"
  },
  {
    icon: Package,
    label: "Resources Allocated",
    target: 1e4,
    suffix: "+",
    color: "text-secondary",
    bg: "rgba(112,204,255,0.12)",
    glow: "rgba(112,204,255,0.25)"
  },
  {
    icon: HandHeart,
    label: "Success Rate",
    target: 98,
    suffix: "%",
    color: "text-chart-4",
    bg: "rgba(52,211,153,0.12)",
    glow: "rgba(52,211,153,0.25)"
  }
];
function StatsSection({
  live
}) {
  const { ref, visible } = useVisible(0.3);
  const n = useCounter(live.ngos || 500, 2e3, visible);
  const v = useCounter(live.volunteers || 2e3, 2200, visible);
  const r = useCounter(live.requests || 1e4, 2500, visible);
  const s = useCounter(98, 1800, visible);
  const values = [n, v, r, s];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: "grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6", children: STAT_CARDS.map((card, i) => {
    const Icon = card.icon;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": `home.stats.item.${i + 1}`,
        className: "glass rounded-2xl p-6 text-center group cursor-default",
        style: {
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s ease",
          transitionDelay: `${i * 80}ms`,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center",
              style: {
                background: card.bg,
                boxShadow: `0 0 20px ${card.glow}`
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-7 h-7 ${card.color}` })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `text-3xl font-display font-bold ${card.color} mb-1`,
              children: [
                values[i].toLocaleString(),
                card.suffix
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground font-body", children: card.label })
        ]
      },
      card.label
    );
  }) });
}
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #3b6fe8, #7c3aed)",
  "linear-gradient(135deg, #0ea5e9, #2563eb)",
  "linear-gradient(135deg, #8b5cf6, #ec4899)",
  "linear-gradient(135deg, #06b6d4, #10b981)",
  "linear-gradient(135deg, #f59e0b, #ef4444)",
  "linear-gradient(135deg, #10b981, #3b82f6)",
  "linear-gradient(135deg, #a855f7, #3b82f6)",
  "linear-gradient(135deg, #ec4899, #8b5cf6)"
];
function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function formatLocation(lat, lng) {
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
function VolunteerCard({
  volunteer,
  index,
  visible
}) {
  const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
  const location = formatLocation(volunteer.lat, volunteer.lng);
  const shownSkills = volunteer.skills.slice(0, 2);
  const completedCount = Number(volunteer.completedTasks);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `home.volunteers.item.${index + 1}`,
      className: "glass rounded-2xl p-5 hover-lift flex flex-col gap-4 group relative overflow-hidden",
      style: {
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease",
        transitionDelay: `${index * 50}ms`,
        border: volunteer.isAvailable ? "1px solid rgba(52,211,153,0.2)" : "1px solid rgba(255,255,255,0.07)"
      },
      children: [
        volunteer.isAvailable && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none",
            style: {
              background: "radial-gradient(circle, rgba(52,211,153,0.12), transparent)",
              filter: "blur(16px)"
            },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-12 h-12 rounded-full flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0",
              style: {
                background: gradient,
                boxShadow: volunteer.isAvailable ? "0 0 14px rgba(52,211,153,0.35)" : "0 0 8px rgba(104,174,255,0.2)"
              },
              children: getInitials(volunteer.name)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground text-sm truncate leading-tight", children: volunteer.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3 text-muted-foreground flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground truncate", children: location })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              "data-ocid": `home.volunteers.badge.${index + 1}`,
              className: "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium flex-shrink-0",
              style: volunteer.isAvailable ? {
                background: "rgba(52,211,153,0.15)",
                color: "oklch(0.72 0.22 155)",
                border: "1px solid rgba(52,211,153,0.3)"
              } : {
                background: "rgba(255,255,255,0.05)",
                color: "oklch(0.6 0.02 260)",
                border: "1px solid rgba(255,255,255,0.1)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "w-1.5 h-1.5 rounded-full",
                    style: {
                      background: volunteer.isAvailable ? "oklch(0.72 0.22 155)" : "oklch(0.5 0.02 260)"
                    },
                    "aria-hidden": "true"
                  }
                ),
                volunteer.isAvailable ? "Available" : "Unavailable"
              ]
            }
          )
        ] }),
        shownSkills.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", children: [
          shownSkills.map((skill) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
              style: {
                background: "rgba(104,174,255,0.1)",
                color: "rgba(104,174,255,0.9)",
                border: "1px solid rgba(104,174,255,0.2)"
              },
              children: skill
            },
            skill
          )),
          volunteer.skills.length > 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
              style: {
                background: "rgba(168,85,247,0.1)",
                color: "rgba(168,85,247,0.9)",
                border: "1px solid rgba(168,85,247,0.2)"
              },
              children: [
                "+",
                volunteer.skills.length - 2
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3.5 h-3.5 text-chart-4 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-semibold", children: completedCount }),
            " ",
            "tasks completed"
          ] })
        ] })
      ]
    }
  );
}
const SKELETON_IDS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];
function VolunteerSkeleton({ index }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "glass rounded-2xl p-5 flex flex-col gap-4",
      style: { animationDelay: `${index * 80}ms` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-12 h-12 rounded-full flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4 rounded" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2 rounded" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-20 rounded-full flex-shrink-0" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16 rounded" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-20 rounded" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32 rounded" })
      ]
    }
  );
}
function NewVolunteersSection() {
  const { ref, visible } = useVisible(0.15);
  const { data: volunteers, isLoading } = useRecentVolunteers(8);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      id: "volunteers",
      "data-ocid": "home.volunteers.section",
      className: "py-24 relative overflow-hidden",
      style: { background: "oklch(0.11 0.015 260 / 1)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none",
            style: {
              background: "radial-gradient(circle, rgba(52,211,153,0.06), transparent)",
              filter: "blur(60px)"
            },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none",
            style: {
              background: "radial-gradient(circle, rgba(104,174,255,0.06), transparent)",
              filter: "blur(60px)"
            },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "text-center mb-14",
              style: {
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.5s ease, transform 0.5s ease"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: "mb-4 border-chart-4/40 text-chart-4 text-xs tracking-widest uppercase",
                    children: "Community Growth"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-4xl md:text-5xl font-bold text-foreground mb-4", children: [
                  "New",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-transparent bg-clip-text",
                      style: {
                        backgroundImage: "linear-gradient(135deg, oklch(0.72 0.22 155) 0%, oklch(0.72 0.21 270) 100%)"
                      },
                      children: "Volunteers"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed", children: "Recently joined volunteers ready to help — connect and deploy them to where they're needed most." })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              ref,
              className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5",
              children: isLoading ? SKELETON_IDS.map((id, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(VolunteerSkeleton, { index: i }, id)) : (volunteers ?? []).map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                VolunteerCard,
                {
                  volunteer: v,
                  index: i,
                  visible
                },
                String(v.id)
              ))
            }
          ),
          !isLoading && (!volunteers || volunteers.length === 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "home.volunteers.empty_state",
              className: "glass rounded-2xl p-12 text-center max-w-md mx-auto mt-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-10 h-10 text-muted-foreground mx-auto mb-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No volunteers registered yet. Be the first to join!" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", className: "mt-4 inline-block", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    className: "mt-4 gradient-primary text-primary-foreground border-0",
                    children: "Join as Volunteer"
                  }
                ) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mt-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/volunteer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "lg",
              variant: "outline",
              "data-ocid": "home.volunteers.view_all_button",
              className: "border-border hover:border-chart-4 text-foreground hover:-translate-y-0.5 transition-smooth px-8 h-12 text-base",
              style: { borderColor: "rgba(52,211,153,0.35)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4 mr-2" }),
                "View All Volunteers",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 ml-2" })
              ]
            }
          ) }) })
        ] })
      ]
    }
  );
}
const FEATURES = [
  {
    icon: Zap,
    title: "Smart Matching",
    description: "AI-powered algorithm instantly pairs NGOs with the most capable volunteers based on skills, proximity, and urgency.",
    borderColor: "rgba(104,174,255,0.6)",
    iconBg: "rgba(104,174,255,0.12)",
    iconColor: "text-primary",
    glowClass: "glow-primary"
  },
  {
    icon: MapPin,
    title: "Real-Time Tracking",
    description: "Live map command center gives full situational awareness — track every request, volunteer, and resource in motion.",
    borderColor: "rgba(112,204,255,0.6)",
    iconBg: "rgba(112,204,255,0.12)",
    iconColor: "text-secondary",
    glowClass: "glow-cyan"
  },
  {
    icon: Bot,
    title: "AI-Powered",
    description: "Gemini-powered chatbot answers queries, suggests optimal deployments, and automates routine coordination tasks.",
    borderColor: "rgba(168,85,247,0.6)",
    iconBg: "rgba(168,85,247,0.12)",
    iconColor: "text-accent",
    glowClass: "glow-accent"
  }
];
function FeaturesSection() {
  const { ref, visible } = useVisible(0.2);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      id: "features",
      "data-ocid": "home.features.section",
      className: "py-24",
      style: { background: "oklch(0.1 0.015 260 / 1)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-16", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "mb-4 border-accent/40 text-accent text-xs tracking-widest uppercase",
              children: "Platform Capabilities"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-4xl md:text-5xl font-bold text-foreground mb-4", children: [
            "Why",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-transparent bg-clip-text",
                style: { backgroundImage: "var(--gradient-primary)" },
                children: "AidLink?"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed", children: "Three pillars that make humanitarian coordination faster, smarter, and more impactful." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: "grid md:grid-cols-3 gap-6", children: FEATURES.map((f, i) => {
          const Icon = f.icon;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `home.features.item.${i + 1}`,
              className: "glass rounded-2xl p-8 hover-lift relative overflow-hidden group",
              style: {
                borderTop: `2px solid ${f.borderColor}`,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(32px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
                transitionDelay: `${i * 150}ms`
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "absolute top-0 left-0 w-32 h-32 rounded-full pointer-events-none",
                    style: {
                      background: f.borderColor.replace("0.6", "0.06"),
                      filter: "blur(30px)",
                      transform: "translate(-30%,-30%)"
                    },
                    "aria-hidden": "true"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:${f.glowClass} transition-shadow duration-300`,
                    style: { background: f.iconBg },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-7 h-7 ${f.iconColor}` })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-xl text-foreground mb-3", children: f.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: f.description })
              ]
            },
            f.title
          );
        }) })
      ] })
    }
  );
}
const STEPS = [
  {
    num: "1",
    title: "NGOs Post Needs",
    description: "Verified NGOs submit precise resource requests with urgency levels, quantities, and location data.",
    color: "rgba(104,174,255,0.8)"
  },
  {
    num: "2",
    title: "AI Matches Resources",
    description: "Our algorithm analyses available volunteers, skills, and proximity to surface the perfect match instantly.",
    color: "rgba(168,85,247,0.8)"
  },
  {
    num: "3",
    title: "Volunteers Deploy",
    description: "Matched volunteers receive instant alerts, confirm availability, and navigate to the site in real time.",
    color: "rgba(112,204,255,0.8)"
  }
];
function HowItWorksSection() {
  const { ref, visible } = useVisible(0.2);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      "data-ocid": "home.how_it_works.section",
      className: "py-24 relative",
      style: { background: "oklch(0.08 0.01 260 / 1)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-16", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "mb-4 border-primary/40 text-primary text-xs tracking-widest uppercase",
              children: "The Flow"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl md:text-5xl font-bold text-foreground mb-4", children: "How It Works" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg", children: "From posting a need to boots on the ground — in minutes." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref, className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "hidden md:block absolute top-10 left-1/6 right-1/6 h-px pointer-events-none",
              style: {
                background: "linear-gradient(90deg, rgba(104,174,255,0.6) 0%, rgba(168,85,247,0.6) 50%, rgba(112,204,255,0.6) 100%)",
                top: "2.5rem",
                left: "16.67%",
                right: "16.67%"
              },
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-3 gap-8 md:gap-12", children: STEPS.map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `home.steps.item.${i + 1}`,
              className: "flex flex-col items-center text-center",
              style: {
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(28px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
                transitionDelay: `${i * 180}ms`
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-20 h-20 rounded-full glass-strong flex items-center justify-center mb-6 relative z-10",
                    style: {
                      boxShadow: `0 0 28px ${step.color.replace("0.8", "0.35")}`,
                      border: `2px solid ${step.color}`
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-display font-bold text-2xl",
                        style: { color: step.color },
                        children: step.num
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-xl text-foreground mb-3", children: step.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed max-w-xs", children: step.description })
              ]
            },
            step.num
          )) })
        ] })
      ] })
    }
  );
}
function ImpactSection() {
  const { ref, visible } = useVisible(0.2);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      "data-ocid": "home.impact.section",
      className: "py-24 relative overflow-hidden",
      style: {
        background: "linear-gradient(135deg, oklch(0.12 0.03 290) 0%, oklch(0.1 0.04 270) 50%, oklch(0.14 0.03 200) 100%)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none",
            style: {
              background: "radial-gradient(circle, rgba(168,85,247,0.15), transparent)",
              filter: "blur(50px)"
            },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute -bottom-24 -left-24 w-80 h-80 rounded-full pointer-events-none",
            style: {
              background: "radial-gradient(circle, rgba(112,204,255,0.12), transparent)",
              filter: "blur(50px)"
            },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            ref,
            className: "glass-strong rounded-3xl p-12 md:p-16 max-w-3xl mx-auto text-center",
            style: {
              border: "1px solid rgba(168,85,247,0.25)",
              boxShadow: "0 0 60px rgba(168,85,247,0.12), 0 0 30px rgba(112,204,255,0.08)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.97)",
              transition: "opacity 0.6s ease, transform 0.6s ease"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "mb-6 border-accent/40 text-accent text-xs tracking-widest uppercase",
                  children: "Join the Movement"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight", children: [
                "Join",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-transparent bg-clip-text",
                    style: {
                      backgroundImage: "linear-gradient(135deg, oklch(0.75 0.26 290), oklch(0.75 0.25 270))"
                    },
                    children: "500+ NGOs"
                  }
                ),
                " ",
                "already using AidLink"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed", children: "Connect resources with people who need them most. Start your verified profile today and amplify your humanitarian impact." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "lg",
                    "data-ocid": "home.impact.get_started_button",
                    className: "gradient-primary text-primary-foreground border-0 glow-primary hover:-translate-y-0.5 transition-smooth px-10 h-12 text-base font-semibold",
                    children: [
                      "Get Started",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4 ml-2" })
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/map", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "lg",
                    variant: "outline",
                    "data-ocid": "home.impact.map_button",
                    className: "border-border text-foreground hover:border-accent hover:-translate-y-0.5 transition-smooth px-10 h-12 text-base",
                    children: "View Live Map"
                  }
                ) })
              ] })
            ]
          }
        ) })
      ]
    }
  );
}
function HomePage() {
  const { data: requests } = useRequests();
  const { data: ngos } = useNGOs();
  const { data: volunteers } = useVolunteers();
  const scrollDown = () => {
    var _a;
    (_a = document.getElementById("stats")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        "data-ocid": "home.hero.section",
        className: "relative min-h-screen flex items-center justify-center overflow-hidden",
        style: {
          background: "linear-gradient(160deg, #0f172a 0%, #1e3a8a 35%, #4c1d95 70%, #0d4a4a 100%)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 pointer-events-none",
              style: {
                backgroundImage: "url('/assets/generated/hero-aidlink-bg.dim_1400x900.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: 0.25
              },
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ParticleField, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none",
              style: {
                background: "radial-gradient(circle, rgba(104,174,255,0.12), transparent)",
                filter: "blur(60px)"
              },
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none animate-float",
              style: {
                background: "radial-gradient(circle, rgba(168,85,247,0.1), transparent)",
                filter: "blur(60px)",
                animationDelay: "1.5s"
              },
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full pointer-events-none animate-float",
              style: {
                background: "radial-gradient(circle, rgba(52,211,153,0.08), transparent)",
                filter: "blur(50px)",
                animationDelay: "2.8s"
              },
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 animate-fade-in", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: "mb-6 px-5 py-1.5 border-primary/30 text-primary font-body text-xs tracking-widest uppercase",
                children: "Smart Resource Allocation Platform"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "h1",
              {
                className: "font-display font-bold leading-tight tracking-tight mb-6",
                style: {
                  fontSize: "clamp(3.5rem, 10vw, 7rem)",
                  textShadow: "0 0 60px rgba(104,174,255,0.4), 0 0 120px rgba(168,85,247,0.2)",
                  color: "white"
                },
                children: [
                  "Aid",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-transparent bg-clip-text",
                      style: { backgroundImage: "var(--gradient-primary)" },
                      children: "Link"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-lg md:text-xl max-w-2xl mx-auto mb-4 leading-relaxed",
                style: { color: "rgba(255,255,255,0.7)" },
                children: "Connecting NGOs, Volunteers & Resources"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-base max-w-xl mx-auto mb-10 leading-relaxed",
                style: { color: "rgba(255,255,255,0.5)" },
                children: "An intelligent platform that ensures the right help reaches the right place at exactly the right time — powered by AI."
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "lg",
                  "data-ocid": "home.hero.join_ngo_button",
                  className: "gradient-primary text-primary-foreground border-0 glow-primary hover:-translate-y-1 transition-smooth px-8 h-13 text-base font-semibold",
                  style: { height: "3.25rem" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-4 h-4 mr-2" }),
                    "Join as NGO"
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "lg",
                  "data-ocid": "home.hero.volunteer_button",
                  className: "hover:-translate-y-1 transition-smooth px-8 text-base font-semibold",
                  style: {
                    height: "3.25rem",
                    background: "transparent",
                    border: "2px solid rgba(112,204,255,0.7)",
                    color: "#ffffff",
                    boxShadow: "0 0 20px rgba(112,204,255,0.25), inset 0 0 20px rgba(112,204,255,0.05)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4 mr-2" }),
                    "Volunteer Now"
                  ]
                }
              ) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: scrollDown,
              "aria-label": "Scroll to stats",
              "data-ocid": "home.hero.scroll_cue",
              className: "absolute bottom-8 left-1/2 -translate-x-1/2 animate-float",
              style: { color: "rgba(255,255,255,0.4)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-7 h-7" })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        id: "stats",
        "data-ocid": "home.stats.section",
        className: "py-20",
        style: { background: "oklch(0.12 0.02 260 / 1)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-3xl md:text-4xl font-bold text-foreground mb-3", children: "Measurable Impact at Scale" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Real numbers from a growing global network of changemakers." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatsSection,
            {
              live: {
                ngos: (ngos == null ? void 0 : ngos.length) ?? 500,
                volunteers: (volunteers == null ? void 0 : volunteers.length) ?? 2e3,
                requests: (requests == null ? void 0 : requests.length) ?? 1e4
              }
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NewVolunteersSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FeaturesSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HowItWorksSection, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ImpactSection, {})
  ] });
}
export {
  HomePage
};
