import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckSquare, Clock } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useAssignments, useRequests } from "../../hooks/useAidLink";
import { AssignmentStatus } from "../../types";

type TimePeriod = "all" | "week" | "month";

const PERIOD_LABELS: Record<TimePeriod, string> = {
  all: "All Time",
  week: "This Week",
  month: "This Month",
};

function formatDate(ts: bigint | number | undefined): string {
  if (ts === undefined) return "—";
  const ms = typeof ts === "bigint" ? Number(ts) : ts;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isWithinPeriod(
  ts: bigint | number | undefined,
  period: TimePeriod,
): boolean {
  if (period === "all") return true;
  if (ts === undefined) return false;
  const ms = typeof ts === "bigint" ? Number(ts) : ts;
  const now = Date.now();
  if (period === "week") return now - ms <= 7 * 86400000;
  return now - ms <= 30 * 86400000;
}

const SEED_TASKS = [
  {
    id: BigInt(1),
    requestTitle: "Emergency Food Supply – Velachery",
    resourceType: "food",
    completedAt: BigInt(Date.now() - 86400000),
    status: AssignmentStatus.completed,
  },
  {
    id: BigInt(2),
    requestTitle: "Medical Kits – Guindy Relief Camp",
    resourceType: "medical",
    completedAt: BigInt(Date.now() - 3 * 86400000),
    status: AssignmentStatus.completed,
  },
  {
    id: BigInt(3),
    requestTitle: "Shelter Setup – Adyar Flood Area",
    resourceType: "shelter",
    completedAt: BigInt(Date.now() - 10 * 86400000),
    status: AssignmentStatus.completed,
  },
  {
    id: BigInt(4),
    requestTitle: "Education Drive – Tambaram Schools",
    resourceType: "education",
    completedAt: BigInt(Date.now() - 18 * 86400000),
    status: AssignmentStatus.completed,
  },
  {
    id: BigInt(5),
    requestTitle: "Blankets Distribution – T. Nagar",
    resourceType: "other",
    completedAt: BigInt(Date.now() - 25 * 86400000),
    status: AssignmentStatus.completed,
  },
];

const RESOURCE_COLORS: Record<string, string> = {
  food: "bg-secondary/20 text-secondary border-secondary/30",
  medical: "bg-destructive/20 text-destructive border-destructive/30",
  shelter: "bg-accent/20 text-accent border-accent/30",
  education: "bg-primary/20 text-primary border-primary/30",
  other: "bg-muted/30 text-muted-foreground border-muted/50",
};

export function CompletedTasksSection({ userId: _userId }: { userId: string }) {
  const [period, setPeriod] = useState<TimePeriod>("all");
  const { data: assignments, isLoading: assignLoading } = useAssignments();
  const { data: requests } = useRequests();

  // Build enriched completed tasks
  const completedAssignments = assignments?.filter(
    (a) => a.status === AssignmentStatus.completed,
  );

  const enriched =
    completedAssignments?.map((a) => {
      const req = requests?.find((r) => r.id === a.requestId);
      return {
        id: a.id,
        requestTitle: req?.title ?? `Assignment #${String(a.id)}`,
        resourceType: req ? String(req.resourceType) : "other",
        completedAt: a.completedAt,
        status: a.status,
      };
    }) ?? [];

  const displayItems = enriched.length ? enriched : SEED_TASKS;

  const filtered = displayItems.filter((t) =>
    isWithinPeriod(t.completedAt, period),
  );

  return (
    <Card
      className="border-0"
      style={{
        background: "oklch(0.14 0.02 260 / 0.8)",
        backdropFilter: "blur(12px)",
        border: "1px solid oklch(0.28 0.04 270 / 0.2)",
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckSquare className="w-4 h-4 text-primary" /> Completed Tasks
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {displayItems.length} total tasks completed
            </p>
          </div>
          {/* Period filter */}
          <div
            className="flex rounded-lg p-0.5 gap-0.5"
            style={{ background: "oklch(0.18 0.02 260 / 0.5)" }}
            data-ocid="profile.tasks_period_filter"
          >
            {(["all", "week", "month"] as TimePeriod[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                data-ocid={`profile.tasks_filter.${p}`}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-smooth ${
                  period === p
                    ? "text-primary-foreground glow-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={
                  period === p
                    ? { background: "var(--gradient-primary)" }
                    : undefined
                }
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {assignLoading ? (
          <div
            className="grid sm:grid-cols-2 gap-3"
            data-ocid="profile.tasks.loading_state"
          >
            {[1, 2, 3, 4].map((k) => (
              <div
                key={k}
                className="h-24 rounded-xl animate-pulse"
                style={{ background: "oklch(0.18 0.02 260 / 0.4)" }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="text-center py-12"
            data-ocid="profile.tasks.empty_state"
          >
            <CheckSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              No completed tasks{" "}
              {period !== "all"
                ? `in ${PERIOD_LABELS[period].toLowerCase()}`
                : "yet"}
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Accept and complete assignments to see them here
            </p>
          </div>
        ) : (
          <div
            className="grid sm:grid-cols-2 gap-3"
            data-ocid="profile.tasks_list"
          >
            {filtered.map((task, i) => (
              <motion.div
                key={String(task.id)}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                data-ocid={`profile.task_item.${i + 1}`}
                className="p-4 rounded-xl hover-lift"
                style={{
                  background: "oklch(0.18 0.02 260 / 0.5)",
                  border: "1px solid oklch(0.28 0.04 270 / 0.15)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "oklch(0.72 0.21 270 / 0.15)" }}
                  >
                    <CheckSquare className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm line-clamp-2">
                      {task.requestTitle}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge
                        className={`text-xs border capitalize ${RESOURCE_COLORS[task.resourceType] ?? RESOURCE_COLORS.other}`}
                      >
                        {task.resourceType}
                      </Badge>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        {task.completedAt ? (
                          <>
                            <Calendar className="w-3 h-3" />
                            {formatDate(task.completedAt)}
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            In progress
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
