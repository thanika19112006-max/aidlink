import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  stringToResourceType,
  stringToUrgency,
  useCreateRequest,
  useNGOs,
} from "@/hooks/useAidLink";
import { ResourceType, Urgency } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Droplets,
  Heart,
  Home,
  MapPin,
  Minus,
  Package,
  Plus,
  Send,
  Utensils,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Data ────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Resource Details" },
  { id: 3, label: "Location & Timeline" },
];

interface UrgencyOption {
  value: string;
  label: string;
  description: string;
  colorClass: string;
  borderActive: string;
  bgActive: string;
  glowStyle: string;
  icon: string;
}

const URGENCY_OPTIONS: UrgencyOption[] = [
  {
    value: Urgency.low,
    label: "Low",
    description: "No immediate deadline",
    colorClass: "text-emerald-400",
    borderActive: "border-emerald-500",
    bgActive: "bg-emerald-500/10",
    glowStyle: "0 0 20px rgba(52, 211, 153, 0.45)",
    icon: "🟢",
  },
  {
    value: Urgency.medium,
    label: "Medium",
    description: "Within a week",
    colorClass: "text-yellow-400",
    borderActive: "border-yellow-500",
    bgActive: "bg-yellow-500/10",
    glowStyle: "0 0 20px rgba(234, 179, 8, 0.45)",
    icon: "🟡",
  },
  {
    value: Urgency.high,
    label: "High",
    description: "Within 24–48 hours",
    colorClass: "text-orange-400",
    borderActive: "border-orange-500",
    bgActive: "bg-orange-500/10",
    glowStyle: "0 0 20px rgba(249, 115, 22, 0.45)",
    icon: "🟠",
  },
  {
    value: Urgency.critical,
    label: "Critical",
    description: "Immediate need",
    colorClass: "text-red-400",
    borderActive: "border-red-500",
    bgActive: "bg-red-500/10",
    glowStyle: "0 0 20px rgba(239, 68, 68, 0.5)",
    icon: "🔴",
  },
];

interface ResourceOption {
  value: string;
  label: string;
  unit: string;
  borderActive: string;
  bgActive: string;
  iconColor: string;
}

const RESOURCE_OPTIONS: ResourceOption[] = [
  {
    value: ResourceType.food,
    label: "Food",
    unit: "kg",
    borderActive: "border-orange-500",
    bgActive: "bg-orange-500/10",
    iconColor: "text-orange-400",
  },
  {
    value: ResourceType.shelter,
    label: "Shelter",
    unit: "beds",
    borderActive: "border-sky-500",
    bgActive: "bg-sky-500/10",
    iconColor: "text-sky-400",
  },
  {
    value: ResourceType.medical,
    label: "Medical",
    unit: "kits",
    borderActive: "border-rose-500",
    bgActive: "bg-rose-500/10",
    iconColor: "text-rose-400",
  },
  {
    value: ResourceType.education,
    label: "Education",
    unit: "sets",
    borderActive: "border-violet-500",
    bgActive: "bg-violet-500/10",
    iconColor: "text-violet-400",
  },
  {
    value: "water",
    label: "Water",
    unit: "liters",
    borderActive: "border-cyan-500",
    bgActive: "bg-cyan-500/10",
    iconColor: "text-cyan-400",
  },
  {
    value: ResourceType.other,
    label: "Other",
    unit: "units",
    borderActive: "border-slate-400",
    bgActive: "bg-slate-400/10",
    iconColor: "text-muted-foreground",
  },
];

function ResourceIcon({
  type,
  className,
}: {
  type: string;
  className?: string;
}) {
  const props = { className: className ?? "w-6 h-6" };
  if (type === ResourceType.food) return <Utensils {...props} />;
  if (type === ResourceType.shelter) return <Home {...props} />;
  if (type === ResourceType.medical) return <Heart {...props} />;
  if (type === ResourceType.education) return <BookOpen {...props} />;
  if (type === "water") return <Droplets {...props} />;
  return <Package {...props} />;
}

// ─── Step animation ──────────────────────────────────────────────────────────

