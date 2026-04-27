import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { useGetSavedRequests } from "../../hooks/useAidLink";
import { timeAgo } from "./ProfileHeader";

const SEED_SAVED = [
  {
    id: "req-001",
    title: "Emergency Food Supply – Velachery",
    description:
      "500 food packets needed for flood-affected families in low-lying areas",
    urgency: "critical",
    status: "ongoing",
    savedAt: Date.now() - 7200000,
  },
  {
    id: "req-002",
    title: "Medical Kits – Guindy Relief Camp",
    description:
      "First aid kits and essential medicines for 200 displaced people",
    urgency: "high",
    status: "pending",
    savedAt: Date.now() - 14400000,
  },
  {
    id: "req-003",
    title: "Blankets and Clothing – Adyar",
    description: "Winter clothing drive for families displaced by flooding",
    urgency: "medium",
    status: "pending",
    savedAt: Date.now() - 86400000,
  },
  {
    id: "req-004",
    title: "Clean Water Supply – Tambaram",
    description: "10,000 liters of clean water for temporary shelter residents",
    urgency: "critical",
    status: "ongoing",
    savedAt: Date.now() - 2 * 86400000,
  },
];

const URGENCY_STYLES: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  critical: {
    bg: "oklch(0.65 0.27 15 / 0.15)",
    text: "oklch(0.75 0.27 15)",
    border: "oklch(0.65 0.27 15 / 0.3)",
  },
  high: {
    bg: "oklch(0.7 0.22 50 / 0.15)",
    text: "oklch(0.75 0.2 50)",
    border: "oklch(0.7 0.22 50 / 0.3)",
  },
  medium: {
    bg: "oklch(0.72 0.21 270 / 0.15)",
    text: "oklch(0.75 0.21 270)",
    border: "oklch(0.72 0.21 270 / 0.3)",
  },
  low: {
    bg: "oklch(0.3 0.02 260 / 0.3)",
    text: "oklch(0.6 0.02 260)",
    border: "oklch(0.3 0.02 260 / 0.5)",
  },
};

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  ongoing: { bg: "oklch(0.65 0.24 262 / 0.15)", text: "oklch(0.72 0.27 262)" },
  pending: { bg: "oklch(0.3 0.02 260 / 0.3)", text: "oklch(0.65 0.02 260)" },
  completed: {
    bg: "oklch(0.72 0.21 270 / 0.15)",
    text: "oklch(0.72 0.21 270)",
  },
};

function UrgencyDot({ urgency }: { urgency: string }) {
  const s = URGENCY_STYLES[urgency] ?? URGENCY_STYLES.low;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize"
      style={{ background: s.bg, color: s.text, borderColor: s.border }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: s.text }}
      />
      {urgency}
    </span>
  );
}

export function SavedRequestsSection({ userId }: { userId: string }) {
  const { data: saved, isLoading } = useGetSavedRequests(userId);
  const items = saved?.length ? saved : SEED_SAVED;

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
        <CardTitle className="flex items-center gap-2 text-base">
          <Bookmark className="w-4 h-4 text-primary" /> Saved Requests
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Requests you bookmarked from the Impact Map
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3" data-ocid="profile.saved.loading_state">
            {[1, 2, 3].map((k) => (
              <div
                key={k}
                className="h-24 rounded-xl animate-pulse"
                style={{ background: "oklch(0.18 0.02 260 / 0.4)" }}
              />
            ))}
          </div>
        ) : !items.length ? (
          <div
            className="text-center py-16"
            data-ocid="profile.saved.empty_state"
          >
            <Bookmark className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              No saved requests yet
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Bookmark requests from the Impact Map to track them here
            </p>
          </div>
        ) : (
          <div className="space-y-3" data-ocid="profile.saved_list">
            {items.map((req, i) => {
              const statusS =
                STATUS_STYLES[req.status] ?? STATUS_STYLES.pending;
              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  data-ocid={`profile.saved_item.${i + 1}`}
                  className="flex items-start gap-4 p-4 rounded-xl hover-lift"
                  style={{
                    background: "oklch(0.18 0.02 260 / 0.5)",
                    border: "1px solid oklch(0.28 0.04 270 / 0.15)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "oklch(0.65 0.24 262 / 0.15)" }}
                  >
                    <Bookmark className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-foreground text-sm line-clamp-1">
                        {req.title}
                      </p>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0 mt-0.5 hover:text-primary transition-smooth cursor-pointer" />
                    </div>
                    <p className="text-muted-foreground text-xs mt-0.5 line-clamp-1">
                      {req.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <UrgencyDot urgency={req.urgency} />
                      <span
                        className="text-xs px-2.5 py-1 rounded-full capitalize font-medium"
                        style={{ background: statusS.bg, color: statusS.text }}
                      >
                        {req.status}
                      </span>
                      <span className="text-xs text-muted-foreground/60 ml-auto">
                        {timeAgo(req.savedAt)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
