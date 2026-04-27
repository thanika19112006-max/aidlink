// Re-export backend types for convenient frontend imports
export type {
  NGO,
  Volunteer,
  ResourceRequest,
  Assignment,
  ChatMessage,
  CreateRequestInput,
  CreateNGOInput,
  CreateVolunteerInput,
  NgoId,
  VolunteerId,
  RequestId,
  AssignmentId,
  Timestamp,
} from "./backend";

export {
  AssignmentStatus,
  ChatRole,
  RequestStatus,
  ResourceType,
  Urgency,
} from "./backend";

// UI-facing form types
export interface RequestFormData {
  title: string;
  description: string;
  resourceType: string;
  urgency: string;
  quantity: number;
  lat: number;
  lng: number;
  ngoId: string;
  deadline: string;
}

export interface NGOFormData {
  name: string;
  description: string;
  contactEmail: string;
  lat: number;
  lng: number;
}

export interface VolunteerFormData {
  name: string;
  skills: string[];
  lat: number;
  lng: number;
}

// Chat UI types
export interface ChatUIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

// Map marker type
export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type: "request" | "ngo" | "volunteer";
  label: string;
  urgency?: string;
  status?: string;
}

// Dashboard stats
export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  ongoingRequests: number;
  completedRequests: number;
  activeVolunteers: number;
  totalNGOs: number;
}

// User profile types (matches backend UserProfile)
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  profilePhotoUrl: string | null;
  preferredRole: string;
  notificationEmail: boolean;
  notificationTaskReminders: boolean;
  notificationRequestUpdates: boolean;
  lastLoginAt: number;
  createdAt: number;
}

export interface UserProfileUpdate {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  profilePhotoUrl?: string | null;
  preferredRole?: string;
  notificationEmail?: boolean;
  notificationTaskReminders?: boolean;
  notificationRequestUpdates?: boolean;
}

export interface UserActivity {
  id: number;
  userId: string;
  action: string;
  description: string;
  timestamp: number;
}

export interface SavedRequest {
  id: string;
  title: string;
  description: string;
  urgency: string;
  status: string;
  savedAt: number;
}