function useStepTransition(step: number) {
  const [display, setDisplay] = useState(step);
  const [animClass, setAnimClass] = useState("opacity-100 translate-x-0");
  const prev = useRef(step);

  useEffect(() => {
    if (step === display) return;
    const direction = step > prev.current ? 1 : -1;
    setAnimClass(
      `opacity-0 ${direction > 0 ? "-translate-x-6" : "translate-x-6"}`,
    );
    const t1 = setTimeout(() => {
      setDisplay(step);
      setAnimClass(
        `opacity-0 ${direction > 0 ? "translate-x-6" : "-translate-x-6"}`,
      );
      const t2 = setTimeout(
        () => setAnimClass("opacity-100 translate-x-0"),
        30,
      );
      return () => clearTimeout(t2);
    }, 220);
    prev.current = step;
    return () => clearTimeout(t1);
  }, [step, display]);

  return { display, animClass };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  const pct = ((step - 1) / (STEPS.length - 1)) * 100;
  return (
    <div className="mb-8" data-ocid="request.progress">
      <div className="flex items-center justify-between mb-4">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300"
                style={{
                  background:
                    step >= s.id
                      ? "linear-gradient(135deg, oklch(0.65 0.24 262), oklch(0.68 0.23 290))"
                      : "rgba(255,255,255,0.06)",
                  border:
                    step >= s.id
                      ? "1px solid oklch(0.72 0.27 262 / 0.6)"
                      : "1px solid rgba(255,255,255,0.12)",
                  boxShadow:
                    step >= s.id ? "0 0 16px rgba(104,174,255,0.5)" : "none",
                  color: step >= s.id ? "#fff" : "oklch(0.65 0.02 260)",
                }}
              >
                {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
              </div>
              <span
                className="text-xs font-medium hidden sm:block transition-colors duration-200"
                style={{
                  color:
                    step >= s.id
                      ? "oklch(0.85 0.1 262)"
                      : "oklch(0.55 0.02 260)",
                }}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="flex-1 h-px mx-2 relative overflow-hidden rounded-full"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="absolute inset-y-0 left-0 transition-all duration-500"
                  style={{
                    width: step > s.id ? "100%" : "0%",
                    background:
                      "linear-gradient(90deg, oklch(0.65 0.24 262), oklch(0.68 0.23 290))",
                    boxShadow: "0 0 8px rgba(104,174,255,0.6)",
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Global progress bar */}
      <div
        className="w-full h-1 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            background:
              "linear-gradient(90deg, oklch(0.65 0.24 262), oklch(0.68 0.23 290), oklch(0.75 0.25 270))",
            boxShadow: "0 0 10px rgba(104,174,255,0.6)",
          }}
        />
      </div>
    </div>
  );
}

// ─── Form state ──────────────────────────────────────────────────────────────

interface FormState {
  title: string;
  description: string;
  ngoId: string;
  urgency: string;
  resourceType: string;
  quantity: number;
  unit: string;
  notes: string;
  address: string;
  city: string;
  lat: string;
  lng: string;
  deadline: string;
}

