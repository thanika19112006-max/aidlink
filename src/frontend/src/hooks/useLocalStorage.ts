/**
 * useLocalStorage — generic hook for localStorage with JSON serialization,
 * error handling, and cross-tab sync via "storage" events.
 *
 * Returns: [storedValue, setValue, clearValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Read current value synchronously (for SSR safety)
  const readValue = (): T => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return initialValue;
      return JSON.parse(item) as T;
    } catch {
      return initialValue;
    }
  };

  // We intentionally use a module-level ref pattern instead of useState
  // so callers must re-invoke the hook to get fresh values when needed.
  // For reactive state, use useLocalStorageState below.
  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const prev = readValue();
      const next =
        typeof value === "function" ? (value as (p: T) => T)(prev) : value;
      window.localStorage.setItem(key, JSON.stringify(next));
      // Dispatch storage event for cross-tab / cross-hook sync
      window.dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue: JSON.stringify(next),
          storageArea: window.localStorage,
        }),
      );
    } catch {
      // Quota exceeded or private browsing — silently ignore
    }
  };

  const clearValue = () => {
    try {
      window.localStorage.removeItem(key);
      window.dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue: null,
          storageArea: window.localStorage,
        }),
      );
    } catch {
      // ignore
    }
  };

  return [readValue(), setValue, clearValue];
}

// ─── Reactive version with useState + storage listener ────────────────────────
import { useCallback, useEffect, useState } from "react";

export function useLocalStorageState<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const readValue = useCallback((): T => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return initialValue;
      return JSON.parse(item) as T;
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const prev = readValue();
        const next =
          typeof value === "function" ? (value as (p: T) => T)(prev) : value;
        window.localStorage.setItem(key, JSON.stringify(next));
        setStoredValue(next);
        window.dispatchEvent(
          new StorageEvent("storage", {
            key,
            newValue: JSON.stringify(next),
            storageArea: window.localStorage,
          }),
        );
      } catch {
        // Quota exceeded or private browsing — silently ignore
      }
    },
    [key, readValue],
  );

  const clearValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      window.dispatchEvent(
        new StorageEvent("storage", {
          key,
          newValue: null,
          storageArea: window.localStorage,
        }),
      );
    } catch {
      // ignore
    }
  }, [key, initialValue]);

  // Sync across tabs / other hook instances
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== key || e.storageArea !== window.localStorage) return;
      setStoredValue(
        e.newValue !== null ? (JSON.parse(e.newValue) as T) : initialValue,
      );
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [key, initialValue]);

  return [storedValue, setValue, clearValue];
}

// ─── Stored user shape ─────────────────────────────────────────────────────────
export interface StoredUser {
  email: string;
  role: "ngo" | "volunteer";
  name: string;
  loggedInAt: string; // ISO timestamp
}

export const AIDLINK_USER_KEY = "aidlink_user";
export const AIDLINK_REMEMBER_KEY = "aidlink_remember";

/** Save the logged-in user to localStorage */
export function saveUser(user: StoredUser): void {
  try {
    window.localStorage.setItem(AIDLINK_USER_KEY, JSON.stringify(user));
  } catch {
    // ignore
  }
}

/** Read the currently saved user, or null */
export function getStoredUser(): StoredUser | null {
  try {
    const raw = window.localStorage.getItem(AIDLINK_USER_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

/** Clear the stored user session */
export function clearStoredUser(): void {
  try {
    window.localStorage.removeItem(AIDLINK_USER_KEY);
  } catch {
    // ignore
  }
}

// ─── Recent requests tracking ─────────────────────────────────────────────────
export interface RecentRequest {
  id: string;
  title: string;
  urgency: string;
  status: string;
  timestamp: string;
}

const RECENT_REQUESTS_KEY = "aidlink_recent_requests";
const MAX_RECENT = 10;

/** Prepend a request to the recent list (capped at 10). */
export function saveRecentRequest(request: RecentRequest): void {
  try {
    const existing = getRecentRequests();
    // Deduplicate by id, then prepend
    const filtered = existing.filter((r) => r.id !== request.id);
    const updated = [request, ...filtered].slice(0, MAX_RECENT);
    window.localStorage.setItem(RECENT_REQUESTS_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

/** Get the list of recent requests (most recent first). */
export function getRecentRequests(): RecentRequest[] {
  try {
    const raw = window.localStorage.getItem(RECENT_REQUESTS_KEY);
    return raw ? (JSON.parse(raw) as RecentRequest[]) : [];
  } catch {
    return [];
  }
}

/** Clear all stored recent requests. */
export function clearRecentRequests(): void {
  try {
    window.localStorage.removeItem(RECENT_REQUESTS_KEY);
  } catch {
    // ignore
  }
}
