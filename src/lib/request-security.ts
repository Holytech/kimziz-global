/** Compare browser Origin with the actual HTTP Host, including its port.
 * Next's internal request URL can use localhost behind a reverse proxy.
 * Browsers cannot override Host or Origin on a cross-site form submission.
 */
export function sameOrigin(
  origin: string | null,
  host: string | null,
): boolean {
  if (!origin || !host) return false;
  try {
    const url = new URL(origin);
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      url.host === host &&
      url.origin === origin
    );
  } catch {
    return false;
  }
}
