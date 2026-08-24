export const userDraftsStorageKey = "hollyway-user-drafts";

export type UserDraft = { type: string; createdAt: string };

export function saveUserDraft(type: string) {
  if (typeof window === "undefined") return;
  const saved = window.localStorage.getItem(userDraftsStorageKey);
  let drafts: UserDraft[] = [];
  try {
    drafts = saved ? (JSON.parse(saved) as UserDraft[]) : [];
  } catch {
    drafts = [];
  }
  drafts.push({ type, createdAt: new Date().toISOString() });
  window.localStorage.setItem(userDraftsStorageKey, JSON.stringify(drafts));
}
