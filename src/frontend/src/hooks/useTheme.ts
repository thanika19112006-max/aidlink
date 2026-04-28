/** AidLink always uses dark mode. This hook is kept for compatibility but
 *  theme switching is disabled — the app is permanently in dark mode. */
export function useTheme() {
  return {
    theme: "dark" as const,
    toggleTheme: () => {
      /* no-op: dark mode is fixed */
    },
    isDark: true,
  };
}

/** Initialize dark mode on the document root — call once at app root */
export function initTheme() {
  document.documentElement.classList.add("dark");
}
