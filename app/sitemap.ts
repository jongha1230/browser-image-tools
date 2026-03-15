import type { MetadataRoute } from "next";

import { requiredRoutes, siteOrigin, siteUpdatedAt } from "@/lib/site-content";

function getPriority(path: (typeof requiredRoutes)[number]) {
  if (path === "/") {
    return 1;
  }

  if (path === "/tools" || path === "/guides") {
    return 0.9;
  }

  if (path.startsWith("/tools/")) {
    return 0.8;
  }

  if (path.startsWith("/guides/")) {
    return 0.7;
  }

  return 0.5;
}

function getChangeFrequency(
  path: (typeof requiredRoutes)[number],
): MetadataRoute.Sitemap[number]["changeFrequency"] {
  if (path === "/" || path === "/tools" || path === "/guides") {
    return "weekly";
  }

  if (path.startsWith("/tools/")) {
    return "weekly";
  }

  if (path.startsWith("/guides/")) {
    return "monthly";
  }

  return "monthly";
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(siteUpdatedAt);

  return requiredRoutes.map((path) => ({
    url: new URL(path, siteOrigin).toString(),
    lastModified,
    changeFrequency: getChangeFrequency(path),
    priority: getPriority(path),
  }));
}
