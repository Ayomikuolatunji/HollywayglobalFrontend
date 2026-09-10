import { getCustomerApiBaseUrl } from "../../../components/config/customerApi";

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
  id: number;
  reference: string;
  category: string;
  subject: string;
  message: string;
  related_reference?: string | null;
  status: "open" | "in_progress" | "resolved" | "closed";
  support_response?: string | null;
  created_at?: string;
  updated_at?: string;
};

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
      : "Help request could not be completed.";
  throw new HelpApiError(message, response.status);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
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
  return Array.isArray(data.tickets) ? (data.tickets as HelpTicket[]) : [];
}

export async function createSupportTicket(input: {
  category: string;
  subject: string;
  message: string;
  relatedReference?: string;
}): Promise<HelpTicket> {
  const response = await fetch(`${getCustomerApiBaseUrl()}/api/v1/help/tickets`, {
    method: "POST",
    credentials: "include",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      category: input.category,
      subject: input.subject,
      message: input.message,
      related_reference: input.relatedReference || null,
    }),
  });
  const payload = await responsePayload(response);
  return payload.data as HelpTicket;
}
