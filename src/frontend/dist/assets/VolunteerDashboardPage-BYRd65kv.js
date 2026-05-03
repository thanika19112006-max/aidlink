import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, L as Link, B as Button, Z as Zap } from "./index-BZ7Eu0u-.js";
import { A as Avatar, a as AvatarFallback } from "./avatar-BiskUL31.js";
import { B as Badge } from "./badge-B5n1u1Hh.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, e as DialogFooter } from "./dialog-QBJpyzSO.js";
import { S as Skeleton } from "./skeleton-DMy__n21.js";
import { u as useRequests, g as useAssignments, h as useAssignVolunteer, R as RequestStatus, M as MapPin, U as Urgency, j as ResourceType } from "./useAidLink-PClPnHG1.js";
import { u as ue } from "./index-B3ih9tsb.js";
import { S as Star } from "./star-Rxu2RHcr.js";
import { T as TriangleAlert } from "./triangle-alert-dpM1kWKg.js";
import { C as CircleCheck } from "./circle-check-hFigbP3B.js";
import { P as Package } from "./package-CJb8kLTi.js";
import { S as Shield } from "./shield-td2Hg2pg.js";
import { H as Heart } from "./heart-CBFcraNU.js";
import { U as Utensils } from "./utensils-8eH6qRa-.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["polygon", { points: "3 11 22 2 13 21 11 13 3 11", key: "1ltx0t" }]
];
const Navigation = createLucideIcon("navigation", __iconNode);
const VOLUNTEER_LAT = 40.7128;
const VOLUNTEER_LNG = -74.006;
const VOLUNTEER_ID = BigInt(1);
const URGENCY_CONFIG = {
  [Urgency.critical]: {
    label: "Critical",
    color: "text-red-400",
    bg: "bg-red-500/20 border-red-500/30",
    dot: "#f87171"
  },
  [Urgency.high]: {
    label: "High",
    color: "text-orange-400",
    bg: "bg-orange-500/20 border-orange-500/30",
    dot: "#fb923c"
  },
  [Urgency.medium]: {
    label: "Medium",
    color: "text-yellow-400",
    bg: "bg-yellow-500/20 border-yellow-500/30",
    dot: "#facc15"
  },
  [Urgency.low]: {
    label: "Low",
    color: "text-green-400",
    bg: "bg-green-500/20 border-green-500/30",
    dot: "#4ade80"
  }
};
const RESOURCE_ICONS = {
  [ResourceType.food]: /* @__PURE__ */ jsxRuntimeExports.jsx(Utensils, { className: "w-3.5 h-3.5" }),
  [ResourceType.medical]: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { className: "w-3.5 h-3.5" }),
  [ResourceType.shelter]: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-3.5 h-3.5" }),
  [ResourceType.education]: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3.5 h-3.5" }),
  [ResourceType.other]: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-3.5 h-3.5" })
};
const FILTER_OPTIONS = [
  { key: "all", label: "All" },
  { key: Urgency.critical, label: "Critical" },
  { key: Urgency.high, label: "High" },
  { key: ResourceType.medical, label: "Medical" },
  { key: ResourceType.food, label: "Food" },
  { key: ResourceType.shelter, label: "Shelter" }
];
const SKILLS = ["First Aid", "Logistics", "Driving", "Medical"];
function calcDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
const MAP_W = 400;
const MAP_H = 320;
function projectToMap(lat, lng, requests) {
  const allLats = [VOLUNTEER_LAT, ...requests.map((r) => r.lat)];
  const allLngs = [VOLUNTEER_LNG, ...requests.map((r) => r.lng)];
  const minLat = Math.min(...allLats);
  const maxLat = Math.max(...allLats);
  const minLng = Math.min(...allLngs);
  const maxLng = Math.max(...allLngs);
  const pad = 40;
  const latRange = maxLat - minLat || 0.05;
  const lngRange = maxLng - minLng || 0.05;
  const x = pad + (lng - minLng) / lngRange * (MAP_W - 2 * pad);
  const y = pad + (maxLat - lat) / latRange * (MAP_H - 2 * pad);
  return { x, y };
}
function MiniMap({ requests }) {
  const visibleRequests = requests.slice(0, 10);
  const you = projectToMap(VOLUNTEER_LAT, VOLUNTEER_LNG, visibleRequests);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative rounded-xl overflow-hidden border border-border",
      style: { background: "rgba(8,10,28,0.85)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "svg",
          {
            width: "100%",
            viewBox: `0 0 ${MAP_W} ${MAP_H}`,
            "aria-label": "Mini map showing nearby requests",
            role: "img",
            children: [
              [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "line",
                {
                  x1: "0",
                  y1: MAP_H / 6 * i,
                  x2: MAP_W,
                  y2: MAP_H / 6 * i,
                  stroke: "rgba(104,174,255,0.07)",
                  strokeWidth: "1"
                },
                `h${i}`
              )),
              [1, 2, 3, 4, 5, 6].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "line",
                {
                  x1: MAP_W / 7 * i,
                  y1: "0",
                  x2: MAP_W / 7 * i,
                  y2: MAP_H,
                  stroke: "rgba(104,174,255,0.07)",
                  strokeWidth: "1"
                },
                `v${i}`
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  cx: you.x,
                  cy: you.y,
                  r: "50",
                  fill: "none",
                  stroke: "rgba(104,174,255,0.06)",
                  strokeWidth: "1",
                  strokeDasharray: "4 4"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  cx: you.x,
                  cy: you.y,
                  r: "100",
                  fill: "none",
                  stroke: "rgba(104,174,255,0.04)",
                  strokeWidth: "1",
                  strokeDasharray: "4 6"
                }
              ),
              visibleRequests.map((req) => {
                const pos = projectToMap(req.lat, req.lng, visibleRequests);
                const cfg = URGENCY_CONFIG[req.urgency] ?? URGENCY_CONFIG[Urgency.medium];
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "circle",
                    {
                      cx: pos.x,
                      cy: pos.y,
                      r: "10",
                      fill: cfg.dot,
                      opacity: "0.12"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "circle",
                    {
                      cx: pos.x,
                      cy: pos.y,
                      r: "5",
                      fill: cfg.dot,
                      style: { filter: `drop-shadow(0 0 4px ${cfg.dot})` }
                    }
                  )
                ] }, req.id.toString());
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  cx: you.x,
                  cy: you.y,
                  r: "16",
                  fill: "rgba(104,174,255,0.10)",
                  style: { animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  cx: you.x,
                  cy: you.y,
                  r: "8",
                  fill: "oklch(0.72 0.27 262)",
                  style: { filter: "drop-shadow(0 0 8px rgba(104,174,255,0.9))" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: you.x, cy: you.y, r: "3.5", fill: "white" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "text",
                {
                  x: you.x + 12,
                  y: you.y - 11,
                  fill: "rgba(104,174,255,0.9)",
                  fontSize: "11",
                  fontFamily: "DM Sans, sans-serif",
                  fontWeight: "600",
                  children: "You"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-3 left-3 flex gap-3 flex-wrap", children: [
          { dot: "#f87171", label: "Critical" },
          { dot: "#fb923c", label: "High" },
          { dot: "#facc15", label: "Medium" },
          { dot: "#4ade80", label: "Low" }
        ].map(({ dot, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "w-2 h-2 rounded-full flex-shrink-0",
              style: { background: dot },
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: label })
        ] }, label)) })
      ]
    }
  );
}
function TaskCard({
  request,
  index,
  onAccept
}) {
  const urgency = URGENCY_CONFIG[request.urgency] ?? URGENCY_CONFIG[Urgency.medium];
  const resIcon = RESOURCE_ICONS[request.resourceType] ?? RESOURCE_ICONS[ResourceType.other];
  const distKm = calcDistanceKm(
    VOLUNTEER_LAT,
    VOLUNTEER_LNG,
    request.lat,
    request.lng
  ).toFixed(1);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `volunteer.tasks.item.${index}`,
      className: "glass rounded-2xl p-4 border border-border hover-lift transition-smooth",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "h3",
            {
              className: "font-display font-semibold text-foreground text-sm leading-snug flex-1 min-w-0 truncate",
              title: request.title,
              children: request.title
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: `text-[11px] border flex-shrink-0 ${urgency.bg} ${urgency.color}`,
              children: urgency.label
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs line-clamp-2 mb-3 leading-relaxed", children: request.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground mb-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            resIcon,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: request.resourceType })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "w-3 h-3" }),
            distKm,
            " km away"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3" }),
            request.lat.toFixed(2),
            ", ",
            request.lng.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              className: "gradient-primary text-primary-foreground border-0 glow-primary h-7 text-xs",
              onClick: () => onAccept(request),
              "data-ocid": `volunteer.tasks.accept_button.${index}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3 mr-1" }),
                "Accept Task"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              variant: "outline",
              className: "h-7 text-xs border-border/60 hover:border-primary/50",
              asChild: true,
              "data-ocid": `volunteer.tasks.view_button.${index}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/map", children: "View Details" })
            }
          )
        ] })
      ]
    }
  );
}
function AcceptDialog({
  request,
  open,
  onClose,
  onConfirm,
  isPending
}) {
  if (!request) return null;
  const urgency = URGENCY_CONFIG[request.urgency] ?? URGENCY_CONFIG[Urgency.medium];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "glass-strong border border-border max-w-md",
      "data-ocid": "volunteer.accept.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display text-foreground", children: "Accept This Task?" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-2 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl p-4 border border-border space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-foreground text-sm", children: request.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: `border ${urgency.bg} ${urgency.color}`, children: urgency.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize text-muted-foreground", children: request.resourceType })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3" }),
              request.lat.toFixed(3),
              ", ",
              request.lng.toFixed(3)
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "You will be assigned to this task. It will appear as active in your dashboard. Are you sure you want to proceed?" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: onClose,
              disabled: isPending,
              "data-ocid": "volunteer.accept.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              className: "gradient-primary text-primary-foreground border-0 glow-primary",
              onClick: onConfirm,
              disabled: isPending,
              "data-ocid": "volunteer.accept.confirm_button",
              children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3.5 h-3.5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" }),
                "Assigning…"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 mr-1.5" }),
                "Confirm & Accept"
              ] })
            }
          )
        ] })
      ]
    }
  ) });
}
function StatCard({
  icon,
  value,
  label,
  iconBg
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-5 border border-border flex items-center gap-4 hover-lift transition-smooth", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`,
        children: icon
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-2xl text-foreground", children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted-foreground text-xs", children: label })
    ] })
  ] });
}
function VolunteerDashboardPage() {
  const { data: requests = [], isLoading } = useRequests();
  const { data: assignments = [] } = useAssignments();
  const { mutateAsync: assignVolunteer, isPending: isAssigning } = useAssignVolunteer();
  const [activeFilter, setActiveFilter] = reactExports.useState("all");
  const [selectedRequest, setSelectedRequest] = reactExports.useState(null);
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const availableRequests = requests.filter(
    (r) => r.status === RequestStatus.pending || r.status === RequestStatus.ongoing
  );
  const filteredRequests = availableRequests.filter((r) => {
    if (activeFilter === "all") return true;
    if (activeFilter === r.urgency) return true;
    if (activeFilter === r.resourceType) return true;
    return false;
  });
  const activeAssignments = assignments.filter(
    (a) => a.status !== "completed" && a.status !== "cancelled"
  );
  const completedCount = requests.filter(
    (r) => r.status === RequestStatus.completed
  ).length;
  const handleAcceptClick = (req) => {
    setSelectedRequest(req);
    setDialogOpen(true);
  };
  const handleConfirmAccept = async () => {
    if (!selectedRequest) return;
    try {
      await assignVolunteer({
        requestId: selectedRequest.id,
        volunteerId: VOLUNTEER_ID
      });
      ue.success(`You're now assigned to "${selectedRequest.title}"!`, {
        duration: 5e3
      });
      setDialogOpen(false);
      setSelectedRequest(null);
    } catch {
      ue.error("Failed to accept task. Please try again.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen py-8 px-4",
      style: { background: "var(--gradient-hero)" },
      "data-ocid": "volunteer.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-7xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "w-14 h-14 ring-2 ring-primary/40 ring-offset-2 ring-offset-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                AvatarFallback,
                {
                  className: "font-display font-bold text-lg text-primary-foreground",
                  style: { background: "var(--gradient-primary)" },
                  children: "AV"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary text-sm font-medium font-display", children: "Volunteer Dashboard" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400 text-xs font-medium", children: "Active" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl sm:text-3xl text-foreground", children: "Alex Volunteer" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1 flex-wrap", children: [
                  SKILLS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: "text-[11px] border-primary/30 text-primary/80 py-0",
                      children: s
                    },
                    s
                  )),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5 text-yellow-400 text-xs ml-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-3 h-3 fill-yellow-400" }),
                    "4.8"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/map", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                className: "gradient-primary text-primary-foreground border-0 glow-primary",
                "data-ocid": "volunteer.view_map.button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4 mr-2" }),
                  "View Full Map"
                ]
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "lg:col-span-2 space-y-3",
                "data-ocid": "volunteer.minimap.panel",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground text-lg", children: "Nearby Requests" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Badge,
                      {
                        variant: "outline",
                        className: "text-xs border-border text-muted-foreground",
                        children: [
                          availableRequests.length,
                          " active"
                        ]
                      }
                    )
                  ] }),
                  isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full h-64 rounded-xl" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MiniMap, { requests: availableRequests }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl p-3 border border-border space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                      "Your location is marked as",
                      " ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-medium", children: "You" }),
                      ". Colored dots indicate request urgency levels."
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/map", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        type: "button",
                        variant: "outline",
                        size: "sm",
                        className: "w-full h-8 text-xs border-primary/40 text-primary hover:bg-primary/10",
                        "data-ocid": "volunteer.minimap.fullmap_button",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "w-3.5 h-3.5 mr-1.5" }),
                          "Open Full Map Command Center"
                        ]
                      }
                    ) })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-3", "data-ocid": "volunteer.tasks.panel", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground text-lg", children: "Available Nearby Tasks" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-primary/20 border-primary/30 text-primary text-xs", children: [
                  filteredRequests.length,
                  " tasks"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 flex-wrap mb-4", children: FILTER_OPTIONS.map(({ key, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setActiveFilter(key),
                  "data-ocid": `volunteer.filter.${key}.toggle`,
                  className: `px-3 py-1 rounded-full text-xs font-medium border transition-smooth ${activeFilter === key ? "gradient-primary text-primary-foreground border-transparent glow-primary" : "glass border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40"}`,
                  children: label
                },
                key
              )) }),
              isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-36 rounded-2xl" }, i)) }) : filteredRequests.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "glass rounded-2xl p-10 text-center border border-border",
                  "data-ocid": "volunteer.tasks.empty_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-10 h-10 text-muted-foreground mx-auto mb-3" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-medium mb-1", children: "No tasks found" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Try a different filter or check back soon." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        size: "sm",
                        variant: "outline",
                        className: "mt-4 border-primary/40 text-primary hover:bg-primary/10",
                        onClick: () => setActiveFilter("all"),
                        children: "Show All Tasks"
                      }
                    )
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 max-h-[520px] overflow-y-auto pr-1", children: filteredRequests.map((req, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                TaskCard,
                {
                  request: req,
                  index: i + 1,
                  onAccept: handleAcceptClick
                },
                req.id.toString()
              )) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatCard,
              {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-green-400" }),
                value: completedCount,
                label: "Tasks Completed",
                iconBg: "bg-green-500/20"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatCard,
              {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5 text-primary" }),
                value: activeAssignments.length,
                label: "Active Assignments",
                iconBg: "bg-primary/20"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              StatCard,
              {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-5 h-5 text-yellow-400 fill-yellow-400" }),
                value: "4.8",
                label: "Volunteer Rating",
                iconBg: "bg-yellow-500/20"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AcceptDialog,
          {
            request: selectedRequest,
            open: dialogOpen,
            onClose: () => {
              setDialogOpen(false);
              setSelectedRequest(null);
            },
            onConfirm: handleConfirmAccept,
            isPending: isAssigning
          }
        )
      ]
    }
  );
}
export {
  VolunteerDashboardPage
};
