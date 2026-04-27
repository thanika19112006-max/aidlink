import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAssignVolunteer,
  useAssignments,
  useAvailableVolunteers,
  useNGOs,
  useRequests,
  useUpdateRequestStatus,
} from "@/hooks/useAidLink";
import { RequestStatus } from "@/types";
import type { ResourceRequest, Volunteer } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock,
  FileText,
  Heart,
  Home,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  Star,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Config ──────────────────────────────────────────────────────────────────

const URGENCY_CONFIG: Record<
  string,
  { label: string; textColor: string; badgeBg: string; dotColor: string }
> = {
  critical: {
    label: "Critical",
    textColor: "text-red-400",
    badgeBg: "rgba(239,68,68,0.15)",
    dotColor: "#f87171",
  },
  high: {
    label: "High",
    textColor: "text-orange-400",
    badgeBg: "rgba(249,115,22,0.15)",
    dotColor: "#fb923c",
  },
  medium: {
    label: "Medium",
    textColor: "text-yellow-400",
    badgeBg: "rgba(234,179,8,0.15)",
    dotColor: "#facc15",
  },
  low: {
    label: "Low",
    textColor: "text-green-400",
    badgeBg: "rgba(34,197,94,0.15)",
    dotColor: "#4ade80",
  },
};

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; progress: number; dotColor: string }
> = {
  pending: {
    label: "Pending",
    color: "text-yellow-400",
    progress: 0,
    dotColor: "#facc15",
  },
  ongoing: {
    label: "In Progress",
    color: "text-blue-400",
    progress: 50,
    dotColor: "#60a5fa",
  },
  completed: {
    label: "Completed",
    color: "text-green-400",
    progress: 100,
    dotColor: "#4ade80",
  },
};

const RESOURCE_TYPE_CONFIG: Record<
  string,
  { icon: React.ReactNode; label: string; color: string }
> = {
  food: {
    icon: <Package className="w-3 h-3" />,
    label: "Food",
    color: "rgba(249,115,22,0.2)",
  },
  medical: {
    icon: <Heart className="w-3 h-3" />,
    label: "Medical",
    color: "rgba(239,68,68,0.2)",
  },
  shelter: {
    icon: <Home className="w-3 h-3" />,
    label: "Shelter",
    color: "rgba(59,130,246,0.2)",
  },
  education: {
    icon: <BookOpen className="w-3 h-3" />,
    label: "Education",
    color: "rgba(168,85,247,0.2)",
  },
  other: {
    icon: <Zap className="w-3 h-3" />,
    label: "Other",
    color: "rgba(107,114,128,0.2)",
  },
};

// ─── Mock activity data ────────────────────────────────────────────────────

const MOCK_ACTIVITIES = [
  {
    id: 1,
    text: "Request #3 marked complete",
    sub: "Medical supplies delivered",
    color: "#4ade80",
    time: "2m ago",
  },
  {
    id: 2,
    text: "Volunteer Sarah assigned",
    sub: "To food distribution drive",
    color: "#60a5fa",
    time: "15m ago",
  },
  {
    id: 3,
    text: "New request submitted",
    sub: "Emergency shelter needed",
    color: "#facc15",
    time: "1h ago",
  },
  {
    id: 4,
    text: "Request #7 accepted",
    sub: "Education kit for 50 children",
    color: "#a78bfa",
    time: "3h ago",
  },
  {
    id: 5,
    text: "Impact milestone reached",
    sub: "500 beneficiaries served",
    color: "#fb923c",
    time: "Yesterday",
  },
];

// ─── Subcomponents ────────────────────────────────────────────────────────────

