import type { GuideRoute } from "./site-content";
import { getIndexableSiteUrl } from "./site-config";

export type StructuredDataBreadcrumb = {
  label: string;
  href?: string;
};

export type StructuredDataNode = {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: unknown;
};

type BreadcrumbListInput = {
  breadcrumbs: readonly StructuredDataBreadcrumb[];
  currentPath: string;
};

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function getStructuredDataUrl(path: string) {
  return getIndexableSiteUrl(path);
}

export function createBreadcrumbListStructuredData({
  breadcrumbs,
  currentPath,
}: BreadcrumbListInput): StructuredDataNode | null {
  const currentUrl = getStructuredDataUrl(currentPath);

  if (!currentUrl || breadcrumbs.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((breadcrumb, index) => {
      const itemPath =
        breadcrumb.href ?? (index === breadcrumbs.length - 1 ? currentPath : null);
      const itemUrl = itemPath ? getStructuredDataUrl(itemPath) : null;

      return {
        "@type": "ListItem",
        position: index + 1,
        name: breadcrumb.label,
        ...(itemUrl ? { item: itemUrl } : {}),
      };
    }),
  };
}

function createGuideArticleBody(guide: GuideRoute) {
  return [
    guide.description,
    guide.intro,
    ...guide.focusPoints,
    ...guide.sections.flatMap((section) => [
      section.title,
      ...section.paragraphs,
      ...(section.bullets ?? []),
    ]),
  ]
    .map(normalizeText)
    .join("\n\n");
}

export function createGuideArticleStructuredData(
  guide: GuideRoute,
): StructuredDataNode | null {
  const canonicalUrl = getStructuredDataUrl(guide.href);

  if (!canonicalUrl) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    url: canonicalUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    inLanguage: "ko-KR",
    articleSection: guide.categoryLabel,
    articleBody: createGuideArticleBody(guide),
  };
}
