import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, Z as Zap, u as useNavigate, I as Input, B as Button, U as User } from "./index-DcnUVu1i.js";
import { L as Label, T as Textarea } from "./textarea-YJmXfXiQ.js";
import { d as useRegisterNGO, e as useRegisterVolunteer, M as MapPin } from "./useAidLink-CJoAqCv4.js";
import { u as ue } from "./index-C6-k6vU6.js";
import { C as CircleCheck } from "./circle-check-q37aQC07.js";
import { E as EyeOff, a as Eye, L as Lock } from "./lock-COBsrRav.js";
import { B as Building2 } from "./building-2-Dey0VxVA.js";
import { U as Users } from "./users-COKJ8ZlA.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7", key: "132q7q" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }]
];
const Mail = createLucideIcon("mail", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
      key: "4pj2yx"
    }
  ],
  ["path", { d: "M20 3v4", key: "1olli1" }],
  ["path", { d: "M22 5h-4", key: "1gvqau" }],
  ["path", { d: "M4 17v2", key: "vumght" }],
  ["path", { d: "M5 18H3", key: "zchphs" }]
];
const Sparkles = createLucideIcon("sparkles", __iconNode);
function useLocalStorageState(key, initialValue) {
  const readValue = reactExports.useCallback(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return initialValue;
      return JSON.parse(item);
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);
  const [storedValue, setStoredValue] = reactExports.useState(readValue);
  const setValue = reactExports.useCallback(
    (value) => {
      try {
        const prev = readValue();
        const next = typeof value === "function" ? value(prev) : value;
        window.localStorage.setItem(key, JSON.stringify(next));
        setStoredValue(next);
        window.dispatchEvent(
          new StorageEvent("storage", {
            key,
            newValue: JSON.stringify(next),
            storageArea: window.localStorage
          })
        );
      } catch {
      }
    },
    [key, readValue]
  );
  const clearValue = reactExports.useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      window.dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue: null,
          storageArea: window.localStorage
        })
      );
    } catch {
    }
  }, [key, initialValue]);
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (e.key !== key || e.storageArea !== window.localStorage) return;
      setStoredValue(
        e.newValue !== null ? JSON.parse(e.newValue) : initialValue
      );
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key, initialValue]);
  return [storedValue, setValue, clearValue];
}
const AIDLINK_USER_KEY = "aidlink_user";
const AIDLINK_REMEMBER_KEY = "aidlink_remember";
function BackgroundOrbs() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fixed inset-0 overflow-hidden pointer-events-none",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-20",
            style: {
              background: "radial-gradient(circle at center, rgba(104,174,255,0.6), transparent 70%)",
              filter: "blur(60px)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-1/2 -right-40 w-[420px] h-[420px] rounded-full opacity-15",
            style: {
              background: "radial-gradient(circle at center, rgba(168,85,247,0.6), transparent 70%)",
              filter: "blur(60px)",
              transform: "translateY(-50%)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute -bottom-24 left-1/3 w-[360px] h-[360px] rounded-full opacity-15",
            style: {
              background: "radial-gradient(circle at center, rgba(112,204,255,0.5), transparent 70%)",
              filter: "blur(50px)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 opacity-[0.03]",
            style: {
              backgroundImage: "linear-gradient(rgba(104,174,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(104,174,255,1) 1px, transparent 1px)",
              backgroundSize: "48px 48px"
            }
          }
        )
      ]
    }
  );
}
function Field({ id, label, icon, error, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Label,
      {
        htmlFor: id,
        className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
        children: label
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors duration-200 z-10", children: icon }),
      children
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", "data-ocid": `${id}.field_error`, children: error })
  ] });
}
function TabBar({
  active,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative flex rounded-xl p-1 mb-7",
      style: { background: "rgba(255,255,255,0.05)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg transition-all duration-300 ease-out",
            style: {
              background: "var(--gradient-primary)",
              boxShadow: "0 0 16px rgba(104,174,255,0.35)",
              left: active === "login" ? "4px" : "calc(50%)"
            }
          }
        ),
        ["login", "signup"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => onChange(t),
            "data-ocid": `auth.${t}.tab`,
            className: `relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${active === t ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
            children: t === "login" ? "Sign In" : "Create Account"
          },
          t
        ))
      ]
    }
  );
}
function RoleSelector({
  value,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 mb-5", children: ["ngo", "volunteer"].map((role) => {
    const isActive = value === role;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => onChange(role),
        "data-ocid": `auth.role.${role}`,
        className: "relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200",
        style: {
          background: isActive ? "rgba(104,174,255,0.12)" : "rgba(255,255,255,0.04)",
          borderColor: isActive ? "rgba(104,174,255,0.5)" : "rgba(255,255,255,0.1)",
          boxShadow: isActive ? "0 0 16px rgba(104,174,255,0.2)" : "none"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
              style: {
                background: isActive ? "var(--gradient-primary)" : "rgba(255,255,255,0.06)",
                boxShadow: isActive ? "0 0 12px rgba(104,174,255,0.4)" : "none"
              },
              children: role === "ngo" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-5 h-5 text-primary-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5 text-primary-foreground" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-sm font-semibold ${isActive ? "text-foreground" : "text-muted-foreground"}`,
              children: role === "ngo" ? "NGO Organization" : "Volunteer"
            }
          ),
          isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "absolute top-2 right-2 w-4 h-4 text-primary" })
        ]
      },
      role
    );
  }) });
}
function WelcomeBackBanner({ name }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-3 rounded-xl px-4 py-3 mb-5",
      style: {
        background: "rgba(104,174,255,0.08)",
        border: "1px solid rgba(104,174,255,0.25)",
        boxShadow: "0 0 12px rgba(104,174,255,0.1)"
      },
      "data-ocid": "auth.welcome_back.banner",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
            style: { background: "var(--gradient-primary)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-4 h-4 text-primary-foreground" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground truncate", children: [
            "Welcome back, ",
            name,
            "!"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Your email has been pre-filled for you." })
        ] })
      ]
    }
  );
}
function LoginForm() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = reactExports.useState(false);
  const [success, setSuccess] = reactExports.useState(false);
  const [rememberMe, setRememberMe, clearRemember] = useLocalStorageState(AIDLINK_REMEMBER_KEY, false);
  const [storedUser, setStoredUser, clearStoredUser] = useLocalStorageState(AIDLINK_USER_KEY, null);
  const [form, setForm] = reactExports.useState({
    email: rememberMe && storedUser ? storedUser.email : "",
    password: ""
  });
  const [errors, setErrors] = reactExports.useState(
    {}
  );
  const validate = () => {
    const e = {};
    if (!form.email) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    return e;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const name = (storedUser == null ? void 0 : storedUser.name) ?? form.email.split("@")[0];
    const user = {
      email: form.email,
      role: "ngo",
      // Login doesn't know the role yet — defaults to ngo; dashboard can update
      name,
      loggedInAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    setStoredUser(user);
    setSuccess(true);
    ue.success("Welcome back! Redirecting to dashboard...");
    setTimeout(() => {
      navigate({ to: "/ngo" });
    }, 1200);
  };
  const handleRememberChange = (checked) => {
    if (checked) {
      setRememberMe(true);
    } else {
      setRememberMe(false);
      clearStoredUser();
    }
  };
  if (success) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center gap-4 py-10",
        "data-ocid": "auth.login.success_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-16 h-16 rounded-full flex items-center justify-center",
              style: {
                background: "var(--gradient-primary)",
                boxShadow: "0 0 24px rgba(104,174,255,0.5)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-8 h-8 text-primary-foreground" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-xl text-foreground", children: "Welcome!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Redirecting to your dashboard…" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      onSubmit: handleSubmit,
      className: "space-y-5",
      "data-ocid": "auth.login.form",
      noValidate: true,
      children: [
        rememberMe && storedUser && /* @__PURE__ */ jsxRuntimeExports.jsx(WelcomeBackBanner, { name: storedUser.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field,
          {
            id: "login-email",
            label: "Email Address",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-4 h-4" }),
            error: errors.email,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "login-email",
                type: "email",
                placeholder: "you@organization.org",
                value: form.email,
                onBlur: () => {
                  const e = validate();
                  setErrors((p) => ({ ...p, email: e.email }));
                },
                onChange: (e) => {
                  setForm((p) => ({ ...p, email: e.target.value }));
                  if (errors.email) setErrors((p) => ({ ...p, email: void 0 }));
                },
                className: "pl-10 h-12 rounded-xl border-white/10 bg-white/5 focus-visible:ring-primary/60 focus-visible:border-primary/50 text-foreground placeholder:text-muted-foreground/50",
                "data-ocid": "auth.login.email.input",
                required: true
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Field,
          {
            id: "login-password",
            label: "Password",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4" }),
            error: errors.password,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "login-password",
                  type: showPass ? "text" : "password",
                  placeholder: "••••••••",
                  value: form.password,
                  onBlur: () => {
                    const e = validate();
                    setErrors((p) => ({ ...p, password: e.password }));
                  },
                  onChange: (e) => {
                    setForm((p) => ({ ...p, password: e.target.value }));
                    if (errors.password)
                      setErrors((p) => ({ ...p, password: void 0 }));
                  },
                  className: "pl-10 pr-12 h-12 rounded-xl border-white/10 bg-white/5 focus-visible:ring-primary/60 focus-visible:border-primary/50 text-foreground placeholder:text-muted-foreground/50",
                  "data-ocid": "auth.login.password.input",
                  required: true
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowPass((v) => !v),
                  className: "absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200",
                  "aria-label": showPass ? "Hide password" : "Show password",
                  children: showPass ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              htmlFor: "login-remember",
              className: "flex items-center gap-2 cursor-pointer group",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "login-remember",
                    type: "checkbox",
                    checked: rememberMe,
                    onChange: (e) => handleRememberChange(e.target.checked),
                    "data-ocid": "auth.login.remember_me.checkbox",
                    className: "sr-only"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    "aria-hidden": "true",
                    className: `w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${rememberMe ? "border-primary bg-primary/30" : "border-white/20 bg-white/5"}`,
                    children: rememberMe && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "svg",
                      {
                        viewBox: "0 0 10 8",
                        className: "w-2.5 h-2.5 text-primary",
                        fill: "none",
                        "aria-hidden": "true",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "checked" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "path",
                            {
                              d: "M1 4l3 3 5-6",
                              stroke: "currentColor",
                              strokeWidth: "1.5",
                              strokeLinecap: "round",
                              strokeLinejoin: "round"
                            }
                          )
                        ]
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground group-hover:text-foreground transition-colors", children: "Remember me" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "text-xs text-primary hover:text-primary/80 transition-colors duration-200",
              "data-ocid": "auth.login.forgot_password",
              children: "Forgot password?"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            className: "w-full h-12 rounded-xl gradient-primary text-primary-foreground border-0 font-semibold text-sm glow-primary hover:opacity-90 transition-smooth",
            "data-ocid": "auth.login.submit_button",
            children: "Sign In to AidLink"
          }
        ),
        storedUser && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              clearStoredUser();
              clearRemember();
              setForm({ email: "", password: "" });
              ue.success("Signed out successfully.");
            },
            className: "w-full text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors duration-200 pt-1",
            "data-ocid": "auth.login.sign_out_button",
            children: [
              "Not ",
              storedUser.name,
              "? Sign out"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground", children: [
          "Uses ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary/80", children: "Internet Identity" }),
          " for secure, decentralized authentication."
        ] })
      ]
    }
  );
}
function SignUpForm() {
  const navigate = useNavigate();
  const { mutateAsync: registerNGO, isPending: ngoLoading } = useRegisterNGO();
  const { mutateAsync: registerVolunteer, isPending: volLoading } = useRegisterVolunteer();
  const [role, setRole] = reactExports.useState("ngo");
  const [showPass, setShowPass] = reactExports.useState(false);
  const [showConfirm, setShowConfirm] = reactExports.useState(false);
  const [success, setSuccess] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    location: "",
    skills: "",
    description: ""
  });
  const [errors, setErrors] = reactExports.useState({});
  const [, setStoredUser] = useLocalStorageState(
    AIDLINK_USER_KEY,
    null
  );
  const [, setRememberMe] = useLocalStorageState(
    AIDLINK_REMEMBER_KEY,
    false
  );
  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: void 0 }));
  };
  const validate = () => {
    const e = {};
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
  const handleSubmit = async (e) => {
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
          ...coords
        });
        setStoredUser({
          email: form.email,
          role: "ngo",
          name: form.name,
          loggedInAt: (/* @__PURE__ */ new Date()).toISOString()
        });
        setRememberMe(true);
        ue.success("NGO registered successfully! Welcome to AidLink.");
        setSuccess(true);
        setTimeout(() => navigate({ to: "/ngo" }), 1300);
      } else {
        await registerVolunteer({
          name: form.name,
          skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
          ...coords
        });
        setStoredUser({
          email: form.email,
          role: "volunteer",
          name: form.name,
          loggedInAt: (/* @__PURE__ */ new Date()).toISOString()
        });
        setRememberMe(true);
        ue.success("Volunteer profile created! Welcome to AidLink.");
        setSuccess(true);
        setTimeout(() => navigate({ to: "/volunteer" }), 1300);
      }
    } catch {
      ue.error("Registration failed. Please try again.");
    }
  };
  if (success) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center gap-4 py-10",
        "data-ocid": "auth.signup.success_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-16 h-16 rounded-full flex items-center justify-center",
              style: {
                background: "var(--gradient-primary)",
                boxShadow: "0 0 24px rgba(104,174,255,0.5)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-8 h-8 text-primary-foreground" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-xl text-foreground", children: "Welcome to AidLink!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "Setting up your dashboard…" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      onSubmit: handleSubmit,
      className: "space-y-4",
      "data-ocid": "auth.signup.form",
      noValidate: true,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RoleSelector, { value: role, onChange: setRole }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field,
          {
            id: "signup-name",
            label: role === "ngo" ? "Organization Name" : "Full Name",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4" }),
            error: errors.name,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "signup-name",
                placeholder: role === "ngo" ? "e.g. Global Relief Foundation" : "e.g. Sarah Johnson",
                value: form.name,
                onChange: set("name"),
                className: "pl-10 h-12 rounded-xl border-white/10 bg-white/5 focus-visible:ring-primary/60 focus-visible:border-primary/50 text-foreground placeholder:text-muted-foreground/50",
                "data-ocid": "auth.signup.name.input",
                required: true
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field,
          {
            id: "signup-email",
            label: "Email Address",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-4 h-4" }),
            error: errors.email,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "signup-email",
                type: "email",
                placeholder: "contact@organization.org",
                value: form.email,
                onChange: set("email"),
                className: "pl-10 h-12 rounded-xl border-white/10 bg-white/5 focus-visible:ring-primary/60 focus-visible:border-primary/50 text-foreground placeholder:text-muted-foreground/50",
                "data-ocid": "auth.signup.email.input",
                required: true
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Field,
            {
              id: "signup-password",
              label: "Password",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4" }),
              error: errors.password,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "signup-password",
                    type: showPass ? "text" : "password",
                    placeholder: "••••••••",
                    value: form.password,
                    onChange: set("password"),
                    className: "pl-10 pr-10 h-12 rounded-xl border-white/10 bg-white/5 focus-visible:ring-primary/60 focus-visible:border-primary/50 text-foreground placeholder:text-muted-foreground/50",
                    "data-ocid": "auth.signup.password.input",
                    required: true
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowPass((v) => !v),
                    className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                    "aria-label": showPass ? "Hide password" : "Show password",
                    children: showPass ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3.5 h-3.5" })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Field,
            {
              id: "signup-confirm",
              label: "Confirm",
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4" }),
              error: errors.confirm,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "signup-confirm",
                    type: showConfirm ? "text" : "password",
                    placeholder: "••••••••",
                    value: form.confirm,
                    onChange: set("confirm"),
                    className: "pl-10 pr-10 h-12 rounded-xl border-white/10 bg-white/5 focus-visible:ring-primary/60 focus-visible:border-primary/50 text-foreground placeholder:text-muted-foreground/50",
                    "data-ocid": "auth.signup.confirm.input",
                    required: true
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowConfirm((v) => !v),
                    className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                    "aria-label": showConfirm ? "Hide password" : "Show password",
                    children: showConfirm ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-3.5 h-3.5" })
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Field,
          {
            id: "signup-location",
            label: "City / Location",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4" }),
            error: errors.location,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "signup-location",
                placeholder: "e.g. London, UK",
                value: form.location,
                onChange: set("location"),
                className: "pl-10 h-12 rounded-xl border-white/10 bg-white/5 focus-visible:ring-primary/60 focus-visible:border-primary/50 text-foreground placeholder:text-muted-foreground/50",
                "data-ocid": "auth.signup.location.input",
                required: true
              }
            )
          }
        ),
        role === "ngo" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "signup-description",
              className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
              children: "Organization Description"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "signup-description",
              placeholder: "Brief description of your NGO's mission and activities…",
              value: form.description,
              onChange: set("description"),
              rows: 3,
              className: "rounded-xl border-white/10 bg-white/5 focus-visible:ring-primary/60 focus-visible:border-primary/50 text-foreground placeholder:text-muted-foreground/50 resize-none",
              "data-ocid": "auth.signup.description.textarea"
            }
          ),
          errors.description && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-destructive",
              "data-ocid": "auth.signup.description.field_error",
              children: errors.description
            }
          )
        ] }),
        role === "volunteer" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Label,
            {
              htmlFor: "signup-skills",
              className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
              children: [
                "Skills",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 normal-case", children: "(comma-separated)" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "signup-skills",
              placeholder: "e.g. Medical First Aid, Logistics, Swahili, Teaching…",
              value: form.skills,
              onChange: set("skills"),
              rows: 2,
              className: "rounded-xl border-white/10 bg-white/5 focus-visible:ring-primary/60 focus-visible:border-primary/50 text-foreground placeholder:text-muted-foreground/50 resize-none",
              "data-ocid": "auth.signup.skills.textarea"
            }
          ),
          errors.skills && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-destructive",
              "data-ocid": "auth.signup.skills.field_error",
              children: errors.skills
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: isPending,
            className: "w-full h-12 rounded-xl gradient-primary text-primary-foreground border-0 font-semibold text-sm glow-primary hover:opacity-90 transition-smooth mt-2",
            "data-ocid": "auth.signup.submit_button",
            children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" }),
              "Creating account…"
            ] }) : `Create ${role === "ngo" ? "NGO Account" : "Volunteer Profile"}`
          }
        )
      ]
    }
  );
}
function AuthPage() {
  const [tab, setTab] = reactExports.useState("login");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen flex items-center justify-center px-4 py-16 relative",
      style: {
        background: "linear-gradient(135deg, oklch(0.08 0.02 260) 0%, oklch(0.1 0.04 270) 40%, oklch(0.12 0.06 280) 100%)"
      },
      "data-ocid": "auth.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BackgroundOrbs, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full max-w-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "/", className: "inline-flex items-center gap-2.5 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "w-11 h-11 rounded-xl flex items-center justify-center",
                  style: {
                    background: "var(--gradient-primary)",
                    boxShadow: "0 0 20px rgba(104,174,255,0.5)"
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5 text-primary-foreground" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-bold text-2xl tracking-tight text-foreground", children: [
                "Aid",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "Link" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: "Smart Resource Allocation · Join the network." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-3xl p-8",
              style: {
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)"
              },
              "data-ocid": "auth.card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TabBar, { active: tab, onChange: setTab }),
                tab === "login" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground leading-tight", children: "Welcome back" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Sign in to your AidLink account" })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground leading-tight", children: "Join AidLink" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Create your account and start making an impact" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      animation: "fadeSlideIn 0.25s ease-out"
                    },
                    children: tab === "login" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoginForm, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(SignUpForm, {})
                  },
                  tab
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground/60 mt-6", children: [
            "By joining, you agree to AidLink's",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary/70 cursor-pointer hover:text-primary transition-colors", children: "Terms of Service" }),
            " ",
            "and",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary/70 cursor-pointer hover:text-primary transition-colors", children: "Privacy Policy" }),
            "."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      ` })
      ]
    }
  );
}
export {
  AuthPage
};