const INITIAL: FormState = {
  title: "",
  description: "",
  ngoId: "",
  urgency: "",
  resourceType: "",
  quantity: 1,
  unit: "",
  notes: "",
  address: "",
  city: "",
  lat: "51.5074",
  lng: "-0.1278",
  deadline: "",
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

// ─── Main component ──────────────────────────────────────────────────────────

export function RequestFormPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const { mutateAsync: createRequest, isPending } = useCreateRequest();
  const { data: ngos = [] } = useNGOs();
  const { display: displayStep, animClass } = useStepTransition(step);

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((p) => ({ ...p, [key]: val }));

  const clearError = (key: keyof FormState) =>
    setErrors((p) => {
      const n = { ...p };
      delete n[key];
      return n;
    });

  function validateStep(s: number): FieldErrors {
    const e: FieldErrors = {};
    if (s === 1) {
      if (!form.title.trim()) e.title = "Title is required";
      if (!form.description.trim()) e.description = "Description is required";
      if (!form.ngoId) e.ngoId = "Please select an organization";
      if (!form.urgency) e.urgency = "Please select an urgency level";
    }
    if (s === 2) {
      if (!form.resourceType) e.resourceType = "Please select a resource type";
      if (form.quantity < 1) e.quantity = "Quantity must be at least 1";
    }
    if (s === 3) {
      if (!form.address.trim()) e.address = "Address is required";
      if (!form.city.trim()) e.city = "City is required";
    }
    return e;
  }

  function nextStep() {
    const e = validateStep(step);
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, 3));
  }

  function prevStep() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit() {
    const e = validateStep(3);
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    try {
      const deadlineTs = form.deadline
        ? BigInt(new Date(form.deadline).getTime()) * BigInt(1_000_000)
        : BigInt(Date.now() + 7 * 24 * 60 * 60 * 1000) * BigInt(1_000_000);

      const effectiveResourceType =
        form.resourceType === "water" ? ResourceType.other : form.resourceType;

      await createRequest({
        title: form.title,
        description: `${form.description}${form.notes ? `\n\nAdditional notes: ${form.notes}` : ""}`,
        resourceType: stringToResourceType(effectiveResourceType),
        urgency: stringToUrgency(form.urgency),
        quantity: BigInt(form.quantity),
        deadline: deadlineTs,
        ngoId: BigInt(form.ngoId),
        lat: Number.parseFloat(form.lat) || 51.5074,
        lng: Number.parseFloat(form.lng) || -0.1278,
      });

      setSubmitted(true);
      toast.success("Request submitted successfully!");
    } catch {
      toast.error("Failed to submit. Please try again.");
    }
  }

  // ─── Success screen ────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center py-20 px-4"
        style={{ background: "var(--gradient-hero)" }}
        data-ocid="request.success.section"
      >
        <div
          className="rounded-3xl p-12 max-w-md w-full text-center"
          style={{
            background: "rgba(16,20,40,0.7)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(52,211,153,0.25)",
            boxShadow:
              "0 0 32px rgba(52,211,153,0.15), 0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{
              background: "rgba(52,211,153,0.15)",
              boxShadow: "0 0 24px rgba(52,211,153,0.3)",
            }}
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="font-display font-bold text-3xl text-foreground mb-3">
            Request Submitted!
          </h2>
          <p className="text-muted-foreground mb-2 text-base">
            Your resource request{" "}
            <span className="text-foreground font-medium">"{form.title}"</span>{" "}
            has been submitted.
          </p>
          <p className="text-muted-foreground text-sm mb-8">
            Our AI will match you with the best available volunteers shortly.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setForm(INITIAL);
                setStep(1);
              }}
              className="w-full h-11 font-semibold border-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.65 0.24 262), oklch(0.68 0.23 290))",
                boxShadow: "0 0 20px rgba(104,174,255,0.4)",
              }}
              data-ocid="request.success.new_request.button"
            >
              Submit Another Request
            </Button>
            <Link to="/ngo">
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-border"
                data-ocid="request.success.dashboard.button"
              >
                View NGO Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Summary card ──────────────────────────────────────────────────────────

  const selectedNGO = ngos.find((n) => n.id.toString() === form.ngoId);
  const selectedUrgency = URGENCY_OPTIONS.find((u) => u.value === form.urgency);
  const selectedResource = RESOURCE_OPTIONS.find(
    (r) => r.value === form.resourceType,
  );

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen py-16 px-4"
      style={{ background: "var(--gradient-hero)" }}
      data-ocid="request.page"
    >
      {/* Background orbs */}
      <div
        className="fixed inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.65 0.24 262 / 0.12), transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.75 0.25 290 / 0.1), transparent 70%)",
            filter: "blur(50px)",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{
              background: "rgba(104,174,255,0.1)",
              border: "1px solid rgba(104,174,255,0.25)",
              color: "oklch(0.72 0.27 262)",
            }}
          >
            <Zap className="w-3.5 h-3.5" />
            Resource Request
          </div>
          <h1
            className="font-display font-bold text-4xl md:text-5xl mb-3"
            style={{
              background:
                "linear-gradient(135deg, #fff 30%, oklch(0.75 0.25 270))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Create Resource Request
          </h1>
          <p className="text-muted-foreground text-lg">
            Our AI matches your request with the best available volunteers
          </p>
        </div>

        {/* Form card */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: "rgba(12,16,36,0.7)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow:
              "0 8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
          data-ocid="request.form"
        >
          <ProgressBar step={step} />

          {/* Animated step container */}
          <div className={`transition-all duration-200 ease-out ${animClass}`}>
            {displayStep === 1 && (
              <Step1
                form={form}
                errors={errors}
                ngos={ngos}
                set={set}
                clearError={clearError}
              />
            )}
            {displayStep === 2 && (
              <Step2
                form={form}
                errors={errors}
                set={set}
                clearError={clearError}
              />
            )}
            {displayStep === 3 && (
              <Step3
                form={form}
                errors={errors}
                selectedNGO={selectedNGO}
                selectedUrgency={selectedUrgency}
                selectedResource={selectedResource}
                set={set}
                clearError={clearError}
              />
            )}
          </div>

          {/* Navigation buttons */}
          <div
            className="flex items-center justify-between mt-8 pt-6"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
              className="gap-2 border-border"
              data-ocid="request.back.button"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            <div className="flex items-center gap-2">
              {STEPS.map((s) => (
                <div
                  key={s.id}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    background:
                      step >= s.id
                        ? "linear-gradient(135deg, oklch(0.65 0.24 262), oklch(0.68 0.23 290))"
                        : "rgba(255,255,255,0.15)",
                    transform: step === s.id ? "scale(1.3)" : "scale(1)",
                  }}
                />
              ))}
            </div>

            {step < 3 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="gap-2 border-0 font-semibold"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.65 0.24 262), oklch(0.68 0.23 290))",
                  boxShadow: "0 0 16px rgba(104,174,255,0.35)",
                }}
                data-ocid="request.next.button"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => toast.info("Draft saved!")}
                  className="border-border"
                  data-ocid="request.save_draft.button"
                >
                  Save Draft
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="gap-2 border-0 font-semibold"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.65 0.24 262), oklch(0.68 0.23 290))",
                    boxShadow: "0 0 20px rgba(104,174,255,0.4)",
                  }}
                  data-ocid="request.submit_button"
                >
                  {isPending ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Request
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer nav */}
        <div className="flex justify-center gap-8 mt-8 text-sm text-muted-foreground">
          <Link
            to="/ngo"
            className="hover:text-foreground transition-colors"
            data-ocid="request.ngo_dashboard.link"
          >
            ← NGO Dashboard
          </Link>
          <Link
            to="/map"
            className="hover:text-foreground transition-colors"
            data-ocid="request.map.link"
          >
            View Impact Map →
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Step 1 ──────────────────────────────────────────────────────────────────

