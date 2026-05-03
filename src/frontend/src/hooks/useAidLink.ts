import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  ChatMessage,
  CreateRequestInput,
  ResourceRequest,
} from "../backend";
import { RequestStatus, ResourceType, Urgency } from "../backend";
import type {
  SavedRequest,
  UserActivity,
  UserProfile,
  UserProfileUpdate,
} from "../types";

const STALE_TIME = 30_000;

function useBackendActor() {
  return useActor(createActor);
}

// ─── Extended actor interface for new methods ─────────────────────────────────
interface ExtendedActor {
  getUserProfile?: (userId: string) => Promise<UserProfile | null>;
  updateUserProfile?: (
    userId: string,
    update: UserProfileUpdate,
  ) => Promise<boolean>;
  getUserActivity?: (userId: string, limit: bigint) => Promise<UserActivity[]>;
  saveRequest?: (userId: string, requestId: string) => Promise<boolean>;
  getSavedRequests?: (userId: string) => Promise<SavedRequest[]>;
  getRecentVolunteers?: (
    limit: bigint,
  ) => Promise<import("../backend").Volunteer[]>;
}

// ─── Existing hooks ────────────────────────────────────────────────────────────

export function useRequests() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<ResourceRequest[]>({
    queryKey: ["requests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRequests();
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_TIME,
  });
}

// ─── Fallback NGO seed data (shown when backend returns empty) ────────────────
const FALLBACK_NGOS = [
  {
    id: BigInt(1),
    name: "Global Relief Foundation",
    isVerified: true,
    description: "Emergency relief worldwide",
    contactEmail: "contact@globalrelief.org",
    lat: 51.5074,
    lng: -0.1278,
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(2),
    name: "HungerFree Alliance",
    isVerified: true,
    description: "Fighting food insecurity",
    contactEmail: "info@hungerfree.org",
    lat: 40.7128,
    lng: -74.006,
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(3),
    name: "MedReach International",
    isVerified: true,
    description: "Healthcare for underserved communities",
    contactEmail: "help@medreach.org",
    lat: 48.8566,
    lng: 2.3522,
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(4),
    name: "ShelterNow",
    isVerified: true,
    description: "Housing and shelter solutions",
    contactEmail: "info@shelternow.org",
    lat: 34.0522,
    lng: -118.2437,
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(5),
    name: "EduBridge",
    isVerified: true,
    description: "Education access for all",
    contactEmail: "connect@edubridge.org",
    lat: 1.3521,
    lng: 103.8198,
    createdAt: BigInt(Date.now()),
  },
] as const;

// Track whether initSeedData has been called in this browser session
let seedDataInitialized = false;

export function useInitSeedData() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      await actor.initSeedData();
      seedDataInitialized = true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ngos"] });
    },
  });
}

export function useNGOs() {
  const { actor, isFetching } = useBackendActor();
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["ngos"],
    queryFn: async () => {
      if (!actor) return [...FALLBACK_NGOS];
      try {
        const result = await actor.getAllNGOs();
        if (!result || result.length === 0) {
          // Seed data only once per session; show fallback while seeding
          if (!seedDataInitialized) {
            seedDataInitialized = true;
            actor
              .initSeedData()
              .then(() => {
                queryClient.invalidateQueries({ queryKey: ["ngos"] });
              })
              .catch(() => {
                // Seed may already exist — safe to ignore
              });
          }
          return [...FALLBACK_NGOS];
        }
        return result;
      } catch {
        return [...FALLBACK_NGOS];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_TIME,
    refetchInterval: 5000,
    // Show fallback data immediately while actor loads
    placeholderData: [...FALLBACK_NGOS],
  });
}

export function useVolunteers() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["volunteers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVolunteers();
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_TIME,
  });
}

export function useAvailableVolunteers() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["volunteers", "available"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAvailableVolunteers();
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_TIME,
  });
}

export function useAssignments() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["assignments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAssignments();
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_TIME,
  });
}

export function useNearbyRequests(lat: number, lng: number, radiusKm: number) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<ResourceRequest[]>({
    queryKey: ["requests", "nearby", lat, lng, radiusKm],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNearbyRequests(lat, lng, radiusKm);
    },
    enabled: !!actor && !isFetching && lat !== 0 && lng !== 0,
    staleTime: STALE_TIME,
  });
}

