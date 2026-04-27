import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, CheckCircle, Clock, MapPin, Send, Star } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";
import { toast } from "sonner";
import type { UserProfile } from "../../types";

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const STATS = [
  {
    label: "Tasks Done",
    value: "24",
    icon: CheckCircle,
    color: "text-secondary",
  },
  { label: "Requests", value: "8", icon: Send, color: "text-primary" },
  { label: "Rating", value: "4.9", icon: Star, color: "text-amber-400" },
];

interface Props {
  profile: UserProfile;
  onPhotoChange: (url: string) => void;
}

export function ProfileHeader({ profile, onPhotoChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onPhotoChange(url);
    toast.success("Profile photo updated");
  };

  const roleLabel =
    profile.preferredRole === "ngo"
      ? "NGO Coordinator"
      : profile.preferredRole === "admin"
        ? "Administrator"
        : "Volunteer";

  return (
    <div
      className="relative flex flex-col sm:flex-row items-center sm:items-center gap-6 p-8 rounded-2xl overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.15 0.03 262 / 0.85) 0%, oklch(0.18 0.05 290 / 0.85) 50%, oklch(0.16 0.04 270 / 0.85) 100%)",
        backdropFilter: "blur(20px)",
        border: "1px solid oklch(0.35 0.06 270 / 0.25)",
      }}
    >
      {/* Decorative glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 15% 50%, oklch(0.65 0.24 262 / 0.1) 0%, transparent 55%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 85% 30%, oklch(0.68 0.23 290 / 0.08) 0%, transparent 50%)",
        }}
      />

      {/* Avatar */}
      <div className="relative shrink-0 z-10">
        <div
          className="p-1 rounded-full"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Avatar className="w-24 h-24 border-2 border-background/50">
            <AvatarImage
              src={profile.profilePhotoUrl ?? undefined}
              alt={profile.name}
            />
            <AvatarFallback
              className="text-2xl font-display font-bold text-primary-foreground"
              style={{ background: "var(--gradient-primary)" }}
            >
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          data-ocid="profile.photo_upload.button"
          aria-label="Change profile photo"
          className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-smooth glow-primary"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Camera className="w-3.5 h-3.5 text-primary-foreground" />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFile}
          data-ocid="profile.photo_input"
        />
      </div>

      {/* Info */}
      <div className="flex-1 text-center sm:text-left min-w-0 z-10">
        <motion.h2
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-display font-bold text-2xl text-foreground truncate"
        >
          {profile.name}
        </motion.h2>
        <p className="text-muted-foreground text-sm mt-0.5">{profile.email}</p>
        <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
          <Badge
            className="border capitalize"
            style={{
              background: "oklch(0.65 0.24 262 / 0.2)",
              borderColor: "oklch(0.65 0.24 262 / 0.35)",
              color: "oklch(0.72 0.27 262)",
            }}
          >
            {roleLabel}
          </Badge>
          <Badge className="bg-muted/30 text-muted-foreground border border-muted/50">
            <MapPin className="w-3 h-3 mr-1" />
            {profile.address.split(",").slice(-2).join(",").trim()}
          </Badge>
          <Badge className="bg-muted/30 text-muted-foreground border border-muted/50">
            <Clock className="w-3 h-3 mr-1" />
            Active {timeAgo(profile.lastLoginAt)}
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-6 shrink-0 z-10">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="text-center">
              <div
                className={`flex items-center justify-center gap-1 font-display font-bold text-xl ${s.color}`}
              >
                <Icon className="w-4 h-4" />
                {s.value}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
