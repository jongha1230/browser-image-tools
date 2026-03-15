const fallbackSiteOrigin = "https://browser-image-tools.example";

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

const configuredSiteOrigin = normalizeSiteOrigin(
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL,
);

export const siteOrigin = configuredSiteOrigin ?? fallbackSiteOrigin;
export const siteOriginUrl = new URL(siteOrigin);
export const hasConfiguredSiteOrigin = configuredSiteOrigin !== null;
export const usesVercelDefaultHostname =
  siteOriginUrl.hostname.endsWith(".vercel.app");
export const isSiteIndexable =
  hasConfiguredSiteOrigin && !usesVercelDefaultHostname;
export const siteIndexingBlockReason = !hasConfiguredSiteOrigin
  ? "missing-site-url"
  : usesVercelDefaultHostname
    ? "vercel-hostname"
    : null;

export function getAbsoluteSiteUrl(path = "/") {
  return new URL(path, siteOriginUrl).toString();
}

