import { Input } from "@/components/ui/input";
import {
  Bot,
  MessageCircle,
  Minus,
  RefreshCw,
  Send,
  Trash2,
  User,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
type MessageRole = "user" | "assistant";

interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────
const LS_HISTORY_KEY = "aidlink_chat_history";
const MAX_HISTORY = 50;

const QUICK_REPLIES = [
  "Submit request",
  "Find volunteers",
  "View map",
  "NGO dashboard",
  "How it works",
  "Get help",
];

// ──────────────────────────────────────────────
// FAQ Knowledge Base (≥ 20 Q&A pairs)
// ──────────────────────────────────────────────
interface FaqEntry {
  keywords: string[];
  answer: string;
}

const FAQ: FaqEntry[] = [
  {
    keywords: [
      "submit",
      "request",
      "create request",
      "new request",
      "aid request",
      "resource request",
      "how to request",
    ],
    answer:
      "To submit a resource request, go to the **Request Form** from the navigation menu. You'll fill in: (1) your organisation name, (2) resource type (food, medical, shelter, etc.), (3) quantity needed, (4) urgency level (Low / Medium / High / Critical), and (5) your location. Hit **Submit** and your request goes live on the map immediately for volunteers to see.",
  },
  {
    keywords: [
      "urgency",
      "urgency level",
      "priority",
      "critical",
      "high priority",
    ],
    answer:
      "AidLink uses four urgency levels for requests:\n• **Low** – Non-urgent, can wait several days\n• **Medium** – Needed within 24–48 hours\n• **High** – Required today\n• **Critical** – Emergency, needs immediate response\n\nHigher urgency requests appear with brighter markers on the map and are shown at the top of volunteer feeds.",
  },
  {
    keywords: [
      "volunteer",
      "accept task",
      "find task",
      "nearby task",
      "how to volunteer",
      "volunteer accept",
      "accept mission",
    ],
    answer:
      "As a volunteer, head to your **Volunteer Dashboard** after logging in. You'll see a live list of nearby tasks sorted by distance and urgency. Click **Accept** on any task to claim it — the requester is notified instantly. Your accepted tasks move to the My Missions tab where you can update status as you go.",
  },
  {
    keywords: [
      "volunteer dashboard",
      "my missions",
      "mission",
      "task list",
      "accepted tasks",
    ],
    answer:
      "Your Volunteer Dashboard has three tabs:\n• **Nearby Tasks** – Open requests within your radius\n• **My Missions** – Tasks you've accepted\n• **History** – Completed missions\n\nYou can also see a mini map preview of task locations and filter by resource type.",
  },
  {
    keywords: [
      "ngo dashboard",
      "ngo manage",
      "manage requests",
      "assign volunteer",
      "request management",
      "organisation dashboard",
    ],
    answer:
      "The NGO Dashboard gives you a full overview of your organisation's activity. From there you can:\n• View all your open, active, and completed requests\n• See which volunteers have accepted each request\n• Manually assign volunteers to specific requests\n• Track real-time status updates from volunteers in the field",
  },
  {
    keywords: [
      "what is aidlink",
      "about aidlink",
      "platform",
      "what does",
      "how does aidlink work",
      "purpose",
    ],
    answer:
      "AidLink is a smart resource allocation platform that connects NGOs, volunteers, and communities in real time. NGOs post resource requests (food, medical supplies, shelter, etc.), volunteers see nearby requests on a live map and accept what they can fulfill, and the platform tracks everything end-to-end — from submission to delivery.",
  },
  {
    keywords: [
      "map",
      "view map",
      "map tracking",
      "live map",
      "location",
      "markers",
      "see on map",
    ],
    answer:
      "The **Map Command Center** shows a full-screen live map with three types of markers:\n• 🔵 **Blue** – NGO locations\n• 🟢 **Green** – Active volunteer positions\n• 🔴 **Red/Orange** – Open resource requests\n\nClick any marker to see details and get directions. The map auto-centers on your location when you open it.",
  },
  {
    keywords: [
      "route",
      "directions",
      "get directions",
      "navigate",
      "how to get there",
    ],
    answer:
      "In the Map Command Center, click any request or NGO marker and select **Get Directions**. A route will be drawn on the map with turn-by-turn instructions displayed in a floating panel on the right side. The route updates dynamically as you move.",
  },
  {
    keywords: [
      "login",
      "sign in",
      "sign up",
      "register",
      "create account",
      "account",
      "join",
    ],
    answer:
      "To create an account, click **Get Started** on the home page. You'll choose your role:\n• **NGO / Organisation** – Post requests and manage aid operations\n• **Volunteer** – View requests near you and accept tasks\n\nAidLink uses Internet Identity for secure, password-free login. Your data is saved locally so you stay logged in across sessions.",
  },
  {
    keywords: [
      "role",
      "ngo role",
      "volunteer role",
      "change role",
      "switch role",
    ],
    answer:
      "You select your role (NGO or Volunteer) during sign-up. Your role determines which dashboard you see after login. If you need to change roles, you can re-register with the same identity and choose a different role.",
  },
  {
    keywords: [
      "local storage",
      "data saved",
      "persist",
      "data lost",
      "refresh",
      "page refresh",
      "remember",
    ],
    answer:
      "AidLink saves your login details, recent requests, and chat history in your browser's local storage. This means your data stays available even after you close or refresh the page — no need to log in again.",
  },
  {
    keywords: ["chat history", "conversation", "saved chat", "previous chat"],
    answer:
      "Your chat history with me is saved in your browser so you can pick up where you left off, even after a page refresh. I keep the last 50 messages. You can clear the history any time using the trash icon in the header.",
  },
  {
    keywords: [
      "track",
      "track request",
      "request status",
      "status",
      "where is my request",
      "request progress",
    ],
    answer:
      "To track the status of a request, go to your **NGO Dashboard** and click on the request. You'll see real-time status updates:\n• **Pending** – Awaiting volunteer\n• **Accepted** – A volunteer is on the way\n• **In Progress** – Resources being delivered\n• **Completed** – Fulfilled successfully",
  },
  {
    keywords: [
      "resource type",
      "food",
      "medical",
      "shelter",
      "water",
      "supply",
      "resources",
    ],
    answer:
      "AidLink supports a wide range of resource types you can request:\n• 🍱 Food & Nutrition\n• 💊 Medical Supplies & Equipment\n• 🏠 Shelter & Accommodation\n• 💧 Clean Water\n• 👕 Clothing & Blankets\n• 🚗 Transport\n• 📦 General Supplies\n\nSelect the appropriate type when filling out the request form.",
  },
  {
    keywords: [
      "analytics",
      "stats",
      "statistics",
      "impact",
      "numbers",
      "reports",
      "data",
    ],
    answer:
      "The **Analytics** section shows real-time impact metrics: total requests fulfilled, volunteers active, NGOs on the platform, resources delivered, and response time averages. Data is visualised with neon gradient charts updated as activity happens on the platform.",
  },
  {
    keywords: ["notification", "alert", "notify", "email", "reminder"],
    answer:
      "AidLink sends real-time in-app notifications when: a volunteer accepts your request, a request status changes, or a new request matching your area appears. You can see all notifications in your dashboard notification panel.",
  },
  {
    keywords: [
      "password",
      "forgot password",
      "reset password",
      "can't login",
      "locked out",
    ],
    answer:
      "AidLink uses Internet Identity — there's no traditional password to forget! Your login is tied to your device. If you lose access, you can recover using the backup phrases you set up during registration. Contact our support team if you need assistance.",
  },
  {
    keywords: [
      "help",
      "support",
      "contact",
      "issue",
      "problem",
      "bug",
      "feedback",
    ],
    answer:
      "If you need help beyond what I can answer, you can:\n• Browse the **Help** section in the navigation menu\n• Reach out to our support team via the **Contact** page\n• Report bugs using the feedback form in your dashboard\n\nWe typically respond within a few hours during business days.",
  },
  {
    keywords: [
      "how do i",
      "how to",
      "guide",
      "tutorial",
      "steps",
      "walkthrough",
      "instructions",
    ],
    answer:
      "Happy to walk you through anything! Here are the most common guides people ask about:\n• Submitting a resource request\n• Accepting a volunteer task\n• Using the live map\n• Managing requests from the NGO dashboard\n• Understanding urgency levels\n\nJust ask about any of these and I'll give you step-by-step instructions!",
  },
  {
    keywords: ["delete", "remove request", "cancel request", "close request"],
    answer:
      "To cancel or close a request, go to your **NGO Dashboard**, find the request, and click the **Close Request** button. If a volunteer has already accepted it, they'll be notified immediately. Completed requests are archived in your history for record-keeping.",
  },
  {
    keywords: [
      "volunteer match",
      "match volunteer",
      "matching",
      "best volunteer",
      "assign",
    ],
    answer:
      "AidLink's matching algorithm suggests volunteers based on: proximity to the request location, availability status, past mission success rate, and skill tags. NGOs can also manually assign a specific volunteer from the dashboard if they have an established relationship.",
  },
];

// ──────────────────────────────────────────────
// Rule-based FAQ Matcher
// ──────────────────────────────────────────────
function getFaqAnswer(userText: string): string {
  const normalised = userText.toLowerCase().trim();

  let bestMatch: FaqEntry | null = null;
  let bestScore = 0;

  for (const entry of FAQ) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (normalised.includes(keyword.toLowerCase())) {
        score += keyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && bestScore > 0) {
    return bestMatch.answer;
  }

  return "I'm not sure about that — try browsing the **Help** section in the navigation menu or reach out to our support team via the Contact page. They'll be happy to assist you!";
}

// ──────────────────────────────────────────────
// LocalStorage helpers
// ──────────────────────────────────────────────
function loadHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(LS_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ChatMessage[];
  } catch {
    return [];
  }
}

