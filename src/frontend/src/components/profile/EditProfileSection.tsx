import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Save, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { UserProfile, UserProfileUpdate } from "../../types";

interface Props {
  profile: UserProfile;
  onSave: (u: UserProfileUpdate) => void;
  notificationsOnly?: boolean;
}

function PersonalInfoForm({
  profile,
  onSave,
}: {
  profile: UserProfile;
  onSave: (u: UserProfileUpdate) => void;
}) {
  const [form, setForm] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    address: profile.address,
    preferredRole: profile.preferredRole,
  });
  const [saving, setSaving] = useState(false);

  const set =
    (k: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    onSave(form);
    toast.success("Profile saved successfully");
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
          <User className="w-4 h-4 text-primary" /> Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          data-ocid="profile.edit_form"
          className="space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pf-name">Full Name</Label>
              <Input
                id="pf-name"
                value={form.name}
                onChange={set("name")}
                data-ocid="profile.name.input"
                placeholder="Your full name"
                className="glass border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-email">Email Address</Label>
              <Input
                id="pf-email"
                type="email"
                value={form.email}
                onChange={set("email")}
                data-ocid="profile.email.input"
                placeholder="your@email.com"
                className="glass border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-phone">Phone Number</Label>
              <Input
                id="pf-phone"
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                data-ocid="profile.phone.input"
                placeholder="+91 XXXXX XXXXX"
                className="glass border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pf-role">Preferred Role</Label>
              <select
                id="pf-role"
                value={form.preferredRole}
                onChange={set("preferredRole")}
                data-ocid="profile.role.select"
                className="w-full h-10 px-3 rounded-md text-sm glass border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-smooth"
              >
                <option value="volunteer">Volunteer</option>
                <option value="ngo">NGO Coordinator</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="pf-address">Address</Label>
              <Textarea
                id="pf-address"
                value={form.address}
                onChange={set("address")}
                data-ocid="profile.address.textarea"
                placeholder="Your full address"
                rows={3}
                className="glass border-border resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              data-ocid="profile.save.submit_button"
              className="min-w-[130px] text-primary-foreground border-0 glow-primary"
              style={{ background: "var(--gradient-primary)" }}
            >
              {saving ? (
                <span
                  className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin mr-2"
                  data-ocid="profile.save.loading_state"
                />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function NotificationsForm({
  profile,
  onSave,
}: {
  profile: UserProfile;
  onSave: (u: UserProfileUpdate) => void;
}) {
  const [prefs, setPrefs] = useState({
    notificationEmail: profile.notificationEmail,
    notificationTaskReminders: profile.notificationTaskReminders,
    notificationRequestUpdates: profile.notificationRequestUpdates,
  });

  const toggle = (k: keyof typeof prefs) => () => {
    const next = { ...prefs, [k]: !prefs[k] };
    setPrefs(next);
    onSave(next);
    toast.success("Notification preference updated");
  };

  const items = [
    {
      key: "notificationEmail" as const,
      label: "Email Notifications",
      desc: "Receive important updates and alerts via email",
    },
    {
      key: "notificationTaskReminders" as const,
      label: "Task Reminders",
      desc: "Get reminded about upcoming assignments and deadlines",
    },
    {
      key: "notificationRequestUpdates" as const,
      label: "Request Updates",
      desc: "Alerts when your saved requests change status",
    },
  ];

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
          <Bell className="w-4 h-4 text-primary" /> Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3" data-ocid="profile.notifications_panel">
          {items.map((item, i) => (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              data-ocid={`profile.notification_item.${i + 1}`}
              className="flex items-center justify-between p-4 rounded-xl transition-smooth hover:border-primary/30"
              style={{
                background: "oklch(0.18 0.02 260 / 0.5)",
                border: "1px solid oklch(0.28 0.04 270 / 0.15)",
              }}
            >
              <div>
                <p className="font-medium text-foreground text-sm">
                  {item.label}
                </p>
                <p className="text-muted-foreground text-xs mt-0.5">
                  {item.desc}
                </p>
              </div>
              <Switch
                checked={prefs[item.key]}
                onCheckedChange={toggle(item.key)}
                data-ocid={`profile.${item.key}.switch`}
              />
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function EditProfileSection({
  profile,
  onSave,
  notificationsOnly = false,
}: Props) {
  if (notificationsOnly) {
    return <NotificationsForm profile={profile} onSave={onSave} />;
  }
  return (
    <div className="space-y-6">
      <PersonalInfoForm profile={profile} onSave={onSave} />
      <NotificationsForm profile={profile} onSave={onSave} />
    </div>
  );
}
