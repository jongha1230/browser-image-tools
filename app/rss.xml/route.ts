import { guideRoutes, siteDescription, siteName, siteUpdatedAt } from "@/lib/site-content";
import { getAbsoluteSiteUrl, isSiteIndexable } from "@/lib/site-config";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  if (!isSiteIndexable) {
    return new Response("Not Found", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-robots-tag": "noindex, nofollow",
      },
    });
  }

  const feedUrl = getAbsoluteSiteUrl("/rss.xml");
  const siteUrl = getAbsoluteSiteUrl("/guides");
  const latestUpdate = new Date(siteUpdatedAt).toUTCString();
  const items = guideRoutes
    .map(
      (guide) => `
        <item>
          <title>${escapeXml(guide.title)}</title>
          <description>${escapeXml(guide.description)}</description>
          <link>${getAbsoluteSiteUrl(guide.href)}</link>
          <guid>${getAbsoluteSiteUrl(guide.href)}</guid>
          <pubDate>${new Date(guide.publishedAt).toUTCString()}</pubDate>
        </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)} 가이드</title>
    <description>${escapeXml(siteDescription)}</description>
    <link>${siteUrl}</link>
    <language>ko-KR</language>
    <lastBuildDate>${latestUpdate}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
