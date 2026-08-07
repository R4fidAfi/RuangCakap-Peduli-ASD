// ============================================================
// AKUN LOKAL (localStorage) — halaman login sebagai gerbang.
// Sesuai aturan lomba: tanpa backend/database sendiri, semua
// data akun tersimpan di browser pengguna.
// ============================================================

export type Profile = {
  name: string;
  /** PIN 4 digit (validasi lokal). */
  pin?: string;
  avatarId?: string;
  goal?: string;
  createdAt?: string;
  lastLogin?: string;
};

export const AVATAR_IDS = ["sage", "mist", "teal", "sun", "forest"] as const;
export type AvatarId = (typeof AVATAR_IDS)[number];

const PROFILE_KEY = "rc_profile";

export function getProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Profile>;
    if (typeof parsed.name === "string" && parsed.name.trim().length > 0) {
      return {
        name: parsed.name.trim(),
        pin: parsed.pin,
        avatarId: parsed.avatarId,
        goal: parsed.goal ?? undefined,
        createdAt: parsed.createdAt,
        lastLogin: parsed.lastLogin,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return getProfile() !== null;
}

export function saveProfile(profile: Profile): void {
  if (typeof window === "undefined") return;
  const existing = getProfile();
  const now = new Date().toISOString();
  const merged: Profile = {
    ...existing,
    ...profile,
    name: profile.name.trim(),
    createdAt: existing?.createdAt ?? now,
    lastLogin: now,
  };
  try {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(merged));
  } catch {
    /* abaikan */
  }
}

/** Logout: hapus akun lokal. */
export function clearProfile(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PROFILE_KEY);
  } catch {
    /* abaikan */
  }
}
