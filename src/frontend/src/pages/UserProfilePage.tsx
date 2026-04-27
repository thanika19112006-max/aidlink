import {
  Activity,
  Bell,
  Bookmark,
  CheckSquare,
  Edit3,
  Moon,
  Shield,
  Sun,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ActivitySection } from "../components/profile/ActivitySection";
import { CompletedTasksSection } from "../components/profile/CompletedTasksSection";
import { EditProfileSection } from "../components/profile/EditProfileSection";
import { NewVolunteersSection } from "../components/profile/NewVolunteersSection";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { SavedRequestsSection } from "../components/profile/SavedRequestsSection";
import { SecuritySection } from "../components/profile/SecuritySection";
import { useUpdateUserProfile, useUserProfile } from "../hooks/useAidLink";
import { useTheme } from "../hooks/useTheme";
import type { UserProfile, UserProfileUpdate } from "../types";

// ─── Seed data ────────────────────────────────────────────────────────────────
const MOCK_USER_ID = "user-demo-001";

export const SEED_PROFILE: UserProfile = {
  id: MOCK_USER_ID,
  name: "Arjun Sharma",
  email: "arjun.sharma@aidlink.org",
  phone: "+91 98765 43210",
  address: "12, Anna Nagar, Chennai, Tamil Nadu 600040",
  profilePhotoUrl: null,
  preferredRole: "volunteer",
  notificationEmail: true,
  notificationTaskReminders: true,
  notificationRequestUpdates: false,
  lastLoginAt: Date.now() - 3600000,
  createdAt: Date.now() - 30 * 24 * 3600000,
};

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "saved", label: "Saved", icon: Bookmark },
  { id: "notifications", label: "Alerts", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
] as const;

type NavId = (typeof NAV_ITEMS)[number]["id"];

// ─── Sidebar nav ──────────────────────────────────────────────────────────────
function SidebarNav({
  active,
  onChange,
  isDark,
  toggleTheme,
}: {
  active: NavId;
  onChange: (id: NavId) => void;
  isDark: boolean;
  toggleTheme: () => void;
}) {
  return (
    <aside
      className="hidden lg:flex flex-col w-56 shrink-0 rounded-2xl overflow-hidden"
      style={{
        background: "oklch(0.12 0.02 260 / 0.85)",
        backdropFilter: "blur(20px)",
        border: "1px solid oklch(0.28 0.04 270 / 0.2)",
      }}
    >
      <div className="p-4 border-b border-border/30">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
          My Account
        </p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              data-ocid={`profile.sidebar_nav.${item.id}`}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-smooth ${
                isActive
                  ? "gradient-primary text-primary-foreground shadow-glow-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground/80"
                />
              )}
            </button>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border/30">
        <button
          type="button"
          onClick={toggleTheme}
          data-ocid="profile.theme_toggle"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-smooth"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </aside>
  );
}

// ─── Mobile bottom nav ────────────────────────────────────────────────────────
function MobileNav({
  active,
  onChange,
}: {
  active: NavId;
  onChange: (id: NavId) => void;
}) {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-2"
      style={{
        background: "oklch(0.1 0.02 260 / 0.95)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid oklch(0.28 0.04 270 / 0.2)",
      }}
      data-ocid="profile.mobile_nav"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            data-ocid={`profile.mobile_nav.${item.id}`}
            aria-label={item.label}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-smooth ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "drop-shadow-glow" : ""}`} />
            <span className="text-[10px] font-medium">{item.label}</span>
            {isActive && (
              <motion.div
                layoutId="mobile-indicator"
                className="absolute -bottom-0.5 w-8 h-0.5 rounded-full bg-primary"
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function UserProfilePage() {
  const { data: backendProfile } = useUserProfile(MOCK_USER_ID);
  const { mutate: updateProfile } = useUpdateUserProfile();
  const { isDark, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<NavId>("profile");
  const [profile, setProfile] = useState<UserProfile>(SEED_PROFILE);

  // Merge backend profile when available
  if (backendProfile && backendProfile.id !== profile.id) {
    setProfile(backendProfile);
  }

  const handleSave = (update: UserProfileUpdate) => {
    setProfile((prev) => ({ ...prev, ...update }));
    updateProfile({ userId: MOCK_USER_ID, update });
  };

  const handlePhotoChange = (url: string) => {
    setProfile((prev) => ({ ...prev, profilePhotoUrl: url }));
    updateProfile({ userId: MOCK_USER_ID, update: { profilePhotoUrl: url } });
  };

  return (
    <div className="min-h-screen pb-24 lg:pb-8" data-ocid="profile.page">
      {/* Page header banner */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.12 0.03 262 / 0.9) 0%, oklch(0.15 0.04 290 / 0.9) 50%, oklch(0.1 0.02 270 / 0.9) 100%)",
          borderBottom: "1px solid oklch(0.28 0.04 270 / 0.2)",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full pointer-events-none opacity-20"
          style={{
            background:
              "radial-gradient(circle, oklch(0.65 0.24 262) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-10 left-1/3 w-60 h-60 rounded-full pointer-events-none opacity-10"
          style={{
            background:
              "radial-gradient(circle, oklch(0.68 0.23 290) 0%, transparent 70%)",
          }}
        />
        <div className="container mx-auto max-w-6xl px-4 py-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="font-display font-bold text-3xl text-foreground tracking-tight">
                My Profile
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Manage your account, preferences, and activity
              </p>
            </div>
            {/* Desktop theme toggle in header */}
            <button
              type="button"
              onClick={toggleTheme}
              data-ocid="profile.header_theme_toggle"
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-smooth"
              style={{
                background: "oklch(0.2 0.02 260 / 0.4)",
                border: "1px solid oklch(0.28 0.04 270 / 0.2)",
              }}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-primary" />
              )}
              {isDark ? "Light Mode" : "Dark Mode"}
            </button>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Profile header card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <ProfileHeader profile={profile} onPhotoChange={handlePhotoChange} />
        </motion.div>

        {/* Main layout: sidebar + content */}
        <div className="flex gap-6 items-start">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SidebarNav
              active={activeSection}
              onChange={setActiveSection}
              isDark={isDark}
              toggleTheme={toggleTheme}
            />
          </motion.div>

          {/* Content area */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex-1 min-w-0"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {activeSection === "profile" && (
                  <div className="space-y-6">
                    <EditProfileSection profile={profile} onSave={handleSave} />
                    <NewVolunteersSection />
                  </div>
                )}
                {activeSection === "activity" && (
                  <ActivitySection userId={MOCK_USER_ID} />
                )}
                {activeSection === "tasks" && (
                  <CompletedTasksSection userId={MOCK_USER_ID} />
                )}
                {activeSection === "saved" && (
                  <SavedRequestsSection userId={MOCK_USER_ID} />
                )}
                {activeSection === "notifications" && (
                  <EditProfileSection
                    profile={profile}
                    onSave={handleSave}
                    notificationsOnly
                  />
                )}
                {activeSection === "security" && (
                  <SecuritySection
                    profile={profile}
                    isDark={isDark}
                    toggleTheme={toggleTheme}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav active={activeSection} onChange={setActiveSection} />
    </div>
  );
}
