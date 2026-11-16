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
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    if (url.origin !== origin) return false;
    if (url.host === host) return true;

    // In local development, localhost and 127.0.0.1 on the same port are equivalent
    const isLocalOrigin =
      url.hostname === "localhost" || url.hostname === "127.0.0.1";
    const [hostName, hostPort = url.protocol === "https:" ? "443" : "80"] =
      host.split(":");
    const isLocalHost = hostName === "localhost" || hostName === "127.0.0.1";
    if (isLocalOrigin && isLocalHost) {
      const urlPort = url.port || (url.protocol === "https:" ? "443" : "80");
      return urlPort === hostPort;
    }

    return false;
  } catch {
    return false;
  }
}
