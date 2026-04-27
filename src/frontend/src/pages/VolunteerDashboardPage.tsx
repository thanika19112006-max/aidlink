import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAssignVolunteer,
  useAssignments,
  useRequests,
} from "@/hooks/useAidLink";
import { RequestStatus, ResourceType, Urgency } from "@/types";
import type { ResourceRequest } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  CheckCircle2,
  Heart,
  MapPin,
  Navigation,
  Package,
  Shield,
  Star,
  Utensils,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Constants ────────────────────────────────────────────────────────────────

const VOLUNTEER_LAT = 40.7128;
const VOLUNTEER_LNG = -74.006;
const VOLUNTEER_ID = BigInt(1);

const URGENCY_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; dot: string }
> = {
  [Urgency.critical]: {
    label: "Critical",
    color: "text-red-400",
    bg: "bg-red-500/20 border-red-500/30",
    dot: "#f87171",
  },
  [Urgency.high]: {
    label: "High",
    color: "text-orange-400",
    bg: "bg-orange-500/20 border-orange-500/30",
    dot: "#fb923c",
  },
  [Urgency.medium]: {
    label: "Medium",
    color: "text-yellow-400",
    bg: "bg-yellow-500/20 border-yellow-500/30",
    dot: "#facc15",
  },
  [Urgency.low]: {
    label: "Low",
    color: "text-green-400",
    bg: "bg-green-500/20 border-green-500/30",
    dot: "#4ade80",
  },
};

const RESOURCE_ICONS: Record<string, React.ReactNode> = {
  [ResourceType.food]: <Utensils className="w-3.5 h-3.5" />,
  [ResourceType.medical]: <Heart className="w-3.5 h-3.5" />,
  [ResourceType.shelter]: <Shield className="w-3.5 h-3.5" />,
  [ResourceType.education]: <Star className="w-3.5 h-3.5" />,
  [ResourceType.other]: <Package className="w-3.5 h-3.5" />,
};

const FILTER_OPTIONS = [
  { key: "all", label: "All" },
  { key: Urgency.critical, label: "Critical" },
  { key: Urgency.high, label: "High" },
  { key: ResourceType.medical, label: "Medical" },
  { key: ResourceType.food, label: "Food" },
  { key: ResourceType.shelter, label: "Shelter" },
];

const SKILLS = ["First Aid", "Logistics", "Driving", "Medical"];

// ─── Distance helper ──────────────────────────────────────────────────────────

function calcDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── SVG Mini Map ─────────────────────────────────────────────────────────────

const MAP_W = 400;
const MAP_H = 320;

interface Projected {
  x: number;
  y: number;
}

function projectToMap(
  lat: number,
  lng: number,
  requests: ResourceRequest[],
): Projected {
  const allLats = [VOLUNTEER_LAT, ...requests.map((r) => r.lat)];
  const allLngs = [VOLUNTEER_LNG, ...requests.map((r) => r.lng)];
  const minLat = Math.min(...allLats);
  const maxLat = Math.max(...allLats);
  const minLng = Math.min(...allLngs);
  const maxLng = Math.max(...allLngs);
  const pad = 40;
  const latRange = maxLat - minLat || 0.05;
  const lngRange = maxLng - minLng || 0.05;
  const x = pad + ((lng - minLng) / lngRange) * (MAP_W - 2 * pad);
  const y = pad + ((maxLat - lat) / latRange) * (MAP_H - 2 * pad);
  return { x, y };
}

