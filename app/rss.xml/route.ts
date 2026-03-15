import { guideRoutes, siteDescription, siteName, siteOrigin, siteUpdatedAt } from "@/lib/site-content";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const feedUrl = `${siteOrigin}/rss.xml`;
  const siteUrl = `${siteOrigin}/guides`;
  const latestUpdate = new Date(siteUpdatedAt).toUTCString();
  const items = guideRoutes
    .map(
      (guide) => `
        <item>
          <title>${escapeXml(guide.title)}</title>
          <description>${escapeXml(guide.description)}</description>
          <link>${siteOrigin}${guide.href}</link>
          <guid>${siteOrigin}${guide.href}</guid>
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
