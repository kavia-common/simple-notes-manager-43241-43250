type Flags = {
  markdownPreview: boolean;
};

function parseFlags(raw: string | undefined): Partial<Flags> {
  if (!raw) return {};
  try {
    // Support JSON object or comma-separated list of enabled keys
    if (raw.trim().startsWith('{')) {
      return JSON.parse(raw);
    }
    const set = new Set(raw.split(',').map(s => s.trim()).filter(Boolean));
    return {
      markdownPreview: set.has('markdownPreview'),
    };
  } catch {
    return {};
  }
}

/**
 * PUBLIC_INTERFACE
 * useFeatureFlags
 * Provides feature flags parsed from VITE_FEATURE_FLAGS with sensible defaults (SSR-safe).
 */
export function useFeatureFlags() {
  /** Provides feature flags parsed from VITE_FEATURE_FLAGS with sensible defaults. */
  const env = (import.meta as any).env || {};
  const base: Flags = {
    markdownPreview: true,
  };
  const fromEnv = parseFlags(env.VITE_FEATURE_FLAGS);
  return { ...base, ...fromEnv };
}
