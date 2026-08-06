// ============================================================
// PROFIL PENGGUNA (localStorage) — tanpa login, tanpa database.
// ============================================================

export type Profile = {
  name: string;
  goal?: string;
};

const PROFILE_KEY = "rc_profile";

export function getProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Profile>;
    if (typeof parsed.name === "string" && parsed.name.trim().length > 0) {
      return { name: parsed.name.trim(), goal: parsed.goal ?? undefined };
    }
    return null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: Profile): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    /* abaikan */
  }
}
