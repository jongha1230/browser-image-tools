import type { MetadataRoute } from "next";

import { getAbsoluteSiteUrl, isSiteIndexable, siteOriginUrl } from "@/lib/site-config";

export default function robots(): MetadataRoute.Robots {
  if (!isSiteIndexable) {
    return {
      rules: [
        {
          userAgent: "*",
          disallow: "/",
        },
      ],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: [getAbsoluteSiteUrl("/sitemap.xml")],
    host: siteOriginUrl.host,
  };
}
