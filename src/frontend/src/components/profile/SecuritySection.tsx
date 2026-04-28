import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Clock,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  Monitor,
  Shield,
  Smartphone,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { UserProfile } from "../../types";
import { timeAgo } from "./ProfileHeader";

interface Props {
  profile: UserProfile;
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  ocid,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  ocid: string;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          data-ocid={ocid}
          className="glass border-border pr-10"
          placeholder={placeholder ?? "••••••••"}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function PasswordCard() {
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof passwords) => (v: string) =>
    setPasswords((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.next.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    toast.success("Password updated successfully");
    setPasswords({ current: "", next: "", confirm: "" });
    setSaving(false);
  };

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
          <Lock className="w-4 h-4 text-primary" /> Change Password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          data-ocid="profile.password_form"
        >
          <PasswordField
            id="sec-current"
            label="Current Password"
            value={passwords.current}
            onChange={set("current")}
            ocid="profile.current_password.input"
          />
          <PasswordField
            id="sec-new"
            label="New Password"
            value={passwords.next}
            onChange={set("next")}
            ocid="profile.new_password.input"
            placeholder="Min 8 characters"
          />
          {passwords.next.length > 0 && passwords.next.length < 8 && (
            <p
              className="text-xs text-destructive"
              data-ocid="profile.password.field_error"
            >
              Password must be at least 8 characters
            </p>
          )}
          <PasswordField
            id="sec-confirm"
            label="Confirm New Password"
            value={passwords.confirm}
            onChange={set("confirm")}
            ocid="profile.confirm_password.input"
          />
          {passwords.confirm.length > 0 &&
            passwords.next !== passwords.confirm && (
              <p
                className="text-xs text-destructive"
                data-ocid="profile.confirm_password.field_error"
              >
                Passwords do not match
              </p>
            )}
          <Button
            type="submit"
            disabled={saving}
            data-ocid="profile.change_password.submit_button"
            className="text-primary-foreground border-0"
            style={{ background: "var(--gradient-primary)" }}
          >
            {saving ? (
              <span
                className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin mr-2"
                data-ocid="profile.password.loading_state"
              />
            ) : (
              <Shield className="w-4 h-4 mr-2" />
            )}
            {saving ? "Updating…" : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

const SESSIONS = [
  {
    device: "Chrome on macOS",
    location: "Chennai, India",
    current: true,
    icon: Monitor,
  },
  {
    device: "AidLink Mobile App",
    location: "Chennai, India",
    current: false,
    icon: Smartphone,
  },
];

export function SecuritySection({ profile }: Props) {
  return (
    <div className="space-y-6" data-ocid="profile.security_panel">
      <PasswordCard />

      {/* Session info */}
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
            <Shield className="w-4 h-4 text-accent" /> Account Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Last login */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between p-4 rounded-xl"
            style={{
              background: "oklch(0.18 0.02 260 / 0.5)",
              border: "1px solid oklch(0.28 0.04 270 / 0.15)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "oklch(0.65 0.24 262 / 0.15)" }}
              >
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">
                  Last Login
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {timeAgo(profile.lastLoginAt)} ·{" "}
                  {new Date(profile.lastLoginAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                background: "oklch(0.72 0.21 270 / 0.15)",
                color: "oklch(0.72 0.21 270)",
              }}
            >
              Verified
            </span>
          </motion.div>

          {/* Active sessions */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 px-1">
              Active Sessions
            </p>
            {SESSIONS.map((session, i) => {
              const Icon = session.icon;
              return (
                <motion.div
                  key={session.device}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  data-ocid={`profile.session_item.${i + 1}`}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{
                    background: "oklch(0.18 0.02 260 / 0.4)",
                    border: "1px solid oklch(0.28 0.04 270 / 0.12)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {session.device}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {session.location}
                      </p>
                    </div>
                  </div>
                  {session.current ? (
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: "oklch(0.72 0.21 270 / 0.15)",
                        color: "oklch(0.72 0.21 270)",
                      }}
                    >
                      Current
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="text-xs text-destructive hover:underline transition-smooth"
                      data-ocid={`profile.revoke_session.${i + 1}`}
                      onClick={() => toast.success("Session revoked")}
                    >
                      Revoke
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>

          <Separator
            className="opacity-20"
            style={{ background: "oklch(0.28 0.04 270)" }}
          />

          {/* Two-factor auth */}
          <div className="space-y-3">
            <div
              className="flex items-center justify-between p-3 rounded-xl"
              style={{
                background: "oklch(0.18 0.02 260 / 0.4)",
                border: "1px solid oklch(0.28 0.04 270 / 0.12)",
              }}
            >
              <div>
                <p className="font-medium text-sm text-foreground">
                  Two-Factor Authentication
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch
                data-ocid="profile.two_factor.switch"
                onCheckedChange={(v) =>
                  toast.success(v ? "2FA enabled" : "2FA disabled")
                }
              />
            </div>
          </div>

          <Separator
            className="opacity-20"
            style={{ background: "oklch(0.28 0.04 270)" }}
          />

          <Button
            variant="destructive"
            size="sm"
            data-ocid="profile.logout.button"
            className="w-full justify-start gap-2"
            onClick={() => toast.info("Signed out of all devices")}
          >
            <LogOut className="w-4 h-4" /> Sign Out of All Devices
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
