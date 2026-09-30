export class ApiResponseError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiResponseError";
    this.status = status;
  }
}

export async function responsePayload(response: Response) {
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
      : "Hollyway could not complete that request.";
  throw new ApiResponseError(message, response.status);
}
