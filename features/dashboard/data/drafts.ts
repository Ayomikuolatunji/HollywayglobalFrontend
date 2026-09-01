export const userDraftsStorageKey = "hollyway-user-drafts";

export type UserDraft = {
  type: string;
  createdAt: string;
  reference?: string;
  values?: Record<string, string>;
  featuredPostPackage?: string;
  featuredPostAmount?: number;
};

export function getDraftValues(form: HTMLFormElement) {
  const values: Record<string, string> = {};
  new FormData(form).forEach((value, key) => {
    const current = typeof value === "string" ? value : value.name;
    values[key] = values[key] ? `${values[key]}, ${current}` : current;
  });
  return values;
}

export function saveUserDraft(type: string, metadata: Pick<UserDraft, "reference" | "values" | "featuredPostPackage" | "featuredPostAmount"> = {}) {
  if (typeof window === "undefined") return;
  const saved = window.localStorage.getItem(userDraftsStorageKey);
  let drafts: UserDraft[] = [];
  try {
    drafts = saved ? (JSON.parse(saved) as UserDraft[]) : [];
  } catch {
    drafts = [];
  }
  drafts.push({ type, createdAt: new Date().toISOString(), ...metadata });
  window.localStorage.setItem(userDraftsStorageKey, JSON.stringify(drafts));
}