export function useCreateRequest() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateRequestInput) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createRequest(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

export function useUpdateRequestStatus() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      requestId,
      status,
    }: { requestId: bigint; status: RequestStatus }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateRequestStatus(requestId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

export function useAssignVolunteer() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      requestId,
      volunteerId,
    }: { requestId: bigint; volunteerId: bigint }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.assignVolunteer(requestId, volunteerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

export function useRegisterNGO() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      name: string;
      description: string;
      contactEmail: string;
      lat: number;
      lng: number;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.registerNGO(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ngos"] });
    },
  });
}

export function useRegisterVolunteer() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      name: string;
      skills: string[];
      lat: number;
      lng: number;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.registerVolunteer(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["volunteers"] });
    },
  });
}

export function useSendChatMessage() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (messages: ChatMessage[]) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.sendChatMessage(messages);
    },
  });
}

interface ActorWithMapKey {
  getMapApiKey?: () => Promise<string>;
}

export function useMapApiKey() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<string>({
    queryKey: ["mapApiKey"],
    queryFn: async () => {
      const a = actor as (typeof actor & ActorWithMapKey) | null;
      if (!a || typeof a.getMapApiKey !== "function") return "";
      try {
        return await a.getMapApiKey();
      } catch {
        return "";
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: Number.POSITIVE_INFINITY,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

// ─── New profile & volunteer hooks ────────────────────────────────────────────

export function useUserProfile(userId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile", userId],
    queryFn: async () => {
      const a = actor as (typeof actor & ExtendedActor) | null;
      if (!a || typeof a.getUserProfile !== "function") return null;
      try {
        return await a.getUserProfile(userId);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!userId,
    staleTime: STALE_TIME,
  });
}

export function useUpdateUserProfile() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      update,
    }: { userId: string; update: UserProfileUpdate }) => {
      const a = actor as (typeof actor & ExtendedActor) | null;
      if (!a || typeof a.updateUserProfile !== "function") {
        throw new Error("updateUserProfile not available");
      }
      return a.updateUserProfile(userId, update);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["userProfile", variables.userId],
      });
    },
  });
}

export function useUserActivity(userId: string, limit = 20) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<UserActivity[]>({
    queryKey: ["userActivity", userId, limit],
    queryFn: async () => {
      const a = actor as (typeof actor & ExtendedActor) | null;
      if (!a || typeof a.getUserActivity !== "function") return [];
      try {
        return await a.getUserActivity(userId, BigInt(limit));
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!userId,
    staleTime: STALE_TIME,
  });
}

export function useSaveRequest() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      requestId,
    }: { userId: string; requestId: string }) => {
      const a = actor as (typeof actor & ExtendedActor) | null;
      if (!a || typeof a.saveRequest !== "function") {
        throw new Error("saveRequest not available");
      }
      return a.saveRequest(userId, requestId);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["savedRequests", variables.userId],
      });
    },
  });
}

export function useGetSavedRequests(userId: string) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<SavedRequest[]>({
    queryKey: ["savedRequests", userId],
    queryFn: async () => {
      const a = actor as (typeof actor & ExtendedActor) | null;
      if (!a || typeof a.getSavedRequests !== "function") return [];
      try {
        return await a.getSavedRequests(userId);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!userId,
    staleTime: STALE_TIME,
  });
}

export function useRecentVolunteers(limit = 6) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["volunteers", "recent", limit],
    queryFn: async () => {
      const a = actor as (typeof actor & ExtendedActor) | null;
      if (!a || typeof a.getRecentVolunteers !== "function") {
        // Fallback: get all volunteers and take the most recent ones
        if (!actor) return [];
        const all = await actor.getAllVolunteers();
        return all.slice(0, limit);
      }
      try {
        return await a.getRecentVolunteers(BigInt(limit));
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: STALE_TIME,
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function stringToUrgency(val: string): Urgency {
  const map: Record<string, Urgency> = {
    low: Urgency.low,
    medium: Urgency.medium,
    high: Urgency.high,
    critical: Urgency.critical,
  };
  return map[val] ?? Urgency.medium;
}

export function stringToResourceType(val: string): ResourceType {
  const map: Record<string, ResourceType> = {
    food: ResourceType.food,
    medical: ResourceType.medical,
    shelter: ResourceType.shelter,
    education: ResourceType.education,
    other: ResourceType.other,
  };
  return map[val] ?? ResourceType.other;
}

export { RequestStatus, Urgency, ResourceType };
