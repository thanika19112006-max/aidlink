import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, MapPin, Star, Users } from "lucide-react";
import { motion } from "motion/react";
import { useRecentVolunteers } from "../../hooks/useAidLink";
import { getInitials } from "./ProfileHeader";

const SEED_VOLUNTEERS = [
  {
    id: BigInt(1),
    name: "Priya Ramesh",
    isAvailable: true,
    skills: ["First Aid", "Logistics"],
    completedTasks: BigInt(12),
    rating: 4.8,
    lat: 13.07,
    lng: 80.26,
  },
  {
    id: BigInt(2),
    name: "Karthik Balaji",
    isAvailable: false,
    skills: ["Education", "Counseling"],
    completedTasks: BigInt(7),
    rating: 4.6,
    lat: 13.08,
    lng: 80.27,
  },
  {
    id: BigInt(3),
    name: "Meena Sundaram",
    isAvailable: true,
    skills: ["Medical", "Food Distribution"],
    completedTasks: BigInt(19),
    rating: 4.9,
    lat: 13.06,
    lng: 80.25,
  },
  {
    id: BigInt(4),
    name: "Rajan Pillai",
    isAvailable: true,
    skills: ["Shelter", "Construction"],
    completedTasks: BigInt(5),
    rating: 4.5,
    lat: 13.09,
    lng: 80.28,
  },
  {
    id: BigInt(5),
    name: "Anita Krishnan",
    isAvailable: false,
    skills: ["Admin", "Coordination"],
    completedTasks: BigInt(3),
    rating: 4.4,
    lat: 13.05,
    lng: 80.24,
  },
  {
    id: BigInt(6),
    name: "Suresh Mohan",
    isAvailable: true,
    skills: ["Driving", "Logistics"],
    completedTasks: BigInt(9),
    rating: 4.7,
    lat: 13.1,
    lng: 80.29,
  },
];

const CITY_ZONES = [
  "Anna Nagar, Chennai",
  "Adyar, Chennai",
  "Velachery, Chennai",
  "Tambaram, Chennai",
  "T. Nagar, Chennai",
  "Guindy, Chennai",
];

export function NewVolunteersSection() {
  const { data: volunteers, isLoading } = useRecentVolunteers(8);
  const items = volunteers?.length ? volunteers : SEED_VOLUNTEERS;

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
          <Users className="w-4 h-4 text-secondary" /> New Volunteers
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Recently joined the AidLink network
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3"
            data-ocid="profile.new_volunteers.loading_state"
          >
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <div
                key={k}
                className="h-28 rounded-xl animate-pulse"
                style={{ background: "oklch(0.18 0.02 260 / 0.4)" }}
              />
            ))}
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3"
            data-ocid="profile.new_volunteers_grid"
          >
            {items.map((vol, i) => (
              <motion.div
                key={String(vol.id)}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                data-ocid={`profile.volunteer_card.${i + 1}`}
                className="p-4 rounded-xl hover-lift transition-smooth group cursor-pointer"
                style={{
                  background: "oklch(0.18 0.02 260 / 0.5)",
                  border: "1px solid oklch(0.28 0.04 270 / 0.15)",
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="p-0.5 rounded-full shrink-0"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <Avatar className="w-9 h-9 border border-background/50">
                      <AvatarFallback
                        className="text-xs font-bold text-primary-foreground"
                        style={{ background: "var(--gradient-primary)" }}
                      >
                        {getInitials(vol.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">
                      {vol.name}
                    </p>
                    <span
                      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border mt-1 font-medium"
                      style={
                        vol.isAvailable
                          ? {
                              background: "oklch(0.72 0.21 270 / 0.15)",
                              color: "oklch(0.75 0.21 270)",
                              borderColor: "oklch(0.72 0.21 270 / 0.3)",
                            }
                          : {
                              background: "oklch(0.3 0.02 260 / 0.3)",
                              color: "oklch(0.6 0.02 260)",
                              borderColor: "oklch(0.3 0.02 260 / 0.5)",
                            }
                      }
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: vol.isAvailable
                            ? "oklch(0.75 0.21 270)"
                            : "oklch(0.5 0.02 260)",
                        }}
                      />
                      {vol.isAvailable ? "Available" : "Busy"}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {vol.skills.slice(0, 2).map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2 py-0.5 rounded font-medium"
                      style={{
                        background: "oklch(0.65 0.24 262 / 0.15)",
                        color: "oklch(0.72 0.27 262)",
                        border: "1px solid oklch(0.65 0.24 262 / 0.25)",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-secondary" />
                    {String(vol.completedTasks)} tasks
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {CITY_ZONES[i] ?? "Chennai"}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {vol.rating}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
