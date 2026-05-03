import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRegisterNGO, useRegisterVolunteer } from "@/hooks/useAidLink";
import {
  AIDLINK_REMEMBER_KEY,
  AIDLINK_USER_KEY,
  type StoredUser,
  useLocalStorageState,
} from "@/hooks/useLocalStorage";
import { useNavigate } from "@tanstack/react-router";
import {
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  Sparkles,
  User,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ─── Floating background decoration ──────────────────────────────────────────
function BackgroundOrbs() {
  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle at center, rgba(104,174,255,0.6), transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute top-1/2 -right-40 w-[420px] h-[420px] rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(circle at center, rgba(168,85,247,0.6), transparent 70%)",
          filter: "blur(60px)",
          transform: "translateY(-50%)",
        }}
      />
      <div
        className="absolute -bottom-24 left-1/3 w-[360px] h-[360px] rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(circle at center, rgba(112,204,255,0.5), transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(104,174,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(104,174,255,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}

// ─── Shared input wrapper with icon ──────────────────────────────────────────
interface FieldProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}
function Field({ id, label, icon, error, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={id}
        className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
      >
        {label}
      </Label>
      <div className="relative group">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200 z-10">
          {icon}
        </span>
        {children}
      </div>
      {error && (
        <p className="text-xs text-destructive" data-ocid={`${id}.field_error`}>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Tab toggle bar ───────────────────────────────────────────────────────────
type AuthTab = "login" | "signup";
function TabBar({
  active,
  onChange,
}: {
  active: AuthTab;
  onChange: (t: AuthTab) => void;
}) {
  return (
    <div
      className="relative flex rounded-xl p-1 mb-7"
      style={{ background: "rgba(255,255,255,0.05)" }}
    >
      {/* Animated slider */}
      <div
        className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg transition-all duration-300 ease-out"
        style={{
          background: "var(--gradient-primary)",
          boxShadow: "0 0 16px rgba(104,174,255,0.35)",
          left: active === "login" ? "4px" : "calc(50%)",
        }}
      />
      {(["login", "signup"] as AuthTab[]).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          data-ocid={`auth.${t}.tab`}
          className={`relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${
            active === t
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t === "login" ? "Sign In" : "Create Account"}
        </button>
      ))}
    </div>
  );
}

// ─── Role selector (NGO / Volunteer) ─────────────────────────────────────────
type Role = "ngo" | "volunteer";
function RoleSelector({
  value,
  onChange,
}: {
  value: Role;
  onChange: (r: Role) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-5">
      {(["ngo", "volunteer"] as Role[]).map((role) => {
        const isActive = value === role;
        return (
          <button
            key={role}
            type="button"
            onClick={() => onChange(role)}
            data-ocid={`auth.role.${role}`}
            className="relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200"
            style={{
              background: isActive
                ? "rgba(104,174,255,0.12)"
                : "rgba(255,255,255,0.04)",
              borderColor: isActive
                ? "rgba(104,174,255,0.5)"
                : "rgba(255,255,255,0.1)",
              boxShadow: isActive ? "0 0 16px rgba(104,174,255,0.2)" : "none",
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200"
              style={{
                background: isActive
                  ? "var(--gradient-primary)"
                  : "rgba(255,255,255,0.06)",
                boxShadow: isActive ? "0 0 12px rgba(104,174,255,0.4)" : "none",
              }}
            >
              {role === "ngo" ? (
                <Building2 className="w-5 h-5 text-primary-foreground" />
              ) : (
                <Users className="w-5 h-5 text-primary-foreground" />
              )}
            </div>
            <span
              className={`text-sm font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`}
            >
              {role === "ngo" ? "NGO Organization" : "Volunteer"}
            </span>
            {isActive && (
              <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Welcome back banner ──────────────────────────────────────────────────────
function WelcomeBackBanner({ name }: { name: string }) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3 mb-5"
      style={{
        background: "rgba(104,174,255,0.08)",
        border: "1px solid rgba(104,174,255,0.25)",
        boxShadow: "0 0 12px rgba(104,174,255,0.1)",
      }}
      data-ocid="auth.welcome_back.banner"
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: "var(--gradient-primary)" }}
      >
        <Sparkles className="w-4 h-4 text-primary-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">
          Welcome back, {name}!
        </p>
        <p className="text-xs text-muted-foreground">
          Your email has been pre-filled for you.
        </p>
      </div>
    </div>
  );
}

// ─── Login form ───────────────────────────────────────────────────────────────
function LoginForm() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess] = useState(false);

  // Persistent remember-me preference
  const [rememberMe, setRememberMe, clearRemember] =
    useLocalStorageState<boolean>(AIDLINK_REMEMBER_KEY, false);

  // Stored user (for welcome-back pre-fill)
  const [storedUser, setStoredUser, clearStoredUser] =
    useLocalStorageState<StoredUser | null>(AIDLINK_USER_KEY, null);

  const [form, setForm] = useState({
    email: rememberMe && storedUser ? storedUser.email : "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validate = () => {
    const e: typeof errors = {};
    if (!form.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    // Derive name from email prefix as a friendly fallback
    const name = storedUser?.name ?? form.email.split("@")[0];
    const user: StoredUser = {
      email: form.email,
      role: "ngo", // Login doesn't know the role yet — defaults to ngo; dashboard can update
      name,
      loggedInAt: new Date().toISOString(),
    };
    setStoredUser(user);

    setSuccess(true);
    toast.success("Welcome back! Redirecting to dashboard...");
    setTimeout(() => {
      navigate({ to: "/ngo" });
    }, 1200);
  };

  const handleRememberChange = (checked: boolean) => {
    if (checked) {
      setRememberMe(true);
    } else {
      setRememberMe(false);
      clearStoredUser();
    }
  };

  if (success) {
    return (
      <div
        className="flex flex-col items-center gap-4 py-10"
        data-ocid="auth.login.success_state"
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "0 0 24px rgba(104,174,255,0.5)",
          }}
        >
          <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
        </div>
        <p className="font-display font-bold text-xl text-foreground">
          Welcome!
        </p>
        <p className="text-muted-foreground text-sm">
          Redirecting to your dashboard…
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      data-ocid="auth.login.form"
      noValidate
    >
      {/* Welcome-back greeting — shown when remember-me was set and user data exists */}
      {rememberMe && storedUser && <WelcomeBackBanner name={storedUser.name} />}

      <Field
        id="login-email"
        label="Email Address"
        icon={<Mail className="w-4 h-4" />}
        error={errors.email}
      >
        <Input
          id="login-email"
          type="email"
          placeholder="you@organization.org"
          value={form.email}
          onBlur={() => {
            const e = validate();
            setErrors((p) => ({ ...p, email: e.email }));
          }}
          onChange={(e) => {
            setForm((p) => ({ ...p, email: e.target.value }));
            if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
          }}
          className="pl-10 h-12 rounded-xl border-white/10 bg-white/5 focus-visible:ring-primary/60 focus-visible:border-primary/50 text-foreground placeholder:text-muted-foreground/50"
          data-ocid="auth.login.email.input"
          required
        />
      </Field>

      <Field
        id="login-password"
        label="Password"
        icon={<Lock className="w-4 h-4" />}
        error={errors.password}
      >
        <Input
          id="login-password"
          type={showPass ? "text" : "password"}
          placeholder="••••••••"
          value={form.password}
          onBlur={() => {
            const e = validate();
            setErrors((p) => ({ ...p, password: e.password }));
          }}
          onChange={(e) => {
            setForm((p) => ({ ...p, password: e.target.value }));
            if (errors.password)
              setErrors((p) => ({ ...p, password: undefined }));
          }}
          className="pl-10 pr-12 h-12 rounded-xl border-white/10 bg-white/5 focus-visible:ring-primary/60 focus-visible:border-primary/50 text-foreground placeholder:text-muted-foreground/50"
          data-ocid="auth.login.password.input"
          required
        />
        <button
          type="button"
          onClick={() => setShowPass((v) => !v)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
          aria-label={showPass ? "Hide password" : "Show password"}
        >
          {showPass ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </Field>

      <div className="flex items-center justify-between">
        <label
          htmlFor="login-remember"
          className="flex items-center gap-2 cursor-pointer group"
        >
          <input
            id="login-remember"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => handleRememberChange(e.target.checked)}
            data-ocid="auth.login.remember_me.checkbox"
            className="sr-only"
          />
          <div
            aria-hidden="true"
            className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
              rememberMe
                ? "border-primary bg-primary/30"
                : "border-white/20 bg-white/5"
            }`}
          >
            {rememberMe && (
              <svg
                viewBox="0 0 10 8"
                className="w-2.5 h-2.5 text-primary"
                fill="none"
                aria-hidden="true"
              >
                <title>checked</title>
                <path
                  d="M1 4l3 3 5-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
          <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
            Remember me
          </span>
        </label>
        <button
          type="button"
          className="text-xs text-primary hover:text-primary/80 transition-colors duration-200"
          data-ocid="auth.login.forgot_password"
        >
          Forgot password?
        </button>
      </div>

      <Button
        type="submit"
        className="w-full h-12 rounded-xl gradient-primary text-primary-foreground border-0 font-semibold text-sm glow-primary hover:opacity-90 transition-smooth"
        data-ocid="auth.login.submit_button"
      >
        Sign In to AidLink
      </Button>

      {/* Sign out link — clears persisted session */}
      {storedUser && (
        <button
          type="button"
          onClick={() => {
            clearStoredUser();
            clearRemember();
            setForm({ email: "", password: "" });
            toast.success("Signed out successfully.");
          }}
          className="w-full text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors duration-200 pt-1"
          data-ocid="auth.login.sign_out_button"
        >
          Not {storedUser.name}? Sign out
        </button>
      )}

      <p className="text-center text-xs text-muted-foreground">
        Uses <span className="text-primary/80">Internet Identity</span> for
        secure, decentralized authentication.
      </p>
    </form>
  );
}

// ─── Sign Up form ─────────────────────────────────────────────────────────────
function SignUpForm() {
  const navigate = useNavigate();
  const { mutateAsync: registerNGO, isPending: ngoLoading } = useRegisterNGO();
  const { mutateAsync: registerVolunteer, isPending: volLoading } =
    useRegisterVolunteer();

  const [role, setRole] = useState<Role>("ngo");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    location: "",
    skills: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  // Persist user on successful registration
  const [, setStoredUser] = useLocalStorageState<StoredUser | null>(
    AIDLINK_USER_KEY,
    null,
  );
  const [, setRememberMe] = useLocalStorageState<boolean>(
    AIDLINK_REMEMBER_KEY,
    false,
  );

  const set =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((p) => ({ ...p, [k]: e.target.value }));
      if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
    };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8)
      e.password = "At least 8 characters required";
    if (!form.confirm) e.confirm = "Please confirm your password";
    else if (form.confirm !== form.password)
      e.confirm = "Passwords do not match";
    if (!form.location.trim()) e.location = "Location is required";
    if (role === "volunteer" && !form.skills.trim())
      e.skills = "Please list at least one skill";
    if (role === "ngo" && !form.description.trim())
      e.description = "Description is required";
    return e;
  };

  const isPending = ngoLoading || volLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      const coords = { lat: 51.5074, lng: -0.1278 };
      if (role === "ngo") {
        await registerNGO({
          name: form.name,
          description: form.description,
          contactEmail: form.email,
          ...coords,
        });
        // Persist user session
        setStoredUser({
          email: form.email,
          role: "ngo",
          name: form.name,
          loggedInAt: new Date().toISOString(),
        });
        setRememberMe(true);
        toast.success("NGO registered successfully! Welcome to AidLink.");
        setSuccess(true);
        setTimeout(() => navigate({ to: "/ngo" }), 1300);
      } else {
        await registerVolunteer({
          name: form.name,
          skills: form.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          ...coords,
        });
        // Persist user session
        setStoredUser({
          email: form.email,
          role: "volunteer",
          name: form.name,
          loggedInAt: new Date().toISOString(),
        });
        setRememberMe(true);
        toast.success("Volunteer profile created! Welcome to AidLink.");
        setSuccess(true);
        setTimeout(() => navigate({ to: "/volunteer" }), 1300);
      }
    } catch (err: unknown) {
      const raw =
        err instanceof Error
          ? err.message
          : typeof err === "string"
            ? err
            : "Registration failed. Please try again.";
      // Extract meaningful message from canister trap text if present
      const match = raw.match(/(?:Canister called|Error:\s*)(.+?)(?:\s*\(|$)/i);
      const msg = match?.[1]?.trim() ?? raw;
      const isKnown =
        msg.toLowerCase().includes("already registered") ||
        msg.toLowerCase().includes("duplicate") ||
        msg.toLowerCase().includes("already exists");
      toast.error(
        isKnown
          ? `That ${role === "ngo" ? "organization name or email" : "name"} is already registered. Try a different one.`
          : msg.length < 200
            ? msg
            : "Registration failed. Please try again.",
      );
    }
  };

  if (success) {
    return (
      <div
        className="flex flex-col items-center gap-4 py-10"
        data-ocid="auth.signup.success_state"
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "0 0 24px rgba(104,174,255,0.5)",
          }}
        >
          <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
        </div>
        <p className="font-display font-bold text-xl text-foreground">
          Welcome to AidLink!
        </p>
        <p className="text-muted-foreground text-sm">
          Setting up your dashboard…
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      data-ocid="auth.signup.form"
      noValidate
    >
      <RoleSelector value={role} onChange={setRole} />

      <Field
        id="signup-name"
        label={role === "ngo" ? "Organization Name" : "Full Name"}
        icon={<User className="w-4 h-4" />}
        error={errors.name}
      >
        <Input
          id="signup-name"
          placeholder={
            role === "ngo"
              ? "e.g. Global Relief Foundation"
              : "e.g. Sarah Johnson"
          }
          value={form.name}
          onChange={set("name")}
          className="pl-10 h-12 rounded-xl border-white/10 bg-white/5 focus-visible:ring-primary/60 focus-visible:border-primary/50 text-foreground placeholder:text-muted-foreground/50"
          data-ocid="auth.signup.name.input"
          required
        />
      </Field>

      <Field
        id="signup-email"
        label="Email Address"
        icon={<Mail className="w-4 h-4" />}
        error={errors.email}
      >
        <Input
          id="signup-email"
          type="email"
          placeholder="contact@organization.org"
          value={form.email}
          onChange={set("email")}
          className="pl-10 h-12 rounded-xl border-white/10 bg-white/5 focus-visible:ring-primary/60 focus-visible:border-primary/50 text-foreground placeholder:text-muted-foreground/50"
          data-ocid="auth.signup.email.input"
          required
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field
          id="signup-password"
          label="Password"
          icon={<Lock className="w-4 h-4" />}
          error={errors.password}
        >
          <Input
            id="signup-password"
            type={showPass ? "text" : "password"}
            placeholder="••••••••"
            value={form.password}
            onChange={set("password")}
            className="pl-10 pr-10 h-12 rounded-xl border-white/10 bg-white/5 focus-visible:ring-primary/60 focus-visible:border-primary/50 text-foreground placeholder:text-muted-foreground/50"
            data-ocid="auth.signup.password.input"
            required
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPass ? "Hide password" : "Show password"}
          >
            {showPass ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
          </button>
        </Field>

        <Field
          id="signup-confirm"
          label="Confirm"
          icon={<Lock className="w-4 h-4" />}
          error={errors.confirm}
        >
          <Input
            id="signup-confirm"
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            value={form.confirm}
            onChange={set("confirm")}
            className="pl-10 pr-10 h-12 rounded-xl border-white/10 bg-white/5 focus-visible:ring-primary/60 focus-visible:border-primary/50 text-foreground placeholder:text-muted-foreground/50"
            data-ocid="auth.signup.confirm.input"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
          </button>
        </Field>
      </div>

      <Field
        id="signup-location"
        label="City / Location"
        icon={<MapPin className="w-4 h-4" />}
        error={errors.location}
      >
        <Input
          id="signup-location"
          placeholder="e.g. London, UK"
          value={form.location}
          onChange={set("location")}
          className="pl-10 h-12 rounded-xl border-white/10 bg-white/5 focus-visible:ring-primary/60 focus-visible:border-primary/50 text-foreground placeholder:text-muted-foreground/50"
          data-ocid="auth.signup.location.input"
          required
        />
      </Field>

      {role === "ngo" && (
        <div className="space-y-1.5">
          <Label
            htmlFor="signup-description"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            Organization Description
          </Label>
          <Textarea
            id="signup-description"
            placeholder="Brief description of your NGO's mission and activities…"
            value={form.description}
            onChange={set("description")}
            rows={3}
            className="rounded-xl border-white/10 bg-white/5 focus-visible:ring-primary/60 focus-visible:border-primary/50 text-foreground placeholder:text-muted-foreground/50 resize-none"
            data-ocid="auth.signup.description.textarea"
          />
          {errors.description && (
            <p
              className="text-xs text-destructive"
              data-ocid="auth.signup.description.field_error"
            >
              {errors.description}
            </p>
          )}
        </div>
      )}

      {role === "volunteer" && (
        <div className="space-y-1.5">
          <Label
            htmlFor="signup-skills"
            className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
          >
            Skills{" "}
            <span className="text-muted-foreground/50 normal-case">
              (comma-separated)
            </span>
          </Label>
          <Textarea
            id="signup-skills"
            placeholder="e.g. Medical First Aid, Logistics, Swahili, Teaching…"
            value={form.skills}
            onChange={set("skills")}
            rows={2}
            className="rounded-xl border-white/10 bg-white/5 focus-visible:ring-primary/60 focus-visible:border-primary/50 text-foreground placeholder:text-muted-foreground/50 resize-none"
            data-ocid="auth.signup.skills.textarea"
          />
          {errors.skills && (
            <p
              className="text-xs text-destructive"
              data-ocid="auth.signup.skills.field_error"
            >
              {errors.skills}
            </p>
          )}
        </div>
      )}

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-12 rounded-xl gradient-primary text-primary-foreground border-0 font-semibold text-sm glow-primary hover:opacity-90 transition-smooth mt-2"
        data-ocid="auth.signup.submit_button"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
            Creating account…
          </span>
        ) : (
          `Create ${role === "ngo" ? "NGO Account" : "Volunteer Profile"}`
        )}
      </Button>
    </form>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function AuthPage() {
  const [tab, setTab] = useState<AuthTab>("login");

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16 relative"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.08 0.02 260) 0%, oklch(0.1 0.04 270) 40%, oklch(0.12 0.06 280) 100%)",
      }}
      data-ocid="auth.page"
    >
      <BackgroundOrbs />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2.5 mb-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: "var(--gradient-primary)",
                boxShadow: "0 0 20px rgba(104,174,255,0.5)",
              }}
            >
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-foreground">
              Aid<span className="text-primary">Link</span>
            </span>
          </a>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Smart Resource Allocation · Join the network.
          </p>
        </div>

        {/* Auth card */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
          data-ocid="auth.card"
        >
          {/* Tab toggle */}
          <TabBar active={tab} onChange={setTab} />

          {/* Form header */}
          {tab === "login" ? (
            <div className="mb-6">
              <h1 className="font-display font-bold text-2xl text-foreground leading-tight">
                Welcome back
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Sign in to your AidLink account
              </p>
            </div>
          ) : (
            <div className="mb-5">
              <h1 className="font-display font-bold text-2xl text-foreground leading-tight">
                Join AidLink
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Create your account and start making an impact
              </p>
            </div>
          )}

          {/* Animated form transition */}
          <div
            key={tab}
            style={{
              animation: "fadeSlideIn 0.25s ease-out",
            }}
          >
            {tab === "login" ? <LoginForm /> : <SignUpForm />}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground/60 mt-6">
          By joining, you agree to AidLink's{" "}
          <span className="text-primary/70 cursor-pointer hover:text-primary transition-colors">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="text-primary/70 cursor-pointer hover:text-primary transition-colors">
            Privacy Policy
          </span>
          .
        </p>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
