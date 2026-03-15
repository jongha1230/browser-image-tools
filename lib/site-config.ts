const fallbackSiteOrigin = "https://browser-image-tools.example";

export type SiteOriginSource = "SITE_URL" | "NEXT_PUBLIC_SITE_URL" | "fallback";
export type SiteIndexingBlockReason = "missing-site-url" | "vercel-hostname" | null;

type CanonicalRedirectInput = {
  requestUrl: string;
  requestHost?: string | null;
  deploymentEnvironment?: string;
};

function normalizeSiteOrigin(value: string | undefined) {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return null;
  }

  const candidateValue = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`;

  try {
    const url = new URL(candidateValue);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
}

function getConfiguredSiteOrigin() {
  const envCandidates = [
    ["SITE_URL", process.env.SITE_URL],
    ["NEXT_PUBLIC_SITE_URL", process.env.NEXT_PUBLIC_SITE_URL],
  ] as const;

  for (const [source, value] of envCandidates) {
    const normalizedOrigin = normalizeSiteOrigin(value);

    if (normalizedOrigin) {
      return {
        origin: normalizedOrigin,
        source,
      };
    }
  }

  return null;
}

function normalizeHost(value: string | null | undefined) {
  const firstHost = value?.split(",")[0]?.trim().toLowerCase();

  return firstHost ? firstHost : null;
}

const configuredSiteOrigin = getConfiguredSiteOrigin();

export const siteOrigin = configuredSiteOrigin?.origin ?? fallbackSiteOrigin;
export const siteOriginUrl = new URL(siteOrigin);
export const siteOriginSource: SiteOriginSource =
  configuredSiteOrigin?.source ?? "fallback";
export const hasConfiguredSiteOrigin = configuredSiteOrigin !== null;
export const usesVercelDefaultHostname =
  siteOriginUrl.hostname.endsWith(".vercel.app");
export const isSiteIndexable =
  hasConfiguredSiteOrigin && !usesVercelDefaultHostname;
export const siteRobotsHeaderValue = isSiteIndexable ? null : "noindex, nofollow";
export const shouldRedirectToCanonicalHost = isSiteIndexable;
export const siteIndexingBlockReason: SiteIndexingBlockReason = !hasConfiguredSiteOrigin
  ? "missing-site-url"
  : usesVercelDefaultHostname
    ? "vercel-hostname"
    : null;

export function getAbsoluteSiteUrl(path = "/") {
  return new URL(path, siteOriginUrl).toString();
}

export function getIndexableSiteUrl(path = "/") {
  return isSiteIndexable ? getAbsoluteSiteUrl(path) : null;
}

export function getCanonicalRedirectUrl({
  requestUrl,
  requestHost,
  deploymentEnvironment,
}: CanonicalRedirectInput) {
  if (!shouldRedirectToCanonicalHost || deploymentEnvironment !== "production") {
    return null;
  }

  const incomingUrl = new URL(requestUrl);
  const incomingHost = normalizeHost(requestHost) ?? incomingUrl.host.toLowerCase();

  if (incomingHost === siteOriginUrl.host.toLowerCase()) {
    return null;
  }

  const redirectUrl = new URL(incomingUrl.pathname, siteOriginUrl);
  redirectUrl.search = incomingUrl.search;
  redirectUrl.hash = incomingUrl.hash;

  return redirectUrl.toString();
}