function saveHistory(messages: ChatMessage[]) {
  try {
    const trimmed = messages.slice(-MAX_HISTORY);
    localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    // Silently ignore storage quota errors
  }
}

// ──────────────────────────────────────────────
// Welcome messages
// ──────────────────────────────────────────────
const WELCOME_NEW: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I'm the AidLink Assistant — here to help you navigate the platform. I can answer questions about submitting requests, volunteering, using the map, and more. How can I help you today?",
  timestamp: Date.now(),
};

const WELCOME_RETURNING = (): ChatMessage => ({
  id: "welcome-returning",
  role: "assistant",
  content:
    "Welcome back! Here's your recent conversation. Feel free to continue or ask something new.",
  timestamp: Date.now(),
});

// ──────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────
function LoadingDots() {
  return (
    <div className="flex gap-1.5 items-center px-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full animate-bounce"
          style={{
            background: "oklch(0.65 0.22 260)",
            animationDelay: `${i * 0.18}s`,
            animationDuration: "0.9s",
          }}
        />
      ))}
    </div>
  );
}

function ChatBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";

  // Render simple markdown: **bold** → <strong>
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const inner = part.slice(2, -2);
        // biome-ignore lint/suspicious/noArrayIndexKey: static split parts, no reorder
        return <strong key={`bold-${idx}`}>{inner}</strong>;
      }
      // biome-ignore lint/suspicious/noArrayIndexKey: static split parts, no reorder
      return <span key={`text-${idx}`}>{part}</span>;
    });
  };

  return (
    <div
      className={`flex gap-2 mb-3 ${isUser ? "flex-row-reverse" : "flex-row"} items-end`}
    >
      {/* Avatar */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5"
        style={
          isUser
            ? {
                background:
                  "linear-gradient(135deg, oklch(0.55 0.25 260), oklch(0.5 0.28 290))",
              }
            : {
                background: "oklch(0.14 0.04 260 / 0.9)",
                border: "1px solid oklch(0.3 0.1 260 / 0.4)",
              }
        }
      >
        {isUser ? (
          <User className="w-3.5 h-3.5 text-white" />
        ) : (
          <Bot
            className="w-3.5 h-3.5"
            style={{ color: "oklch(0.72 0.2 220)" }}
          />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
          isUser ? "rounded-br-sm text-white" : "rounded-bl-sm"
        }`}
        style={
          isUser
            ? {
                background:
                  "linear-gradient(135deg, oklch(0.52 0.25 260), oklch(0.46 0.28 290))",
                boxShadow: "0 2px 12px oklch(0.55 0.25 260 / 0.35)",
              }
            : {
                background: "oklch(0.15 0.04 260 / 0.85)",
                border: "1px solid oklch(0.28 0.08 260 / 0.4)",
                color: "oklch(0.88 0.02 250)",
              }
        }
      >
        {renderContent(msg.content)}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Main Chatbot Component
// ──────────────────────────────────────────────
export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");

  // Messages: loaded from localStorage on first mount
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = loadHistory();
    if (saved.length === 0) {
      return [WELCOME_NEW];
    }
    return [WELCOME_RETURNING(), ...saved];
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Persist messages to localStorage whenever they change (skip welcome messages)
  useEffect(() => {
    const persistable = messages.filter(
      (m) => m.id !== "welcome" && m.id !== "welcome-returning",
    );
    saveHistory(persistable);
  }, [messages]);

  // Auto-scroll
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll trigger
  useEffect(() => {
    if (isOpen && !isMinimized) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [isOpen, isMinimized]);

  const handleSend = useCallback(
    (text?: string) => {
      const content = (text ?? input).trim();
      if (!content || isLoading) return;

      setInput("");

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      // Simulate a brief "typing" delay for natural feel
      setTimeout(
        () => {
          const answer = getFaqAnswer(content);
          const botMsg: ChatMessage = {
            id: `bot-${Date.now()}`,
            role: "assistant",
            content: answer,
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, botMsg]);
          setIsLoading(false);
        },
        600 + Math.random() * 400,
      );
    },
    [input, isLoading],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    localStorage.removeItem(LS_HISTORY_KEY);
    setMessages([
      {
        ...WELCOME_NEW,
        id: `welcome-${Date.now()}`,
        timestamp: Date.now(),
      },
    ]);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  return (
    <>
      {/* Floating toggle button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
          {showTooltip && (
            <div
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white pointer-events-none"
              style={{
                background: "oklch(0.14 0.04 260 / 0.95)",
                border: "1px solid oklch(0.35 0.12 260 / 0.5)",
                boxShadow: "0 4px 20px oklch(0 0 0 / 0.4)",
                backdropFilter: "blur(12px)",
              }}
            >
              AidLink Assistant
            </div>
          )}
          <button
            type="button"
            onClick={handleOpen}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            data-ocid="chatbot.open_modal_button"
            aria-label="Open AidLink Assistant"
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 animate-pulse-glow"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.52 0.25 260), oklch(0.46 0.28 290), oklch(0.55 0.22 195))",
              boxShadow:
                "0 0 20px oklch(0.55 0.25 260 / 0.6), 0 0 40px oklch(0.5 0.28 290 / 0.35), 0 4px 20px oklch(0 0 0 / 0.4)",
            }}
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
        </div>
      )}

      {/* Chat window */}
      {isOpen && (
        <div
          data-ocid="chatbot.dialog"
          className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden flex flex-col"
          style={{
            background: "oklch(0.1 0.03 265 / 0.96)",
            backdropFilter: "blur(24px)",
            border: "1px solid oklch(0.3 0.08 270 / 0.35)",
            boxShadow:
              "0 8px 40px oklch(0 0 0 / 0.55), 0 0 30px oklch(0.52 0.22 260 / 0.15)",
            maxHeight: "calc(100vh - 5rem)",
            animation: "chatSlideIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {/* Gradient header */}
          <div
            className="flex items-center justify-between px-4 py-3 flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.2 0.08 260 / 0.9), oklch(0.18 0.1 285 / 0.9))",
              borderBottom: "1px solid oklch(0.35 0.1 265 / 0.3)",
            }}
          >
            <div className="flex items-center gap-2.5">
              {/* Bot avatar with glow */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.52 0.25 260), oklch(0.46 0.28 290))",
                  boxShadow: "0 0 12px oklch(0.55 0.25 260 / 0.5)",
                }}
              >
                <Bot
                  className="w-4.5 h-4.5 text-white"
                  style={{ width: 18, height: 18 }}
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-bold font-display text-white tracking-wide">
                    AidLink
                  </p>
                  <Zap
                    className="w-3 h-3"
                    style={{ color: "oklch(0.85 0.2 90)" }}
                  />
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: "oklch(0.7 0.2 145)" }}
                  />
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.65 0.1 220)" }}
                  >
                    FAQ Assistant · Always available
                  </p>
                </div>
              </div>
            </div>

            {/* Header actions */}
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={handleClearChat}
                data-ocid="chatbot.clear_button"
                aria-label="Clear chat history"
                title="Clear chat"
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-200"
                style={{ color: "oklch(0.55 0.08 240)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "oklch(0.25 0.06 260 / 0.5)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "oklch(0.75 0.15 30)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "oklch(0.55 0.08 240)";
                }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized((v) => !v)}
                data-ocid="chatbot.minimize_button"
                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-200"
                style={{ color: "oklch(0.55 0.08 240)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "oklch(0.25 0.06 260 / 0.5)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "oklch(0.8 0.05 250)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "oklch(0.55 0.08 240)";
                }}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                data-ocid="chatbot.close_button"
                aria-label="Close chat"
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-200"
                style={{ color: "oklch(0.55 0.08 240)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "oklch(0.35 0.15 15 / 0.3)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "oklch(0.72 0.2 25)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "oklch(0.55 0.08 240)";
                }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Chat body */}
          {!isMinimized && (
            <>
              {/* Messages area */}
              <div
                className="overflow-y-auto px-3 py-3 flex-1"
                style={{ maxHeight: "340px", minHeight: "200px" }}
                data-ocid="chatbot.messages_panel"
              >
                {messages.map((msg, idx) => (
                  <div key={msg.id} data-ocid={`chatbot.message.${idx + 1}`}>
                    <ChatBubble msg={msg} />
                  </div>
                ))}

                {/* Typing indicator */}
                {isLoading && (
                  <div
                    className="flex gap-2 mb-3 items-end"
                    data-ocid="chatbot.loading_state"
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: "oklch(0.14 0.04 260 / 0.9)",
                        border: "1px solid oklch(0.3 0.1 260 / 0.4)",
                      }}
                    >
                      <Bot
                        className="w-3.5 h-3.5"
                        style={{ color: "oklch(0.72 0.2 220)" }}
                      />
                    </div>
                    <div
                      className="rounded-2xl rounded-bl-sm px-3.5 py-2"
                      style={{
                        background: "oklch(0.15 0.04 260 / 0.85)",
                        border: "1px solid oklch(0.28 0.08 260 / 0.4)",
                      }}
                    >
                      <LoadingDots />
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick reply chips */}
              <div
                className="flex flex-wrap gap-1.5 px-3 pt-1 pb-2"
                style={{ borderTop: "1px solid oklch(0.22 0.06 260 / 0.3)" }}
              >
                {QUICK_REPLIES.map((reply) => (
                  <button
                    type="button"
                    key={reply}
                    onClick={() => handleSend(reply)}
                    disabled={isLoading}
                    data-ocid={`chatbot.quick_reply.${reply
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "_")
                      .replace(/^_|_$/g, "")}`}
                    className="text-xs px-2.5 py-1 rounded-full transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: "oklch(0.18 0.06 265 / 0.7)",
                      border: "1px solid oklch(0.35 0.1 265 / 0.4)",
                      color: "oklch(0.72 0.12 225)",
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "oklch(0.25 0.1 260 / 0.7)";
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.borderColor = "oklch(0.52 0.2 260 / 0.6)";
                        (e.currentTarget as HTMLButtonElement).style.color =
                          "oklch(0.85 0.1 220)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "oklch(0.18 0.06 265 / 0.7)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "oklch(0.35 0.1 265 / 0.4)";
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "oklch(0.72 0.12 225)";
                    }}
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Input bar */}
              <div className="flex gap-2 px-3 pb-3 pt-1 flex-shrink-0">
                <div className="relative flex-1">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything…"
                    disabled={isLoading}
                    maxLength={500}
                    data-ocid="chatbot.input"
                    className="h-10 pr-14 text-sm border-0 focus-visible:ring-1 focus-visible:ring-blue-500/60"
                    style={{
                      background: "oklch(0.16 0.05 265 / 0.8)",
                      border: "1px solid oklch(0.3 0.08 265 / 0.4)",
                      color: "oklch(0.88 0.02 250)",
                      borderRadius: "0.75rem",
                    }}
                  />
                  {input.length > 400 && (
                    <span
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none"
                      style={{
                        color:
                          input.length > 480
                            ? "oklch(0.7 0.2 30)"
                            : "oklch(0.55 0.06 250)",
                      }}
                    >
                      {500 - input.length}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  data-ocid="chatbot.send_button"
                  aria-label="Send message"
                  className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                  style={{
                    background:
                      !input.trim() || isLoading
                        ? "oklch(0.22 0.05 265 / 0.6)"
                        : "linear-gradient(135deg, oklch(0.52 0.25 260), oklch(0.46 0.28 290))",
                    boxShadow:
                      !input.trim() || isLoading
                        ? "none"
                        : "0 0 12px oklch(0.52 0.25 260 / 0.4)",
                  }}
                >
                  {isLoading ? (
                    <RefreshCw
                      className="w-4 h-4 animate-spin"
                      style={{ color: "oklch(0.65 0.1 240)" }}
                    />
                  ) : (
                    <Send className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Keyframe for chat window entrance */}
      <style>{`
        @keyframes chatSlideIn {
          from { opacity: 0; transform: scale(0.9) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
}