function MiniMap({ requests }: { requests: ResourceRequest[] }) {
  const visibleRequests = requests.slice(0, 10);
  const you = projectToMap(VOLUNTEER_LAT, VOLUNTEER_LNG, visibleRequests);

  return (
    <div
      className="relative rounded-xl overflow-hidden border border-border"
      style={{ background: "rgba(8,10,28,0.85)" }}
    >
      <svg
        width="100%"
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        aria-label="Mini map showing nearby requests"
        role="img"
      >
        {/* Grid lines */}
        {[1, 2, 3, 4, 5].map((i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={(MAP_H / 6) * i}
            x2={MAP_W}
            y2={(MAP_H / 6) * i}
            stroke="rgba(104,174,255,0.07)"
            strokeWidth="1"
          />
        ))}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <line
            key={`v${i}`}
            x1={(MAP_W / 7) * i}
            y1="0"
            x2={(MAP_W / 7) * i}
            y2={MAP_H}
            stroke="rgba(104,174,255,0.07)"
            strokeWidth="1"
          />
        ))}

        {/* Radar circles */}
        <circle
          cx={you.x}
          cy={you.y}
          r="50"
          fill="none"
          stroke="rgba(104,174,255,0.06)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <circle
          cx={you.x}
          cy={you.y}
          r="100"
          fill="none"
          stroke="rgba(104,174,255,0.04)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />

        {/* Request markers */}
        {visibleRequests.map((req) => {
          const pos = projectToMap(req.lat, req.lng, visibleRequests);
          const cfg =
            URGENCY_CONFIG[req.urgency] ?? URGENCY_CONFIG[Urgency.medium];
          return (
            <g key={req.id.toString()}>
              {/* Glow halo */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="10"
                fill={cfg.dot}
                opacity="0.12"
              />
              {/* Marker dot */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="5"
                fill={cfg.dot}
                style={{ filter: `drop-shadow(0 0 4px ${cfg.dot})` }}
              />
            </g>
          );
        })}

        {/* "You" pulse ring */}
        <circle
          cx={you.x}
          cy={you.y}
          r="16"
          fill="rgba(104,174,255,0.10)"
          style={{ animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite" }}
        />
        {/* "You" marker */}
        <circle
          cx={you.x}
          cy={you.y}
          r="8"
          fill="oklch(0.72 0.27 262)"
          style={{ filter: "drop-shadow(0 0 8px rgba(104,174,255,0.9))" }}
        />
        <circle cx={you.x} cy={you.y} r="3.5" fill="white" />

        {/* You label */}
        <text
          x={you.x + 12}
          y={you.y - 11}
          fill="rgba(104,174,255,0.9)"
          fontSize="11"
          fontFamily="DM Sans, sans-serif"
          fontWeight="600"
        >
          You
        </text>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex gap-3 flex-wrap">
        {[
          { dot: "#f87171", label: "Critical" },
          { dot: "#fb923c", label: "High" },
          { dot: "#facc15", label: "Medium" },
          { dot: "#4ade80", label: "Low" },
        ].map(({ dot, label }) => (
          <div key={label} className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: dot }}
              aria-hidden="true"
            />
            <span className="text-[10px] text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Task Card ────────────────────────────────────────────────────────────────

function TaskCard({
  request,
  index,
  onAccept,
}: {
  request: ResourceRequest;
  index: number;
  onAccept: (req: ResourceRequest) => void;
}) {
  const urgency =
    URGENCY_CONFIG[request.urgency] ?? URGENCY_CONFIG[Urgency.medium];
  const resIcon =
    RESOURCE_ICONS[request.resourceType] ?? RESOURCE_ICONS[ResourceType.other];
  const distKm = calcDistanceKm(
    VOLUNTEER_LAT,
    VOLUNTEER_LNG,
    request.lat,
    request.lng,
  ).toFixed(1);

  return (
    <div
      data-ocid={`volunteer.tasks.item.${index}`}
      className="glass rounded-2xl p-4 border border-border hover-lift transition-smooth"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3
          className="font-display font-semibold text-foreground text-sm leading-snug flex-1 min-w-0 truncate"
          title={request.title}
        >
          {request.title}
        </h3>
        <Badge
          className={`text-[11px] border flex-shrink-0 ${urgency.bg} ${urgency.color}`}
        >
          {urgency.label}
        </Badge>
      </div>

      <p className="text-muted-foreground text-xs line-clamp-2 mb-3 leading-relaxed">
        {request.description}
      </p>

      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 flex-wrap">
        <span className="flex items-center gap-1">
          {resIcon}
          <span className="capitalize">{request.resourceType}</span>
        </span>
        <span className="flex items-center gap-1">
          <Navigation className="w-3 h-3" />
          {distKm} km away
        </span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {request.lat.toFixed(2)}, {request.lng.toFixed(2)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          className="gradient-primary text-primary-foreground border-0 glow-primary h-7 text-xs"
          onClick={() => onAccept(request)}
          data-ocid={`volunteer.tasks.accept_button.${index}`}
        >
          <Zap className="w-3 h-3 mr-1" />
          Accept Task
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 text-xs border-border/60 hover:border-primary/50"
          asChild
          data-ocid={`volunteer.tasks.view_button.${index}`}
        >
          <Link to="/map">View Details</Link>
        </Button>
      </div>
    </div>
  );
}

// ─── Accept Dialog ────────────────────────────────────────────────────────────

function AcceptDialog({
  request,
  open,
  onClose,
  onConfirm,
  isPending,
}: {
  request: ResourceRequest | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}) {
  if (!request) return null;
  const urgency =
    URGENCY_CONFIG[request.urgency] ?? URGENCY_CONFIG[Urgency.medium];
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="glass-strong border border-border max-w-md"
        data-ocid="volunteer.accept.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">
            Accept This Task?
          </DialogTitle>
        </DialogHeader>
        <div className="py-2 space-y-3">
          <div className="glass rounded-xl p-4 border border-border space-y-2">
            <h4 className="font-semibold text-foreground text-sm">
              {request.title}
            </h4>
            <div className="flex items-center gap-3 text-xs">
              <Badge className={`border ${urgency.bg} ${urgency.color}`}>
                {urgency.label}
              </Badge>
              <span className="capitalize text-muted-foreground">
                {request.resourceType}
              </span>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {request.lat.toFixed(3)}, {request.lng.toFixed(3)}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            You will be assigned to this task. It will appear as active in your
            dashboard. Are you sure you want to proceed?
          </p>
        </div>
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            data-ocid="volunteer.accept.cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="gradient-primary text-primary-foreground border-0 glow-primary"
            onClick={onConfirm}
            disabled={isPending}
            data-ocid="volunteer.accept.confirm_button"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                Assigning…
              </span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Confirm &amp; Accept
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  value,
  label,
  iconBg,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  iconBg: string;
}) {
  return (
    <div className="glass rounded-2xl p-5 border border-border flex items-center gap-4 hover-lift transition-smooth">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="font-display font-bold text-2xl text-foreground">
          {value}
        </div>
        <div className="text-muted-foreground text-xs">{label}</div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function VolunteerDashboardPage() {
  const { data: requests = [], isLoading } = useRequests();
  const { data: assignments = [] } = useAssignments();
  const { mutateAsync: assignVolunteer, isPending: isAssigning } =
    useAssignVolunteer();

  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] =
    useState<ResourceRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const availableRequests = requests.filter(
    (r) =>
      r.status === RequestStatus.pending || r.status === RequestStatus.ongoing,
  );

  const filteredRequests = availableRequests.filter((r) => {
    if (activeFilter === "all") return true;
    if (activeFilter === r.urgency) return true;
    if (activeFilter === r.resourceType) return true;
    return false;
  });

  const activeAssignments = assignments.filter(
    (a) => a.status !== "completed" && a.status !== "cancelled",
  );

  const completedCount = requests.filter(
    (r) => r.status === RequestStatus.completed,
  ).length;

  const handleAcceptClick = (req: ResourceRequest) => {
    setSelectedRequest(req);
    setDialogOpen(true);
  };

  const handleConfirmAccept = async () => {
    if (!selectedRequest) return;
    try {
      await assignVolunteer({
        requestId: selectedRequest.id,
        volunteerId: VOLUNTEER_ID,
      });
      toast.success(`You're now assigned to "${selectedRequest.title}"!`, {
        duration: 5000,
      });
      setDialogOpen(false);
      setSelectedRequest(null);
    } catch {
      toast.error("Failed to accept task. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ background: "var(--gradient-hero)" }}
      data-ocid="volunteer.page"
    >
      <div className="container mx-auto max-w-7xl">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14 ring-2 ring-primary/40 ring-offset-2 ring-offset-background">
              <AvatarFallback
                className="font-display font-bold text-lg text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}
              >
                AV
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-primary text-sm font-medium font-display">
                  Volunteer Dashboard
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-medium">
                  Active
                </span>
              </div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground">
                Alex Volunteer
              </h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {SKILLS.map((s) => (
                  <Badge
                    key={s}
                    variant="outline"
                    className="text-[11px] border-primary/30 text-primary/80 py-0"
                  >
                    {s}
                  </Badge>
                ))}
                <span className="flex items-center gap-0.5 text-yellow-400 text-xs ml-1">
                  <Star className="w-3 h-3 fill-yellow-400" />
                  4.8
                </span>
              </div>
            </div>
          </div>

          <Link to="/map">
            <Button
              type="button"
              className="gradient-primary text-primary-foreground border-0 glow-primary"
              data-ocid="volunteer.view_map.button"
            >
              <MapPin className="w-4 h-4 mr-2" />
              View Full Map
            </Button>
          </Link>
        </div>

        {/* ── Two-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          {/* LEFT – Mini Map 40% */}
          <div
            className="lg:col-span-2 space-y-3"
            data-ocid="volunteer.minimap.panel"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-foreground text-lg">
                Nearby Requests
              </h2>
              <Badge
                variant="outline"
                className="text-xs border-border text-muted-foreground"
              >
                {availableRequests.length} active
              </Badge>
            </div>

            {isLoading ? (
              <Skeleton className="w-full h-64 rounded-xl" />
            ) : (
              <MiniMap requests={availableRequests} />
            )}

            <div className="glass rounded-xl p-3 border border-border space-y-2">
              <p className="text-xs text-muted-foreground">
                Your location is marked as{" "}
                <span className="text-primary font-medium">You</span>. Colored
                dots indicate request urgency levels.
              </p>
              <Link to="/map">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs border-primary/40 text-primary hover:bg-primary/10"
                  data-ocid="volunteer.minimap.fullmap_button"
                >
                  <Navigation className="w-3.5 h-3.5 mr-1.5" />
                  Open Full Map Command Center
                </Button>
              </Link>
            </div>
          </div>

          {/* RIGHT – Task Cards 60% */}
          <div className="lg:col-span-3" data-ocid="volunteer.tasks.panel">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-semibold text-foreground text-lg">
                Available Nearby Tasks
              </h2>
              <Badge className="bg-primary/20 border-primary/30 text-primary text-xs">
                {filteredRequests.length} tasks
              </Badge>
            </div>

            {/* Filter chips */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              {FILTER_OPTIONS.map(({ key, label }) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  data-ocid={`volunteer.filter.${key}.toggle`}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-smooth ${
                    activeFilter === key
                      ? "gradient-primary text-primary-foreground border-transparent glow-primary"
                      : "glass border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Task list */}
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-36 rounded-2xl" />
                ))}
              </div>
            ) : filteredRequests.length === 0 ? (
              <div
                className="glass rounded-2xl p-10 text-center border border-border"
                data-ocid="volunteer.tasks.empty_state"
              >
                <AlertTriangle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-foreground font-medium mb-1">
                  No tasks found
                </p>
                <p className="text-muted-foreground text-sm">
                  Try a different filter or check back soon.
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="mt-4 border-primary/40 text-primary hover:bg-primary/10"
                  onClick={() => setActiveFilter("all")}
                >
                  Show All Tasks
                </Button>
              </div>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {filteredRequests.map((req, i) => (
                  <TaskCard
                    key={req.id.toString()}
                    request={req}
                    index={i + 1}
                    onAccept={handleAcceptClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Bottom Stats Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={<CheckCircle2 className="w-5 h-5 text-green-400" />}
            value={completedCount}
            label="Tasks Completed"
            iconBg="bg-green-500/20"
          />
          <StatCard
            icon={<Zap className="w-5 h-5 text-primary" />}
            value={activeAssignments.length}
            label="Active Assignments"
            iconBg="bg-primary/20"
          />
          <StatCard
            icon={<Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />}
            value="4.8"
            label="Volunteer Rating"
            iconBg="bg-yellow-500/20"
          />
        </div>
      </div>

      {/* ── Accept Confirmation Dialog ── */}
      <AcceptDialog
        request={selectedRequest}
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setSelectedRequest(null);
        }}
        onConfirm={handleConfirmAccept}
        isPending={isAssigning}
      />
    </div>
  );
}
