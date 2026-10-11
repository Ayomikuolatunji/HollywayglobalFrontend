import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";
import { apiFetch } from "../../../components/api/apiFetch";

export const supportAttachmentAccept = "image/jpeg,image/png,image/webp,application/pdf";
export const maxSupportAttachments = 5;
export const maxSupportAttachmentBytes = 10_000_000;

export type HelpCategory = {
  id: string;
  label: string;
  description: string;
};

export type HelpArticle = {
  id: string;
  category: string;
  title: string;
  summary: string;
  body: string;
  keywords: string[];
};

export type HelpContent = {
  categories: HelpCategory[];
  articles: HelpArticle[];
};

export type HelpTicket = {
  id: string;
  reference: string;
  category: string;
  subject: string;
  message: string;
  related_reference?: string | null;
  status: "open" | "in_progress" | "resolved" | "closed";
  support_response?: string | null;
  attachments?: HelpAttachment[];
  created_at?: string;
  updated_at?: string;
};

export type HelpAttachment = {
  id: string;
  name: string;
  mime_type: string;
  byte_size: number;
};

export function validateSupportAttachments(files: File[]): string {
  if (files.length > maxSupportAttachments) {
    return `Attach no more than ${maxSupportAttachments} files.`;
  }
  const invalidType = files.find(
    (file) => !["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(file.type),
  );
  if (invalidType) return `${invalidType.name} must be a JPG, PNG, WEBP or PDF file.`;
  const oversized = files.find((file) => file.size > maxSupportAttachmentBytes);
  if (oversized) return `${oversized.name} must be 10 MB or smaller.`;
  if (files.reduce((total, file) => total + file.size, 0) > maxSupportAttachmentBytes * 2) {
    return "Attachments must be 20 MB or smaller in total.";
  }
  return "";
}

export class HelpApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "HelpApiError";
    this.status = status;
  }
}

async function responsePayload(response: Response) {
  const payload = (await response.json().catch(() => ({}))) as {
    detail?: unknown;
    data?: unknown;
    message?: unknown;
  };
  if (response.ok) return payload;
  const detail = payload.detail;
  const message = Array.isArray(detail)
    ? detail
        .map((item) =>
          item && typeof item === "object" && "msg" in item ? String(item.msg) : "",
        )
        .filter(Boolean)[0]
    : typeof detail === "string"
      ? detail
      : typeof payload.message === "string"
        ? payload.message
        : "Help request could not be completed.";
  throw new HelpApiError(message, response.status);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function parseAttachments(value: unknown): HelpAttachment[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!isRecord(item)) return [];
    return [{
      id: String(item.id || ""),
      name: String(item.name || "attachment"),
      mime_type: String(item.mime_type || "application/octet-stream"),
      byte_size: typeof item.byte_size === "number" ? item.byte_size : 0,
    }];
  });
}

function parseContent(value: unknown): HelpContent {
  const source = isRecord(value) ? value : {};
  const categories = Array.isArray(source.categories)
    ? source.categories.filter(isRecord).map((category) => ({
        id: String(category.id || "other"),
        label: String(category.label || "Other"),
        description: String(category.description || "Hollyway support guidance."),
      }))
    : [];
  const articles = Array.isArray(source.articles)
    ? source.articles.filter(isRecord).map((article) => ({
        id: String(article.id || "article"),
        category: String(article.category || "other"),
        title: String(article.title || "Hollyway help"),
        summary: String(article.summary || ""),
        body: String(article.body || ""),
        keywords: Array.isArray(article.keywords) ? article.keywords.map(String) : [],
      }))
    : [];
  return { categories, articles };
}

export async function fetchHelpContent(signal?: AbortSignal): Promise<HelpContent> {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/help`, {
    credentials: "include",
    headers: { Accept: "application/json" },
    signal,
  });
  const payload = await responsePayload(response);
  return parseContent(payload.data);
}

export async function fetchSupportTickets(signal?: AbortSignal): Promise<HelpTicket[]> {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/help/tickets`, {
    credentials: "include",
    headers: { Accept: "application/json" },
    signal,
  });
  const payload = await responsePayload(response);
  const data = isRecord(payload.data) ? payload.data : {};
  if (!Array.isArray(data.tickets)) return [];
  return data.tickets.flatMap((item) => {
    if (!isRecord(item)) return [];
    return [{
      ...(item as HelpTicket),
      attachments: parseAttachments(item.attachments),
    }];
  });
}

export async function createSupportTicket(input: {
  category: string;
  subject: string;
  message: string;
  relatedReference?: string;
  attachments?: File[];
}): Promise<HelpTicket> {
  const form = new FormData();
  form.set("category", input.category);
  form.set("subject", input.subject);
  form.set("message", input.message);
  form.set("related_reference", input.relatedReference || "");
  for (const attachment of input.attachments || []) {
    form.append("attachments", attachment, attachment.name);
  }
  const response = await apiFetch(
    `${getCustomerApiBaseUrl()}/api/v1/help/tickets`,
    {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json" },
      body: form,
    },
    {
      successMessage: "Support request sent successfully.",
      errorMessage: "Support request could not be sent. Please try again.",
    },
  );
  const payload = await responsePayload(response);
  const ticket = (payload.data || {}) as HelpTicket & { attachments?: unknown };
  return { ...ticket, attachments: parseAttachments(ticket.attachments) };
}
