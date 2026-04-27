import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  CheckCircle,
  MapPin,
  Settings,
  Star,
  UserPlus,
} from "lucide-react";
import { motion } from "motion/react";
import { useUserActivity } from "../../hooks/useAidLink";
import { timeAgo } from "./ProfileHeader";

const SEED_ACTIVITIES = [
  {
    id: 1,
    userId: "user-demo-001",
    action: "Task Completed",
    description: "Delivered food supplies to Chennai flood relief camp",
    timestamp: Date.now() - 86400000,
  },
  {
    id: 2,
    userId: "user-demo-001",
    action: "Request Accepted",
    description: "Accepted medical supply request from Red Cross NGO",
    timestamp: Date.now() - 172800000,
  },
  {
    id: 3,
    userId: "user-demo-001",
    action: "Profile Updated",
    description: "Updated contact details and notification preferences",
    timestamp: Date.now() - 259200000,
  },
  {
    id: 4,
    userId: "user-demo-001",
    action: "Task Completed",
    description: "Assisted shelter setup at Velachery community center",
    timestamp: Date.now() - 345600000,
  },
  {
    id: 5,
    userId: "user-demo-001",
    action: "New Assignment",
    description: "Assigned to education support drive in Tambaram",
    timestamp: Date.now() - 432000000,
  },
  {
    id: 6,
    userId: "user-demo-001",
    action: "Volunteer Joined",
    description: "Joined AidLink as a verified volunteer",
    timestamp: Date.now() - 30 * 86400000,
  },
];

const ACTION_CONFIG: Record<
  string,
  { icon: React.ElementType; color: string; bg: string }
> = {
  "Task Completed": {
    icon: CheckCircle,
    color: "text-secondary",
    bg: "oklch(0.72 0.21 270 / 0.15)",
  },
  "Request Accepted": {
    icon: Activity,
    color: "text-primary",
    bg: "oklch(0.65 0.24 262 / 0.15)",
  },
  "Profile Updated": {
    icon: Settings,
    color: "text-accent",
    bg: "oklch(0.68 0.23 290 / 0.15)",
  },
  "New Assignment": {
    icon: MapPin,
    color: "text-primary",
    bg: "oklch(0.65 0.24 262 / 0.15)",
  },
  "Volunteer Joined": {
    icon: UserPlus,
    color: "text-secondary",
    bg: "oklch(0.72 0.21 270 / 0.15)",
  },
  "Rating Received": {
    icon: Star,
    color: "text-amber-400",
    bg: "oklch(0.8 0.18 85 / 0.15)",
  },
};

function getActionConfig(action: string) {
  return (
    ACTION_CONFIG[action] ?? {
      icon: Activity,
      color: "text-muted-foreground",
      bg: "oklch(0.2 0.02 260 / 0.3)",
    }
  );
}

export function ActivitySection({ userId }: { userId: string }) {
  const { data: activities, isLoading } = useUserActivity(userId, 15);
  const items = activities?.length ? activities : SEED_ACTIVITIES;

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
          <Activity className="w-4 h-4 text-primary" /> Activity History
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Your recent actions on the AidLink platform
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4" data-ocid="profile.activity.loading_state">
            {[1, 2, 3, 4].map((k) => (
              <div key={k} className="flex gap-4 items-start">
                <div
                  className="w-9 h-9 rounded-lg animate-pulse"
                  style={{ background: "oklch(0.2 0.02 260 / 0.5)" }}
                />
                <div className="flex-1 space-y-2">
                  <div
                    className="h-3 w-32 rounded animate-pulse"
                    style={{ background: "oklch(0.2 0.02 260 / 0.5)" }}
                  />
                  <div
                    className="h-2.5 w-56 rounded animate-pulse"
                    style={{ background: "oklch(0.18 0.02 260 / 0.4)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative space-y-0" data-ocid="profile.activity_list">
            {items.map((activity, i) => {
              const cfg = getActionConfig(activity.action);
              const Icon = cfg.icon;
              const isLast = i === items.length - 1;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  data-ocid={`profile.activity_item.${i + 1}`}
                  className="relative flex gap-4 pb-6"
                >
                  {/* Timeline line */}
                  {!isLast && (
                    <div
                      className="absolute left-4.5 top-9 bottom-0 w-px"
                      style={{
                        background:
                          "linear-gradient(to bottom, oklch(0.65 0.24 262 / 0.3), oklch(0.68 0.23 290 / 0.1))",
                      }}
                    />
                  )}
                  {/* Icon */}
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 z-10"
                    style={{ background: cfg.bg }}
                  >
                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {activity.action}
                        </p>
                        <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2">
                          {activity.description}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground/70 shrink-0 mt-0.5">
                        {timeAgo(activity.timestamp)}
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
