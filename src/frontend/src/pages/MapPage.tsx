import "leaflet/dist/leaflet.css";
import { useNGOs, useRequests, useVolunteers } from "@/hooks/useAidLink";
import { RequestStatus, ResourceType, Urgency } from "@/types";
import type { NGO, ResourceRequest, Volunteer } from "@/types";
import L from "leaflet";
import {
  Activity,
  AlertTriangle,
  Building2,
  ChevronDown,
  ChevronUp,
  Filter,
  Layers,
  MapPin,
  SlidersHorizontal,
  Star,
  TrendingUp,
  UserCheck,
  UserX,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_CENTER: L.LatLngExpression = [20, 0];
const DEFAULT_ZOOM = 2;

const URGENCY_COLOR: Record<string, string> = {
  [Urgency.critical]: "#ef4444",
  [Urgency.high]: "#f97316",
  [Urgency.medium]: "#eab308",
  [Urgency.low]: "#22c55e",
};

const STATUS_COLOR: Record<string, string> = {
  [RequestStatus.pending]: "#eab308",
  [RequestStatus.ongoing]: "#3b82f6",
  [RequestStatus.completed]: "#22c55e",
};

const WEEKLY_DATA = [
  { day: "Mon", created: 18, completed: 12 },
  { day: "Tue", created: 24, completed: 19 },
  { day: "Wed", created: 31, completed: 21 },
  { day: "Thu", created: 22, completed: 28 },
  { day: "Fri", created: 38, completed: 30 },
  { day: "Sat", created: 29, completed: 35 },
  { day: "Sun", created: 42, completed: 38 },
];

const SAMPLE_REQUESTS: ResourceRequest[] = [
  {
    id: BigInt(1),
    title: "Food Drive — Mumbai",
    description: "Emergency food supplies needed for flood victims",
    urgency: Urgency.critical,
    status: RequestStatus.pending,
    resourceType: ResourceType.food,
    quantity: BigInt(500),
    assignedVolunteers: [],
    lat: 19.076,
    lng: 72.8777,
    ngoId: BigInt(1),
    deadline: BigInt(0),
    createdAt: BigInt(0),
  },
  {
    id: BigInt(2),
    title: "Medical Supplies — Delhi",
    description: "Medical kits required urgently",
    urgency: Urgency.high,
    status: RequestStatus.ongoing,
    resourceType: ResourceType.medical,
    quantity: BigInt(200),
    assignedVolunteers: [],
    lat: 28.6139,
    lng: 77.209,
    ngoId: BigInt(1),
    deadline: BigInt(0),
    createdAt: BigInt(0),
  },
  {
    id: BigInt(3),
    title: "Shelter Request — Kolkata",
    description: "Temporary housing needed",
    urgency: Urgency.medium,
    status: RequestStatus.pending,
    resourceType: ResourceType.shelter,
    quantity: BigInt(50),
    assignedVolunteers: [],
    lat: 22.5726,
    lng: 88.3639,
    ngoId: BigInt(2),
    deadline: BigInt(0),
    createdAt: BigInt(0),
  },
  {
    id: BigInt(4),
    title: "Education Kits — Bangalore",
    description: "School supplies for children",
    urgency: Urgency.low,
    status: RequestStatus.completed,
    resourceType: ResourceType.education,
    quantity: BigInt(300),
    assignedVolunteers: [],
    lat: 12.9716,
    lng: 77.5946,
    ngoId: BigInt(2),
    deadline: BigInt(0),
    createdAt: BigInt(0),
  },
  {
    id: BigInt(5),
    title: "Water Purification — Hyderabad",
    description: "Clean water supplies needed",
    urgency: Urgency.high,
    status: RequestStatus.ongoing,
    resourceType: ResourceType.other,
    quantity: BigInt(100),
    assignedVolunteers: [],
    lat: 17.385,
    lng: 78.4867,
    ngoId: BigInt(3),
    deadline: BigInt(0),
    createdAt: BigInt(0),
  },
];

const SAMPLE_NGOS: NGO[] = [
  {
    id: BigInt(1),
    name: "AidLink India",
    description: "Primary relief NGO",
    contactEmail: "help@aidlink.org",
    lat: 20.5937,
    lng: 78.9629,
    isVerified: true,
    createdAt: BigInt(0),
  },
  {
    id: BigInt(2),
    name: "Relief Foundation",
    description: "Community support organization",
    contactEmail: "info@rf.org",
    lat: 15.3173,
    lng: 75.7139,
    isVerified: true,
    createdAt: BigInt(0),
  },
];

const SAMPLE_VOLUNTEERS: Volunteer[] = [
  {
    id: BigInt(1),
    name: "Priya Sharma",
    skills: ["medical"],
    lat: 19.22,
    lng: 72.98,
    isAvailable: true,
    completedTasks: BigInt(12),
    rating: 4.8,
  },
  {
    id: BigInt(2),
    name: "Arjun Mehta",
    skills: ["logistics", "medical"],
    lat: 28.45,
    lng: 77.02,
    isAvailable: true,
    completedTasks: BigInt(28),
    rating: 4.9,
  },
  {
    id: BigInt(3),
    name: "Kavitha Nair",
    skills: ["education"],
    lat: 22.32,
    lng: 88.12,
    isAvailable: false,
    completedTasks: BigInt(7),
    rating: 4.5,
  },
  {
    id: BigInt(4),
    name: "Vikram Patel",
    skills: ["logistics"],
    lat: 12.82,
    lng: 77.38,
    isAvailable: true,
    completedTasks: BigInt(15),
    rating: 4.7,
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────

type LayerVisibility = {
  ngos: boolean;
  volunteers: boolean;
  requests: boolean;
};

// ─── Shared Styles ────────────────────────────────────────────────────────────

const GLASS: React.CSSProperties = {
  background: "rgba(8, 13, 35, 0.88)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(104, 174, 255, 0.14)",
  boxShadow: "0 0 32px rgba(59,130,246,0.07), 0 8px 32px rgba(0,0,0,0.5)",
};

// ─── Map Bounds Fitter ────────────────────────────────────────────────────────

function BoundsFitter({
  requests,
  ngos,
  volunteers,
}: {
  requests: ResourceRequest[];
  ngos: NGO[];
  volunteers: Volunteer[];
}) {
  const map = useMap();
  const fitted = useRef(false);

  useEffect(() => {
    if (fitted.current) return;
    const points: L.LatLngExpression[] = [
      ...requests.map((r) => [r.lat, r.lng] as L.LatLngExpression),
      ...ngos.map((n) => [n.lat, n.lng] as L.LatLngExpression),
      ...volunteers.map((v) => [v.lat, v.lng] as L.LatLngExpression),
    ];
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 13 });
    fitted.current = true;
  }, [map, requests, ngos, volunteers]);

  return null;
}

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedCounter({ target }: { target: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const duration = 1200;
    function tick(now: number) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - p) ** 3;
      setValue(Math.round(eased * target));
      if (p < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return <span>{value.toLocaleString()}</span>;
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatsBar({
  ngoCount,
  volunteerCount,
  requestCount,
}: {
  ngoCount: number;
  volunteerCount: number;
  requestCount: number;
}) {
  return (
    <div
      className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] rounded-2xl px-5 py-3 hidden md:flex items-center gap-6"
      style={{ ...GLASS, minWidth: 360 }}
      data-ocid="map.stats_bar.panel"
    >
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
        <span className="text-xs text-muted-foreground">NGOs Active</span>
        <span className="text-sm font-display font-bold text-blue-400 ml-1">
          <AnimatedCounter target={ngoCount || 12} />
        </span>
      </span>
      <span className="w-px h-5 bg-white/10" aria-hidden="true" />
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
        <span className="text-xs text-muted-foreground">Volunteers</span>
        <span className="text-sm font-display font-bold text-emerald-400 ml-1">
          <AnimatedCounter target={volunteerCount || 47} />
        </span>
      </span>
      <span className="w-px h-5 bg-white/10" aria-hidden="true" />
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_8px_#fb923c] animate-pulse" />
        <span className="text-xs text-muted-foreground">Open Requests</span>
        <span className="text-sm font-display font-bold text-orange-400 ml-1">
          <AnimatedCounter target={requestCount || 28} />
        </span>
      </span>
      <span className="ml-1 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs text-emerald-400 font-medium">Live</span>
      </span>
    </div>
  );
}

// ─── Filter Panel ─────────────────────────────────────────────────────────────

function FilterPanel({
  layers,
  statusFilter,
  urgencyFilter,
  onLayerToggle,
  onStatusToggle,
  onUrgencyToggle,
  collapsed,
  onToggleCollapse,
}: {
  layers: LayerVisibility;
  statusFilter: Set<string>;
  urgencyFilter: Set<string>;
  onLayerToggle: (k: keyof LayerVisibility) => void;
  onStatusToggle: (v: string) => void;
  onUrgencyToggle: (v: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  const layerDefs: {
    key: keyof LayerVisibility;
    label: string;
    color: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: "ngos",
      label: "NGOs",
      color: "#3b82f6",
      icon: <Building2 size={11} />,
    },
    {
      key: "volunteers",
      label: "Volunteers",
      color: "#22c55e",
      icon: <Users size={11} />,
    },
    {
      key: "requests",
      label: "Requests",
      color: "#f97316",
      icon: <MapPin size={11} />,
    },
  ];

  const statuses = [
    {
      value: String(RequestStatus.pending),
      label: "Pending",
      color: "#eab308",
    },
    {
      value: String(RequestStatus.ongoing),
      label: "Ongoing",
      color: "#3b82f6",
    },
    { value: String(RequestStatus.completed), label: "Done", color: "#22c55e" },
  ];

  const urgencies = [
    { value: String(Urgency.critical), label: "Critical", color: "#ef4444" },
    { value: String(Urgency.high), label: "High", color: "#f97316" },
    { value: String(Urgency.medium), label: "Medium", color: "#eab308" },
    { value: String(Urgency.low), label: "Low", color: "#22c55e" },
  ];

  return (
    <div
      className="absolute top-4 right-4 z-[1000] rounded-2xl"
      style={{ ...GLASS, width: 208 }}
      data-ocid="map.filter.panel"
    >
      <button
        type="button"
        className="w-full flex items-center gap-2 px-4 py-3 rounded-2xl"
        onClick={onToggleCollapse}
        data-ocid="map.filter.collapse_toggle"
        aria-expanded={!collapsed}
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-display font-bold text-foreground tracking-wide uppercase flex-1 text-left">
          Filters
        </span>
        {collapsed ? (
          <ChevronDown size={12} className="text-muted-foreground" />
        ) : (
          <ChevronUp size={12} className="text-muted-foreground" />
        )}
      </button>

      {!collapsed && (
        <div className="px-4 pb-4 space-y-4">
          {/* Layer Toggles */}
          <div>
            <p
              className="text-muted-foreground mb-2 font-semibold tracking-wide uppercase"
              style={{ fontSize: "10px" }}
            >
              Layers
            </p>
            <div className="space-y-1.5">
              {layerDefs.map((l) => (
                <button
                  key={l.key}
                  type="button"
                  onClick={() => onLayerToggle(l.key)}
                  data-ocid={`map.filter.layer.${l.key}.toggle`}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs font-medium"
                  style={{
                    background: layers[l.key]
                      ? `${l.color}18`
                      : "rgba(255,255,255,0.03)",
                    border: `1px solid ${layers[l.key] ? `${l.color}50` : "rgba(255,255,255,0.07)"}`,
                    color: layers[l.key] ? l.color : "rgba(255,255,255,0.4)",
                    boxShadow: layers[l.key] ? `0 0 12px ${l.color}25` : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {l.icon}
                  <span>{l.label}</span>
                  <span
                    className="ml-auto w-3 h-3 rounded-sm flex items-center justify-center"
                    style={{
                      background: layers[l.key]
                        ? `${l.color}30`
                        : "rgba(255,255,255,0.05)",
                      border: `1px solid ${layers[l.key] ? l.color : "rgba(255,255,255,0.12)"}`,
                    }}
                  >
                    {layers[l.key] && (
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: 1,
                          background: l.color,
                          display: "block",
                        }}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Urgency Filter */}
          <div>
            <p
              className="text-muted-foreground mb-2 font-semibold tracking-wide uppercase"
              style={{ fontSize: "10px" }}
            >
              Urgency
            </p>
            <div className="flex flex-wrap gap-1.5">
              {urgencies.map((u) => (
                <button
                  key={u.value}
                  type="button"
                  onClick={() => onUrgencyToggle(u.value)}
                  data-ocid={`map.filter.urgency.${u.value}.toggle`}
                  className="px-2 py-0.5 rounded-full font-medium"
                  style={{
                    fontSize: "10px",
                    background: urgencyFilter.has(u.value)
                      ? `${u.color}22`
                      : "rgba(255,255,255,0.04)",
                    border: `1px solid ${urgencyFilter.has(u.value) ? u.color : "rgba(255,255,255,0.08)"}`,
                    color: urgencyFilter.has(u.value)
                      ? u.color
                      : "rgba(255,255,255,0.45)",
                    boxShadow: urgencyFilter.has(u.value)
                      ? `0 0 10px ${u.color}35`
                      : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <p
              className="text-muted-foreground mb-2 font-semibold tracking-wide uppercase"
              style={{ fontSize: "10px" }}
            >
              Status
            </p>
            <div className="flex flex-wrap gap-1.5">
              {statuses.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => onStatusToggle(s.value)}
                  data-ocid={`map.filter.status.${s.value}.toggle`}
                  className="px-2 py-0.5 rounded-full font-medium"
                  style={{
                    fontSize: "10px",
                    background: statusFilter.has(s.value)
                      ? `${s.color}22`
                      : "rgba(255,255,255,0.04)",
                    border: `1px solid ${statusFilter.has(s.value) ? s.color : "rgba(255,255,255,0.08)"}`,
                    color: statusFilter.has(s.value)
                      ? s.color
                      : "rgba(255,255,255,0.45)",
                    boxShadow: statusFilter.has(s.value)
                      ? `0 0 10px ${s.color}35`
                      : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Legend Panel ─────────────────────────────────────────────────────────────

function LegendPanel({
  collapsed,
  onToggleCollapse,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  return (
    <div
      className="absolute bottom-4 left-4 z-[1000] rounded-2xl"
      style={{ ...GLASS, minWidth: 180 }}
      data-ocid="map.legend.panel"
    >
      <button
        type="button"
        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-2xl"
        onClick={onToggleCollapse}
        data-ocid="map.legend.collapse_toggle"
        aria-expanded={!collapsed}
      >
        <Layers className="w-3.5 h-3.5 text-cyan-400" />
        <span className="text-xs font-display font-bold text-foreground tracking-wide uppercase flex-1 text-left">
          Legend
        </span>
        {collapsed ? (
          <ChevronDown size={12} className="text-muted-foreground" />
        ) : (
          <ChevronUp size={12} className="text-muted-foreground" />
        )}
      </button>

      {!collapsed && (
        <div className="px-4 pb-3 space-y-2">
          {[
            { color: "#3b82f6", label: "NGO", icon: <Building2 size={10} /> },
            {
              color: "#22c55e",
              label: "Volunteer (Available)",
              icon: <Users size={10} />,
            },
            {
              color: "#6b7280",
              label: "Volunteer (Busy)",
              icon: <UserX size={10} />,
            },
            {
              color: "#ef4444",
              label: "Critical Request",
              icon: <AlertTriangle size={10} />,
            },
            {
              color: "#f97316",
              label: "High Request",
              icon: <AlertTriangle size={10} />,
            },
            {
              color: "#eab308",
              label: "Moderate Request",
              icon: <MapPin size={10} />,
            },
            {
              color: "#22c55e",
              label: "Low Request",
              icon: <MapPin size={10} />,
            },
          ].map(({ color, label, icon }) => (
            <div key={label} className="flex items-center gap-2.5">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: color, boxShadow: `0 0 6px ${color}80` }}
              />
              <span
                className="flex items-center gap-1"
                style={{ color, fontSize: "11px" }}
              >
                {icon}
                <span style={{ color: "rgba(255,255,255,0.6)" }}>{label}</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Analytics Panel ──────────────────────────────────────────────────────────

function AnalyticsPanel({
  collapsed,
  onToggleCollapse,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
}) {
  return (
    <div
      className="absolute bottom-4 left-52 z-[1000] rounded-2xl hidden md:block"
      style={{ ...GLASS, width: 286 }}
      data-ocid="map.analytics.panel"
    >
      <button
        type="button"
        className="w-full flex items-center gap-2 px-4 py-2.5"
        onClick={onToggleCollapse}
        data-ocid="map.analytics.collapse_toggle"
        aria-expanded={!collapsed}
      >
        <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
        <span className="text-xs font-display font-bold text-foreground tracking-wide uppercase flex-1 text-left">
          7-Day Impact
        </span>
        <div className="flex items-center gap-3 mr-1">
          <span
            className="flex items-center gap-1"
            style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}
          >
            <span className="w-4 h-0.5 bg-blue-400 inline-block rounded" />
            Created
          </span>
          <span
            className="flex items-center gap-1"
            style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}
          >
            <span className="w-4 h-0.5 bg-cyan-400 inline-block rounded" />
            Done
          </span>
        </div>
        {collapsed ? (
          <ChevronDown size={12} className="text-muted-foreground" />
        ) : (
          <ChevronUp size={12} className="text-muted-foreground" />
        )}
      </button>
      {!collapsed && (
        <div className="px-3 pb-3" style={{ height: 120 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={WEEKLY_DATA}
              margin={{ top: 2, right: 2, left: -30, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gradCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{
                  background: "rgba(8,13,35,0.95)",
                  border: "1px solid rgba(104,174,255,0.2)",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.8)",
                }}
                formatter={(v: number, name: string) => [
                  v,
                  name === "created" ? "Created" : "Completed",
                ]}
                labelFormatter={() => ""}
              />
              <Area
                type="monotone"
                dataKey="created"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#gradCreated)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#06b6d4"
                strokeWidth={2}
                fill="url(#gradCompleted)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// ─── Popup Content ────────────────────────────────────────────────────────────

function VolunteerPopup({ volunteer }: { volunteer: Volunteer }) {
  const avColor = volunteer.isAvailable ? "#22c55e" : "#6b7280";
  return (
    <div
      style={{
        minWidth: 200,
        maxWidth: 250,
        background: "rgba(8,13,35,0.98)",
        borderRadius: 12,
        padding: "12px 14px",
        color: "white",
      }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        {volunteer.isAvailable ? (
          <UserCheck size={10} style={{ color: avColor }} />
        ) : (
          <UserX size={10} style={{ color: avColor }} />
        )}
        <span style={{ fontSize: "10px", color: avColor, fontWeight: 600 }}>
          {volunteer.isAvailable ? "Available" : "Busy"}
        </span>
      </div>
      <div style={{ fontWeight: 700, fontSize: "13px", lineHeight: 1.3 }}>
        {volunteer.name}
      </div>
      <div
        style={{
          fontSize: "11px",
          color: "rgba(255,255,255,0.6)",
          marginTop: 3,
        }}
      >
        Skills: {volunteer.skills.join(", ")}
      </div>
      <div className="flex items-center gap-3 mt-2">
        <span
          style={{
            fontSize: "10px",
            color: "rgba(255,255,255,0.5)",
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Star size={10} style={{ color: "#fbbf24" }} />{" "}
          {volunteer.rating.toFixed(1)}
        </span>
        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>
          {String(volunteer.completedTasks)} tasks done
        </span>
      </div>
    </div>
  );
}

function RequestPopup({ request }: { request: ResourceRequest }) {
  const urgencyColor = URGENCY_COLOR[String(request.urgency)] ?? "#f97316";
  const statusColor = STATUS_COLOR[String(request.status)] ?? "#eab308";
  const urgencyStr = String(request.urgency);
  return (
    <div
      style={{
        minWidth: 210,
        maxWidth: 255,
        background: "rgba(8,13,35,0.98)",
        borderRadius: 12,
        padding: "12px 14px",
        color: "white",
      }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span
          className="w-2 h-2 rounded-full"
          style={{
            background: urgencyColor,
            boxShadow: `0 0 6px ${urgencyColor}`,
          }}
        />
        <span
          style={{
            fontSize: "10px",
            color: urgencyColor,
            fontWeight: 600,
            textTransform: "capitalize",
          }}
        >
          {urgencyStr} Urgency
        </span>
      </div>
      <div style={{ fontWeight: 700, fontSize: "13px", lineHeight: 1.3 }}>
        {request.title}
      </div>
      <div
        style={{
          fontSize: "11px",
          color: "rgba(255,255,255,0.55)",
          marginTop: 3,
          lineHeight: 1.4,
        }}
      >
        {request.description}
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2.5">
        <span
          style={{
            fontSize: "10px",
            padding: "2px 8px",
            borderRadius: 99,
            border: `1px solid ${urgencyColor}40`,
            color: urgencyColor,
            background: `${urgencyColor}15`,
          }}
        >
          {urgencyStr}
        </span>
        <span
          style={{
            fontSize: "10px",
            padding: "2px 8px",
            borderRadius: 99,
            border: `1px solid ${statusColor}40`,
            color: statusColor,
            background: `${statusColor}15`,
          }}
        >
          {String(request.status)}
        </span>
        <span
          style={{
            fontSize: "10px",
            padding: "2px 8px",
            borderRadius: 99,
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          {String(request.resourceType)}
        </span>
      </div>
    </div>
  );
}

function NGOPopup({ ngo }: { ngo: NGO }) {
  return (
    <div
      style={{
        minWidth: 200,
        maxWidth: 245,
        background: "rgba(8,13,35,0.98)",
        borderRadius: 12,
        padding: "12px 14px",
        color: "white",
      }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <Building2 size={10} style={{ color: "#60a5fa" }} />
        <span style={{ fontSize: "10px", color: "#60a5fa", fontWeight: 600 }}>
          NGO{ngo.isVerified ? " · Verified ✓" : ""}
        </span>
      </div>
      <div style={{ fontWeight: 700, fontSize: "13px", lineHeight: 1.3 }}>
        {ngo.name}
      </div>
      <div
        style={{
          fontSize: "11px",
          color: "rgba(255,255,255,0.55)",
          marginTop: 3,
        }}
      >
        {ngo.description}
      </div>
      <div
        style={{
          fontSize: "10px",
          color: "rgba(255,255,255,0.4)",
          marginTop: 8,
        }}
      >
        Contact: <span style={{ color: "#93c5fd" }}>{ngo.contactEmail}</span>
      </div>
      <a
        href="/ngo"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          marginTop: 10,
          padding: "5px 0",
          borderRadius: 8,
          fontSize: "11px",
          fontWeight: 600,
          background: "linear-gradient(135deg,#1d4ed8,#3b82f6)",
          color: "white",
          textDecoration: "none",
          boxShadow: "0 0 12px rgba(59,130,246,0.3)",
        }}
        data-ocid="map.info.view_dashboard_link"
      >
        <Activity size={11} /> View Dashboard
      </a>
    </div>
  );
}

// ─── Mobile FAB ───────────────────────────────────────────────────────────────

function MobileFAB({
  showFilters,
  onToggleFilters,
}: {
  showFilters: boolean;
  onToggleFilters: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggleFilters}
      className="md:hidden absolute bottom-24 right-4 z-[1000] w-12 h-12 rounded-full flex items-center justify-center"
      style={{
        background: showFilters
          ? "linear-gradient(135deg,#1d4ed8,#8b5cf6)"
          : "rgba(8,13,35,0.9)",
        border: "1px solid rgba(104,174,255,0.25)",
        boxShadow: "0 0 20px rgba(59,130,246,0.35)",
        backdropFilter: "blur(12px)",
        transition: "all 0.2s ease",
      }}
      aria-label={showFilters ? "Close filters" : "Open filters"}
      data-ocid="map.mobile_filter_fab"
    >
      {showFilters ? (
        <X size={18} style={{ color: "white" }} />
      ) : (
        <Filter size={18} style={{ color: "#93c5fd" }} />
      )}
    </button>
  );
}

// ─── Leaflet Map ──────────────────────────────────────────────────────────────

// Custom popup styles injected once
const POPUP_STYLE = `
  .aidlink-popup .leaflet-popup-content-wrapper {
    background: rgba(8,13,35,0.98) !important;
    border: 1px solid rgba(104,174,255,0.18) !important;
    border-radius: 14px !important;
    box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(59,130,246,0.1) !important;
    padding: 0 !important;
  }
  .aidlink-popup .leaflet-popup-content { margin: 0 !important; }
  .aidlink-popup .leaflet-popup-tip { background: rgba(8,13,35,0.98) !important; }
  .aidlink-popup .leaflet-popup-close-button { color: rgba(255,255,255,0.4) !important; top: 8px !important; right: 10px !important; font-size: 16px !important; }
  .leaflet-tile-pane { filter: hue-rotate(180deg) invert(85%) saturate(0.6) brightness(0.55); }
`;

function LeafletMap({
  requests,
  ngos,
  volunteers,
  layers,
  statusFilter,
  urgencyFilter,
}: {
  requests: ResourceRequest[];
  ngos: NGO[];
  volunteers: Volunteer[];
  layers: LayerVisibility;
  statusFilter: Set<string>;
  urgencyFilter: Set<string>;
}) {
  const filteredRequests = requests.filter(
    (r) =>
      (statusFilter.size === 0 || statusFilter.has(String(r.status))) &&
      (urgencyFilter.size === 0 || urgencyFilter.has(String(r.urgency))),
  );

  return (
    <>
      <style>{POPUP_STYLE}</style>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ width: "100%", height: "100%" }}
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <BoundsFitter requests={requests} ngos={ngos} volunteers={volunteers} />

        {/* NGO markers — blue */}
        {layers.ngos &&
          ngos.map((ngo) => (
            <CircleMarker
              key={`ngo-${ngo.id}`}
              center={[ngo.lat, ngo.lng]}
              radius={12}
              pathOptions={{
                fillColor: "#3b82f6",
                color: "#93c5fd",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.85,
              }}
              className="aidlink-popup"
            >
              <Popup className="aidlink-popup" offset={[0, -8]}>
                <NGOPopup ngo={ngo} />
              </Popup>
            </CircleMarker>
          ))}

        {/* Volunteer markers — green/gray */}
        {layers.volunteers &&
          volunteers.map((vol) => {
            const col = vol.isAvailable ? "#22c55e" : "#6b7280";
            const stroke = vol.isAvailable ? "#86efac" : "#9ca3af";
            return (
              <CircleMarker
                key={`vol-${vol.id}`}
                center={[vol.lat, vol.lng]}
                radius={10}
                pathOptions={{
                  fillColor: col,
                  color: stroke,
                  weight: 2,
                  opacity: 1,
                  fillOpacity: 0.9,
                }}
                className="aidlink-popup"
              >
                <Popup className="aidlink-popup" offset={[0, -8]}>
                  <VolunteerPopup volunteer={vol} />
                </Popup>
              </CircleMarker>
            );
          })}

        {/* Request markers — color by urgency */}
        {layers.requests &&
          filteredRequests.map((req) => {
            const col = URGENCY_COLOR[String(req.urgency)] ?? "#f97316";
            return (
              <CircleMarker
                key={`req-${req.id}`}
                center={[req.lat, req.lng]}
                radius={11}
                pathOptions={{
                  fillColor: col,
                  color: "white",
                  weight: 1.5,
                  opacity: 0.9,
                  fillOpacity: 0.85,
                }}
                className="aidlink-popup"
              >
                <Popup className="aidlink-popup" offset={[0, -8]}>
                  <RequestPopup request={req} />
                </Popup>
              </CircleMarker>
            );
          })}
      </MapContainer>
    </>
  );
}

// ─── MapPage ──────────────────────────────────────────────────────────────────

export function MapPage() {
  const { data: rawRequests = [], isLoading: reqLoading } = useRequests();
  const { data: rawNGOs = [], isLoading: ngoLoading } = useNGOs();
  const { data: rawVolunteers = [], isLoading: volLoading } = useVolunteers();

  const requests = rawRequests.length > 0 ? rawRequests : SAMPLE_REQUESTS;
  const ngos = rawNGOs.length > 0 ? (rawNGOs as NGO[]) : SAMPLE_NGOS;
  const volunteers =
    rawVolunteers.length > 0
      ? (rawVolunteers as Volunteer[])
      : SAMPLE_VOLUNTEERS;

  const [layers, setLayers] = useState<LayerVisibility>({
    ngos: true,
    volunteers: true,
    requests: true,
  });
  const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set());
  const [urgencyFilter, setUrgencyFilter] = useState<Set<string>>(new Set());
  const [filterCollapsed, setFilterCollapsed] = useState(false);
  const [legendCollapsed, setLegendCollapsed] = useState(false);
  const [analyticsCollapsed, setAnalyticsCollapsed] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  function toggleLayer(k: keyof LayerVisibility) {
    setLayers((prev) => ({ ...prev, [k]: !prev[k] }));
  }

  function toggleStatus(v: string) {
    setStatusFilter((prev) => {
      const next = new Set(prev);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return next;
    });
  }

  function toggleUrgency(v: string) {
    setUrgencyFilter((prev) => {
      const next = new Set(prev);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return next;
    });
  }

  const availableVols = volunteers.filter((v) => v.isAvailable).length;
  const openRequests = requests.filter(
    (r) => r.status !== RequestStatus.completed,
  ).length;
  const isDataLoading = reqLoading || ngoLoading || volLoading;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        height: "calc(100vh - 80px)",
        background: "#050a18",
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
      data-ocid="map.page"
    >
      {/* Loading state */}
      {isDataLoading && (
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4"
          style={{ background: "#050a18" }}
          data-ocid="map.loading_state"
        >
          <div className="relative">
            <div
              className="w-16 h-16 rounded-full border-2 border-transparent animate-spin"
              style={{
                borderTopColor: "#3b82f6",
                borderRightColor: "#06b6d4",
                boxShadow: "0 0 30px rgba(59,130,246,0.4)",
              }}
            />
            <div
              className="absolute inset-2 rounded-full border border-transparent animate-spin"
              style={{
                borderBottomColor: "#8b5cf6",
                animationDuration: "1.2s",
                animationDirection: "reverse",
              }}
            />
          </div>
          <p className="text-sm text-muted-foreground font-display tracking-widest uppercase">
            Loading Map
          </p>
        </div>
      )}

      {/* Map */}
      {!isDataLoading && (
        <LeafletMap
          requests={requests}
          ngos={ngos}
          volunteers={volunteers}
          layers={layers}
          statusFilter={statusFilter}
          urgencyFilter={urgencyFilter}
        />
      )}

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[999]"
        style={{
          background:
            "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 50%, rgba(5,10,24,0.38) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Stats bar — desktop */}
      <StatsBar
        ngoCount={ngos.length}
        volunteerCount={availableVols}
        requestCount={openRequests}
      />

      {/* Mobile stats pill */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] md:hidden rounded-full px-4 py-2 flex items-center gap-4"
        style={{
          background: "rgba(8,13,35,0.88)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(104,174,255,0.12)",
        }}
        data-ocid="map.mobile_stats.panel"
      >
        <span className="flex items-center gap-1.5 text-xs">
          <Zap className="w-3 h-3 text-blue-400" />
          <span className="text-foreground font-bold">{openRequests}</span>
          <span className="text-muted-foreground">Requests</span>
        </span>
        <span className="w-px h-3 bg-white/10" aria-hidden="true" />
        <span className="flex items-center gap-1.5 text-xs">
          <Users className="w-3 h-3 text-emerald-400" />
          <span className="text-foreground font-bold">{availableVols}</span>
          <span className="text-muted-foreground">Available</span>
        </span>
      </div>

      {/* Filter panel — desktop */}
      <div className="hidden md:block">
        <FilterPanel
          layers={layers}
          statusFilter={statusFilter}
          urgencyFilter={urgencyFilter}
          onLayerToggle={toggleLayer}
          onStatusToggle={toggleStatus}
          onUrgencyToggle={toggleUrgency}
          collapsed={filterCollapsed}
          onToggleCollapse={() => setFilterCollapsed((v) => !v)}
        />
      </div>

      {/* Legend panel */}
      <LegendPanel
        collapsed={legendCollapsed}
        onToggleCollapse={() => setLegendCollapsed((v) => !v)}
      />

      {/* Analytics panel — desktop */}
      <AnalyticsPanel
        collapsed={analyticsCollapsed}
        onToggleCollapse={() => setAnalyticsCollapsed((v) => !v)}
      />

      {/* Mobile filter sheet */}
      {mobileFiltersOpen && (
        <div
          className="md:hidden absolute bottom-0 left-0 right-0 z-[1010] rounded-t-2xl p-5"
          style={{
            ...GLASS,
            borderBottom: "none",
            maxHeight: "70vh",
            overflowY: "auto",
          }}
          data-ocid="map.mobile_filter.sheet"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-display font-bold text-foreground tracking-wide uppercase flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-primary" /> Filters
            </span>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="text-muted-foreground"
              data-ocid="map.mobile_filter.close_button"
              aria-label="Close filters"
            >
              <X size={16} />
            </button>
          </div>
          <FilterPanel
            layers={layers}
            statusFilter={statusFilter}
            urgencyFilter={urgencyFilter}
            onLayerToggle={toggleLayer}
            onStatusToggle={toggleStatus}
            onUrgencyToggle={toggleUrgency}
            collapsed={false}
            onToggleCollapse={() => {}}
          />
        </div>
      )}

      {/* Mobile FAB */}
      <MobileFAB
        showFilters={mobileFiltersOpen}
        onToggleFilters={() => setMobileFiltersOpen((v) => !v)}
      />
    </div>
  );
}