function StatCard({
  icon,
  value,
  label,
  glowColor,
  isLoading,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  glowColor: string;
  isLoading: boolean;
}) {
  return (
    <div
      className="rounded-2xl p-5 border hover-lift relative overflow-hidden"
      style={{
        background: "rgba(20,24,50,0.5)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-8 translate-x-8"
        style={{ background: glowColor }}
        aria-hidden="true"
      />
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
        style={{ background: `${glowColor}25` }}
      >
        {icon}
      </div>
      {isLoading ? (
        <Skeleton className="h-8 w-16 mb-1" />
      ) : (
        <div
          className="font-display font-bold text-3xl mb-1"
          style={{ color: glowColor }}
        >
          {value}
        </div>
      )}
      <div className="text-muted-foreground text-sm">{label}</div>
    </div>
  );
}

function RequestCard({
  request,
  index,
  onAssign,
}: {
  request: ResourceRequest;
  index: number;
  onAssign: (req: ResourceRequest) => void;
}) {
  const { mutateAsync: updateStatus, isPending } = useUpdateRequestStatus();
  const urgency = URGENCY_CONFIG[request.urgency] ?? URGENCY_CONFIG.medium;
  const status = STATUS_CONFIG[request.status] ?? STATUS_CONFIG.pending;
  const resType =
    RESOURCE_TYPE_CONFIG[request.resourceType as string] ??
    RESOURCE_TYPE_CONFIG.other;

  const markComplete = async () => {
    try {
      await updateStatus({
        requestId: request.id,
        status: RequestStatus.completed,
      });
      toast.success("Request marked as completed.");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  return (
    <div
      data-ocid={`ngo.requests.item.${index}`}
      className="rounded-2xl p-5 border hover-lift"
      style={{
        background: "rgba(20,24,50,0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: "rgba(255,255,255,0.07)",
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-foreground truncate text-base">
            {request.title}
          </h3>
          <p className="text-muted-foreground text-sm mt-1 line-clamp-2 leading-relaxed">
            {request.description}
          </p>
        </div>
        {/* Urgency badge */}
        <span
          className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-full font-medium border ${urgency.textColor}`}
          style={{
            background: urgency.badgeBg,
            borderColor: `${urgency.dotColor}40`,
          }}
        >
          {urgency.label}
        </span>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        {/* Resource type */}
        <span
          className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full text-muted-foreground"
          style={{ background: resType.color }}
        >
          {resType.icon}
          {resType.label}
        </span>
        {/* Status */}
        <span
          className={`flex items-center gap-1.5 text-xs font-medium ${status.color}`}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: status.dotColor }}
          />
          {status.label}
        </span>
        {/* Location */}
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          {request.lat.toFixed(2)}°, {request.lng.toFixed(2)}°
        </span>
        {/* Quantity */}
        <span className="text-xs text-muted-foreground">
          Qty: {request.quantity.toString()}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span>Progress</span>
          <span>{status.progress}%</span>
        </div>
        <Progress value={status.progress} className="h-1.5" />
      </div>

      {/* Action row */}
      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="text-xs h-7 flex-1 border-primary/30 text-primary hover:bg-primary/10"
          onClick={() => onAssign(request)}
          data-ocid={`ngo.requests.assign_button.${index}`}
        >
          <Users className="w-3 h-3 mr-1" />
          Assign Volunteer
        </Button>
        {request.status !== RequestStatus.completed && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-xs h-7 text-green-400 hover:bg-green-500/10"
            onClick={markComplete}
            disabled={isPending}
            data-ocid={`ngo.requests.complete_button.${index}`}
          >
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Complete
          </Button>
        )}
      </div>
    </div>
  );
}

function VolunteerRow({
  volunteer,
  index,
  onAssign,
  isAssigning,
}: {
  volunteer: Volunteer;
  index: number;
  onAssign: (v: Volunteer) => void;
  isAssigning: boolean;
}) {
  const initials = volunteer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const rating = Math.round(volunteer.rating);

  return (
    <div
      data-ocid={`ngo.volunteer.item.${index}`}
      className="flex items-center gap-3 py-3 border-b last:border-0"
      style={{ borderColor: "rgba(255,255,255,0.06)" }}
    >
      <Avatar className="w-9 h-9 flex-shrink-0">
        <AvatarFallback
          className="text-xs font-semibold"
          style={{ background: "rgba(99,102,241,0.3)", color: "#a5b4fc" }}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground truncate">
          {volunteer.name}
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          {volunteer.skills.slice(0, 2).map((skill) => (
            <span
              key={skill}
              className="text-xs px-1.5 py-0.5 rounded text-muted-foreground"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-2.5 h-2.5 ${s <= rating ? "text-yellow-400" : "text-muted"}`}
              fill={s <= rating ? "currentColor" : "none"}
            />
          ))}
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="text-xs h-6 px-2.5 border-accent/30 text-accent hover:bg-accent/10"
          onClick={() => onAssign(volunteer)}
          disabled={isAssigning || !volunteer.isAvailable}
          data-ocid={`ngo.volunteer.assign_button.${index}`}
        >
          {volunteer.isAvailable ? "Assign" : "Busy"}
        </Button>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="rounded-2xl p-5 border"
      style={{
        background: "rgba(20,24,50,0.55)",
        borderColor: "rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex justify-between mb-3">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
        <Skeleton className="h-6 w-16 ml-3 rounded-full" />
      </div>
      <div className="flex gap-2 mb-3">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-2 w-full rounded-full mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-7 flex-1 rounded" />
        <Skeleton className="h-7 w-24 rounded" />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function NgoDashboardPage() {
  const { data: requests = [], isLoading: reqLoading } = useRequests();
  const { data: availableVolunteers = [], isLoading: volLoading } =
    useAvailableVolunteers();
  const { data: assignments = [] } = useAssignments();
  const { data: ngos = [] } = useNGOs();
  const assignVolunteer = useAssignVolunteer();

  const [activeTab, setActiveTab] = useState("all");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<ResourceRequest | null>(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(
    null,
  );
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const pending = requests.filter((r) => r.status === RequestStatus.pending);
  const ongoing = requests.filter((r) => r.status === RequestStatus.ongoing);
  const completed = requests.filter(
    (r) => r.status === RequestStatus.completed,
  );

  const completionRate =
    requests.length > 0
      ? Math.round((completed.length / requests.length) * 100)
      : 0;

  const filteredRequests =
    activeTab === "all"
      ? requests
      : activeTab === "pending"
        ? pending
        : activeTab === "ongoing"
          ? ongoing
          : completed;

  const openAssignDialog = (req: ResourceRequest) => {
    setSelectedRequest(req);
    setSelectedVolunteer(null);
    setAssignDialogOpen(true);
  };

  const handleAssignVolunteer = (v: Volunteer) => {
    if (selectedRequest) {
      openAssignDialog(selectedRequest);
    }
    setSelectedVolunteer(v);
  };

  const confirmAssignment = async () => {
    if (!selectedRequest || !selectedVolunteer) return;
    try {
      await assignVolunteer.mutateAsync({
        requestId: selectedRequest.id,
        volunteerId: selectedVolunteer.id,
      });
      toast.success(
        `${selectedVolunteer.name} assigned to "${selectedRequest.title}"`,
      );
      setAssignDialogOpen(false);
    } catch {
      toast.error("Failed to assign volunteer. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #050a1a 0%, #080d20 40%, #0a0e28 70%, #070b1f 100%)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
      data-ocid="ngo.page"
    >
      {/* Ambient glow orbs */}
      <div
        className="fixed top-20 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="fixed bottom-20 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* ── Page Header ───────────────────────────────────────────────── */}
        <div
          className="rounded-2xl p-6 mb-8 border relative overflow-hidden"
          style={{
            background: "rgba(15,20,45,0.7)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderColor: "rgba(99,102,241,0.2)",
          }}
        >
          {/* grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
            aria-hidden="true"
          />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(99,102,241,0.25)" }}
                >
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                <span className="text-primary text-sm font-medium tracking-wide uppercase">
                  NGO Command Center
                </span>
              </div>
              <h1
                className="font-display font-bold text-3xl sm:text-4xl bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #67e8f9 100%)",
                }}
              >
                NGO Dashboard
              </h1>
              <p className="text-muted-foreground mt-1.5">
                Manage your resource requests and volunteer assignments
              </p>
            </div>
            <Link to="/request">
              <Button
                type="button"
                className="h-10 px-5 font-semibold border-0"
                style={{
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  boxShadow: "0 0 20px rgba(99,102,241,0.4)",
                }}
                data-ocid="ngo.create_request.button"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Stats Row ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<FileText className="w-5 h-5" style={{ color: "#818cf8" }} />}
            value={requests.length}
            label="Total Requests"
            glowColor="#6366f1"
            isLoading={reqLoading}
          />
          <StatCard
            icon={<Clock className="w-5 h-5 text-yellow-400" />}
            value={pending.length}
            label="Pending"
            glowColor="#eab308"
            isLoading={reqLoading}
          />
          <StatCard
            icon={<RefreshCw className="w-5 h-5 text-blue-400" />}
            value={ongoing.length}
            label="In Progress"
            glowColor="#3b82f6"
            isLoading={reqLoading}
          />
          <StatCard
            icon={<CheckCircle2 className="w-5 h-5 text-green-400" />}
            value={completed.length}
            label="Completed"
            glowColor="#22c55e"
            isLoading={reqLoading}
          />
        </div>

        {/* ── Main Layout ───────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Request Management ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-lg text-foreground">
                Resource Requests
              </h2>
              <Badge
                variant="outline"
                className="text-xs border-border text-muted-foreground"
              >
                {requests.length} total
              </Badge>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              data-ocid="ngo.requests.tabs"
            >
              <TabsList
                className="w-full mb-4"
                style={{
                  background: "rgba(15,20,45,0.6)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <TabsTrigger
                  value="all"
                  className="flex-1 text-xs"
                  data-ocid="ngo.requests.all.tab"
                >
                  All ({requests.length})
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="flex-1 text-xs"
                  data-ocid="ngo.requests.pending.tab"
                >
                  Pending ({pending.length})
                </TabsTrigger>
                <TabsTrigger
                  value="ongoing"
                  className="flex-1 text-xs"
                  data-ocid="ngo.requests.ongoing.tab"
                >
                  Ongoing ({ongoing.length})
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="flex-1 text-xs"
                  data-ocid="ngo.requests.completed.tab"
                >
                  Done ({completed.length})
                </TabsTrigger>
              </TabsList>

              {[
                "all",
                RequestStatus.pending,
                RequestStatus.ongoing,
                RequestStatus.completed,
              ].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  {reqLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <SkeletonCard key={i} />
                      ))}
                    </div>
                  ) : filteredRequests.length === 0 ? (
                    <div
                      className="rounded-2xl p-10 text-center border"
                      style={{
                        background: "rgba(15,20,45,0.55)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                        borderColor: "rgba(255,255,255,0.07)",
                      }}
                      data-ocid="ngo.requests.empty_state"
                    >
                      <AlertTriangle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-4">
                        No requests here yet. Create your first one!
                      </p>
                      <Link to="/request">
                        <Button
                          type="button"
                          size="sm"
                          className="border-0"
                          style={{
                            background:
                              "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                          }}
                          data-ocid="ngo.requests.create_button"
                        >
                          <Plus className="w-3.5 h-3.5 mr-1" /> Create Request
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 xl:grid-cols-2 gap-4 items-start">
                      {filteredRequests.map((r, i) => (
                        <RequestCard
                          key={r.id.toString()}
                          request={r}
                          index={i + 1}
                          onAssign={openAssignDialog}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* ── Right Sidebar ──────────────────────────────────────── */}
          <div className="space-y-5">
            {/* Impact Summary */}
            <div
              className="rounded-2xl p-5 border"
              style={{
                background: "rgba(15,20,45,0.65)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
              data-ocid="ngo.impact.panel"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h3 className="font-display font-semibold text-foreground text-sm">
                  Impact Summary
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">
                      Completion Rate
                    </span>
                    <span className="font-medium text-green-400">
                      {completionRate}%
                    </span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="rounded-xl p-3 text-center border"
                    style={{
                      background: "rgba(99,102,241,0.1)",
                      borderColor: "rgba(99,102,241,0.2)",
                    }}
                  >
                    <div className="font-display font-bold text-2xl text-primary">
                      {assignments.length}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Assignments
                    </div>
                  </div>
                  <div
                    className="rounded-xl p-3 text-center border"
                    style={{
                      background: "rgba(168,85,247,0.1)",
                      borderColor: "rgba(168,85,247,0.2)",
                    }}
                  >
                    <div className="font-display font-bold text-2xl text-accent">
                      {ngos.length}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Partner NGOs
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Volunteers */}
            <div
              className="rounded-2xl p-5 border"
              style={{
                background: "rgba(15,20,45,0.65)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
              data-ocid="ngo.volunteers.panel"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-accent" />
                  <h3 className="font-display font-semibold text-foreground text-sm">
                    Available Volunteers
                  </h3>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs border-green-500/30 text-green-400"
                >
                  {availableVolunteers.length} ready
                </Badge>
              </div>
              {volLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-3 py-2">
                      <Skeleton className="w-9 h-9 rounded-full" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-3.5 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : availableVolunteers.length === 0 ? (
                <p
                  className="text-muted-foreground text-sm text-center py-4"
                  data-ocid="ngo.volunteers.empty_state"
                >
                  No volunteers available right now.
                </p>
              ) : (
                <div>
                  {availableVolunteers.slice(0, 5).map((v, i) => (
                    <VolunteerRow
                      key={v.id.toString()}
                      volunteer={v}
                      index={i + 1}
                      onAssign={handleAssignVolunteer}
                      isAssigning={assignVolunteer.isPending}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Activity Timeline */}
            <div
              className="rounded-2xl p-5 border"
              style={{
                background: "rgba(15,20,45,0.65)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
              data-ocid="ngo.activity.panel"
            >
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-blue-400" />
                <h3 className="font-display font-semibold text-foreground text-sm">
                  Recent Activity
                </h3>
              </div>
              <div className="space-y-3">
                {MOCK_ACTIVITIES.map((activity, i) => (
                  <div
                    key={activity.id}
                    className="flex gap-3"
                    data-ocid={`ngo.activity.item.${i + 1}`}
                  >
                    {/* Timeline dot + line */}
                    <div className="flex flex-col items-center">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1"
                        style={{ background: activity.color }}
                      />
                      {i < MOCK_ACTIVITIES.length - 1 && (
                        <span
                          className="w-px flex-1 mt-1"
                          style={{
                            background:
                              "linear-gradient(to bottom, rgba(255,255,255,0.08), transparent)",
                            minHeight: "16px",
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pb-2">
                      <p className="text-sm text-foreground font-medium leading-tight">
                        {activity.text}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {activity.sub}
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Assign Volunteer Dialog ────────────────────────────────────── */}
      <Dialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        data-ocid="ngo.assign.dialog"
      >
        <DialogContent
          className="max-w-md border"
          style={{
            background: "rgba(12,16,40,0.97)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderColor: "rgba(99,102,241,0.25)",
          }}
        >
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">
              Assign Volunteer
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              {selectedRequest
                ? `Select a volunteer for "${selectedRequest.title}"`
                : "Choose a volunteer to assign to this request."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {availableVolunteers.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">
                No available volunteers at this time.
              </p>
            ) : (
              availableVolunteers.map((v) => {
                const initials = v.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);
                const isSelected = selectedVolunteer?.id === v.id;
                return (
                  <button
                    key={v.id.toString()}
                    type="button"
                    className="w-full flex items-center gap-3 p-3 rounded-xl border transition-smooth text-left"
                    style={{
                      background: isSelected
                        ? "rgba(99,102,241,0.15)"
                        : "rgba(255,255,255,0.03)",
                      borderColor: isSelected
                        ? "rgba(99,102,241,0.4)"
                        : "rgba(255,255,255,0.06)",
                    }}
                    onClick={() => setSelectedVolunteer(v)}
                    data-ocid={`ngo.assign.volunteer.${v.id}`}
                  >
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback
                        className="text-xs font-semibold"
                        style={{
                          background: "rgba(99,102,241,0.3)",
                          color: "#a5b4fc",
                        }}
                      >
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">
                        {v.name}
                      </div>
                      <div className="flex gap-1 mt-0.5 flex-wrap">
                        {v.skills.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="text-xs text-muted-foreground px-1.5 py-0.5 rounded"
                            style={{ background: "rgba(255,255,255,0.06)" }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-border text-muted-foreground"
              onClick={() => setAssignDialogOpen(false)}
              data-ocid="ngo.assign.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1 border-0"
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                boxShadow: selectedVolunteer
                  ? "0 0 16px rgba(99,102,241,0.35)"
                  : "none",
              }}
              disabled={!selectedVolunteer || assignVolunteer.isPending}
              onClick={confirmAssignment}
              data-ocid="ngo.assign.confirm_button"
            >
              {assignVolunteer.isPending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                "Confirm Assignment"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
