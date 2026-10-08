// Shared helpers for safely following a link that comes from backend data.

// An internal path is an in-app route the SPA router can handle directly,
// e.g. "/about/association". A path starting with "//" is protocol-relative
// and still leaves the app, so it does NOT count as internal.
export function isInternalPath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//");
}

// Only allow http/https for an external redirect — guards against a stray
// javascript:, data:, or other unexpected scheme ending up in backend data
// and being opened directly.
export function isSafeExternalUrl(path: string): boolean {
  try {
    const url = new URL(path);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function openExternalSafely(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}