interface NGOItem {
  id: bigint;
  name: string;
  isVerified: boolean;
}

function Step1({
  form,
  errors,
  ngos,
  set,
  clearError,
}: {
  form: FormState;
  errors: FieldErrors;
  ngos: NGOItem[];
  set: <K extends keyof FormState>(key: K, val: FormState[K]) => void;
  clearError: (key: keyof FormState) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-semibold text-xl text-foreground mb-1">
          Basic Information
        </h2>
        <p className="text-muted-foreground text-sm">
          Tell us about your request
        </p>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label
          htmlFor="req-title"
          className="text-sm font-medium text-muted-foreground"
        >
          Request Title *
        </Label>
        <Input
          id="req-title"
          placeholder="e.g. Emergency food supplies for 200 families"
          value={form.title}
          onChange={(e) => {
            set("title", e.target.value);
            clearError("title");
          }}
          className={`h-11 rounded-xl transition-transform duration-200 focus:scale-[1.01] focus-visible:ring-primary ${errors.title ? "border-red-500" : "border-border"}`}
          style={{ background: "rgba(255,255,255,0.04)" }}
          data-ocid="request.title.input"
        />
        {errors.title && (
          <p
            className="text-xs text-red-400"
            data-ocid="request.title.field_error"
          >
            {errors.title}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label
          htmlFor="req-desc"
          className="text-sm font-medium text-muted-foreground"
        >
          Description *
        </Label>
        <Textarea
          id="req-desc"
          placeholder="Provide detailed information about the request, location specifics, and any special requirements..."
          value={form.description}
          onChange={(e) => {
            set("description", e.target.value);
            clearError("description");
          }}
          rows={4}
          className={`rounded-xl resize-none transition-transform duration-200 focus:scale-[1.01] focus-visible:ring-primary ${errors.description ? "border-red-500" : "border-border"}`}
          style={{ background: "rgba(255,255,255,0.04)" }}
          data-ocid="request.description.textarea"
        />
        {errors.description && (
          <p
            className="text-xs text-red-400"
            data-ocid="request.description.field_error"
          >
            {errors.description}
          </p>
        )}
      </div>

      {/* NGO selector */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Organization *
        </Label>
        <Select
          value={form.ngoId}
          onValueChange={(v) => {
            set("ngoId", v);
            clearError("ngoId");
          }}
        >
          <SelectTrigger
            className={`h-11 rounded-xl ${errors.ngoId ? "border-red-500" : "border-border"}`}
            style={{ background: "rgba(255,255,255,0.04)" }}
            data-ocid="request.ngo.select"
          >
            <SelectValue
              placeholder={
                ngos.length === 0
                  ? "No NGOs registered yet"
                  : "Select your organization..."
              }
            />
          </SelectTrigger>
          <SelectContent>
            {ngos.length === 0 ? (
              <SelectItem value="none" disabled>
                No NGOs available. Register one first.
              </SelectItem>
            ) : (
              ngos.map((ngo) => (
                <SelectItem key={ngo.id.toString()} value={ngo.id.toString()}>
                  {ngo.name}
                  {ngo.isVerified ? " ✓" : ""}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {errors.ngoId && (
          <p
            className="text-xs text-red-400"
            data-ocid="request.ngo.field_error"
          >
            {errors.ngoId}
          </p>
        )}
      </div>

      {/* Urgency cards */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-muted-foreground">
          Urgency Level *
        </Label>
        <div
          className="grid grid-cols-2 gap-3"
          data-ocid="request.urgency.cards"
        >
          {URGENCY_OPTIONS.map((opt) => {
            const isSelected = form.urgency === opt.value;
            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => {
                  set("urgency", opt.value);
                  clearError("urgency");
                }}
                className={`relative p-4 rounded-2xl text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isSelected
                    ? `${opt.bgActive} ${opt.borderActive}`
                    : "border-border"
                }`}
                style={{
                  background: isSelected ? undefined : "rgba(255,255,255,0.03)",
                  border: "1px solid",
                  borderColor: isSelected
                    ? undefined
                    : "rgba(255,255,255,0.08)",
                  boxShadow: isSelected ? opt.glowStyle : "none",
                  transform: isSelected ? "scale(1.02)" : "scale(1)",
                }}
                data-ocid={`request.urgency.${opt.value}.card`}
                aria-pressed={isSelected}
              >
                <span className="text-2xl mb-2 block">{opt.icon}</span>
                <span
                  className={`font-semibold text-sm block mb-0.5 ${isSelected ? opt.colorClass : "text-foreground"}`}
                >
                  {opt.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {opt.description}
                </span>
                {isSelected && (
                  <div
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.65 0.24 262), oklch(0.68 0.23 290))",
                    }}
                  >
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        {errors.urgency && (
          <p
            className="text-xs text-red-400"
            data-ocid="request.urgency.field_error"
          >
            {errors.urgency}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Step 2 ──────────────────────────────────────────────────────────────────

function Step2({
  form,
  errors,
  set,
  clearError,
}: {
  form: FormState;
  errors: FieldErrors;
  set: <K extends keyof FormState>(key: K, val: FormState[K]) => void;
  clearError: (key: keyof FormState) => void;
}) {
  const selectedRes = RESOURCE_OPTIONS.find(
    (r) => r.value === form.resourceType,
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-semibold text-xl text-foreground mb-1">
          Resource Details
        </h2>
        <p className="text-muted-foreground text-sm">
          Specify what resources you need
        </p>
      </div>

      {/* Resource type grid */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-muted-foreground">
          Resource Type *
        </Label>
        <div
          className="grid grid-cols-3 gap-3"
          data-ocid="request.resource_type.cards"
        >
          {RESOURCE_OPTIONS.map((opt) => {
            const isSelected = form.resourceType === opt.value;
            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => {
                  set("resourceType", opt.value);
                  set("unit", opt.unit);
                  clearError("resourceType");
                }}
                className="p-4 rounded-2xl text-center transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary flex flex-col items-center gap-2"
                style={{
                  border: "1px solid",
                  borderColor: isSelected
                    ? undefined
                    : "rgba(255,255,255,0.08)",
                  background: isSelected ? undefined : "rgba(255,255,255,0.03)",
                  transform: isSelected ? "scale(1.03)" : "scale(1)",
                  boxShadow: isSelected
                    ? "0 0 20px rgba(104,174,255,0.25)"
                    : "none",
                }}
                data-ocid={`request.resource.${opt.value}.card`}
                aria-pressed={isSelected}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    isSelected
                      ? `${opt.bgActive} ${opt.iconColor}`
                      : "bg-muted/30 text-muted-foreground"
                  }`}
                >
                  <ResourceIcon type={opt.value} className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs font-medium transition-colors duration-200 ${
                    isSelected ? opt.iconColor : "text-muted-foreground"
                  }`}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
        {errors.resourceType && (
          <p
            className="text-xs text-red-400"
            data-ocid="request.resource_type.field_error"
          >
            {errors.resourceType}
          </p>
        )}
      </div>

      {/* Quantity + unit row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="req-qty"
            className="text-sm font-medium text-muted-foreground"
          >
            Quantity *
          </Label>
          <div
            className="flex items-center h-11 rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${errors.quantity ? "rgb(239,68,68)" : "rgba(255,255,255,0.08)"}`,
            }}
          >
            <button
              type="button"
              className="px-3 h-full text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => {
                set("quantity", Math.max(1, form.quantity - 1));
                clearError("quantity");
              }}
              data-ocid="request.quantity.decrement.button"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              id="req-qty"
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => {
                set(
                  "quantity",
                  Math.max(1, Number.parseInt(e.target.value) || 1),
                );
                clearError("quantity");
              }}
              className="flex-1 h-full text-center bg-transparent text-foreground text-sm focus:outline-none"
              data-ocid="request.quantity.input"
            />
            <button
              type="button"
              className="px-3 h-full text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => {
                set("quantity", form.quantity + 1);
                clearError("quantity");
              }}
              data-ocid="request.quantity.increment.button"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {errors.quantity && (
            <p
              className="text-xs text-red-400"
              data-ocid="request.quantity.field_error"
            >
              {errors.quantity}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="req-unit"
            className="text-sm font-medium text-muted-foreground"
          >
            Unit
          </Label>
          <Input
            id="req-unit"
            placeholder={selectedRes?.unit ?? "e.g. kg, beds, kits"}
            value={form.unit}
            onChange={(e) => set("unit", e.target.value)}
            className="h-11 rounded-xl border-border transition-transform duration-200 focus:scale-[1.01] focus-visible:ring-primary"
            style={{ background: "rgba(255,255,255,0.04)" }}
            data-ocid="request.unit.input"
          />
        </div>
      </div>

      {/* Additional notes */}
      <div className="space-y-2">
        <Label
          htmlFor="req-notes"
          className="text-sm font-medium text-muted-foreground"
        >
          Additional Notes
          <span className="ml-2 text-xs opacity-60">(optional)</span>
        </Label>
        <Textarea
          id="req-notes"
          placeholder="Any special requirements, brand preferences, or additional context..."
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          rows={3}
          className="rounded-xl resize-none border-border transition-transform duration-200 focus:scale-[1.01] focus-visible:ring-primary"
          style={{ background: "rgba(255,255,255,0.04)" }}
          data-ocid="request.notes.textarea"
        />
      </div>
    </div>
  );
}

// ─── Step 3 ──────────────────────────────────────────────────────────────────

function Step3({
  form,
  errors,
  selectedNGO,
  selectedUrgency,
  selectedResource,
  set,
  clearError,
}: {
  form: FormState;
  errors: FieldErrors;
  selectedNGO: NGOItem | undefined;
  selectedUrgency: UrgencyOption | undefined;
  selectedResource: ResourceOption | undefined;
  set: <K extends keyof FormState>(key: K, val: FormState[K]) => void;
  clearError: (key: keyof FormState) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-semibold text-xl text-foreground mb-1">
          Location &amp; Timeline
        </h2>
        <p className="text-muted-foreground text-sm">
          Where and when is this resource needed?
        </p>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label
          htmlFor="req-address"
          className="text-sm font-medium text-muted-foreground flex items-center gap-1.5"
        >
          <MapPin className="w-3.5 h-3.5" />
          Street Address *
        </Label>
        <Input
          id="req-address"
          placeholder="e.g. 123 Aid Street, Block C"
          value={form.address}
          onChange={(e) => {
            set("address", e.target.value);
            clearError("address");
          }}
          className={`h-11 rounded-xl transition-transform duration-200 focus:scale-[1.01] focus-visible:ring-primary ${errors.address ? "border-red-500" : "border-border"}`}
          style={{ background: "rgba(255,255,255,0.04)" }}
          data-ocid="request.address.input"
        />
        {errors.address && (
          <p
            className="text-xs text-red-400"
            data-ocid="request.address.field_error"
          >
            {errors.address}
          </p>
        )}
      </div>

      {/* City + Deadline */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="req-city"
            className="text-sm font-medium text-muted-foreground"
          >
            City / Region *
          </Label>
          <Input
            id="req-city"
            placeholder="e.g. Nairobi"
            value={form.city}
            onChange={(e) => {
              set("city", e.target.value);
              clearError("city");
            }}
            className={`h-11 rounded-xl transition-transform duration-200 focus:scale-[1.01] focus-visible:ring-primary ${errors.city ? "border-red-500" : "border-border"}`}
            style={{ background: "rgba(255,255,255,0.04)" }}
            data-ocid="request.city.input"
          />
          {errors.city && (
            <p
              className="text-xs text-red-400"
              data-ocid="request.city.field_error"
            >
              {errors.city}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="req-deadline"
            className="text-sm font-medium text-muted-foreground flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            Deadline
          </Label>
          <Input
            id="req-deadline"
            type="date"
            value={form.deadline}
            onChange={(e) => set("deadline", e.target.value)}
            className="h-11 rounded-xl border-border transition-transform duration-200 focus:scale-[1.01] focus-visible:ring-primary"
            style={{ background: "rgba(255,255,255,0.04)" }}
            data-ocid="request.deadline.input"
          />
        </div>
      </div>

      {/* Coordinates */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Coordinates
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Input
              placeholder="Latitude"
              value={form.lat}
              onChange={(e) => set("lat", e.target.value)}
              className="h-10 rounded-xl border-border text-sm focus-visible:ring-primary"
              style={{ background: "rgba(255,255,255,0.04)" }}
              data-ocid="request.lat.input"
            />
          </div>
          <div>
            <Input
              placeholder="Longitude"
              value={form.lng}
              onChange={(e) => set("lng", e.target.value)}
              className="h-10 rounded-xl border-border text-sm focus-visible:ring-primary"
              style={{ background: "rgba(255,255,255,0.04)" }}
              data-ocid="request.lng.input"
            />
          </div>
        </div>
        {/* Map dot preview */}
        <div
          className="mt-2 rounded-xl p-3 flex items-center gap-3"
          style={{
            background: "rgba(104,174,255,0.06)",
            border: "1px solid rgba(104,174,255,0.12)",
          }}
        >
          <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="rgba(104,174,255,0.1)"
              stroke="rgba(104,174,255,0.3)"
              strokeWidth="1"
            />
            <circle cx="18" cy="18" r="4" fill="oklch(0.65 0.24 262)" />
            <circle
              cx="18"
              cy="18"
              r="8"
              fill="none"
              stroke="rgba(104,174,255,0.3)"
              strokeWidth="1"
              strokeDasharray="2 3"
            />
          </svg>
          <span className="text-xs text-muted-foreground font-mono">
            {form.lat}, {form.lng}
          </span>
        </div>
      </div>

      {/* Summary review card */}
      <div
        className="rounded-2xl p-5 space-y-3"
        style={{
          background: "rgba(104,174,255,0.04)",
          border: "1px solid rgba(104,174,255,0.15)",
        }}
        data-ocid="request.summary.card"
      >
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          Request Summary
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <SummaryRow label="Title" value={form.title || "—"} />
          <SummaryRow label="Organization" value={selectedNGO?.name ?? "—"} />
          <SummaryRow label="Resource" value={selectedResource?.label ?? "—"} />
          <SummaryRow
            label="Urgency"
            value={selectedUrgency?.label ?? "—"}
            valueClass={selectedUrgency?.colorClass}
          />
          <SummaryRow
            label="Quantity"
            value={`${form.quantity} ${form.unit || "units"}`}
          />
          <SummaryRow label="Location" value={form.city || "—"} />
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`font-medium truncate ${valueClass ?? "text-foreground"}`}
      >
        {value}
      </span>
    </div>
  );
}
