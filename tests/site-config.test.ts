import { afterEach, describe, expect, it, vi } from "vitest";

const baseEnv = { ...process.env };

async function loadSiteModules(env: Record<string, string | undefined>) {
  vi.resetModules();
  process.env = {
    ...baseEnv,
    ...env,
  };

  const [siteConfig, siteMetadata, robotsModule, sitemapModule, rssModule, proxyModule] =
    await Promise.all([
      import("../lib/site-config"),
      import("../lib/site-metadata"),
      import("../app/robots"),
      import("../app/sitemap"),
      import("../app/rss.xml/route"),
      import("../proxy"),
    ]);

  return {
    proxy: proxyModule.proxy,
    robots: robotsModule.default,
    rss: rssModule.GET,
    siteConfig,
    siteMetadata,
    sitemap: sitemapModule.default,
  };
}

afterEach(() => {
  vi.resetModules();
  process.env = { ...baseEnv };
});

describe("site configuration", () => {
  it("prefers SITE_URL and uses the canonical custom origin across shared metadata routes", async () => {
    const { robots, rss, siteConfig, siteMetadata, sitemap } =
      await loadSiteModules({
        NEXT_PUBLIC_SITE_URL: "https://public.example.com/launch/?from=checklist",
        SITE_URL: "https://images.example.com/launch/?from=checklist",
      });

    expect(siteConfig.siteOrigin).toBe("https://images.example.com");
    expect(siteConfig.siteOriginSource).toBe("SITE_URL");
    expect(siteConfig.hasConfiguredSiteOrigin).toBe(true);
    expect(siteConfig.isSiteIndexable).toBe(true);
    expect(siteMetadata.rootMetadata.metadataBase?.toString()).toBe(
      "https://images.example.com/",
    );
    expect(siteMetadata.rootMetadata.alternates).toEqual({
      canonical: "https://images.example.com/",
      types: {
        "application/rss+xml": "https://images.example.com/rss.xml",
      },
    });

    const robotsEntry = robots();

    expect(robotsEntry.sitemap).toEqual(["https://images.example.com/sitemap.xml"]);
    expect(robotsEntry.host).toBe("images.example.com");

    const sitemapEntries = sitemap();

    expect(sitemapEntries[0]?.url).toBe("https://images.example.com/");
    expect(sitemapEntries[1]?.url).toBe("https://images.example.com/tools");

    const rssResponse = await rss();
    const rssXml = await rssResponse.text();

    expect(rssResponse.headers.get("x-robots-tag")).toBeNull();
    expect(rssXml).toContain("<link>https://images.example.com/guides</link>");
    expect(rssXml).toContain(
      "<atom:link href=\"https://images.example.com/rss.xml\" rel=\"self\" type=\"application/rss+xml\" />",
    );
  });

  it("falls back to a safe noindex mode when no canonical site origin is configured", async () => {
    const { proxy, robots, rss, siteConfig, siteMetadata, sitemap } =
      await loadSiteModules({
        NEXT_PUBLIC_SITE_URL: "",
        SITE_URL: "",
      });

    expect(siteConfig.siteOrigin).toBe("https://browser-image-tools.example");
    expect(siteConfig.siteOriginSource).toBe("fallback");
    expect(siteConfig.hasConfiguredSiteOrigin).toBe(false);
    expect(siteConfig.isSiteIndexable).toBe(false);
    expect(siteConfig.siteIndexingBlockReason).toBe("missing-site-url");
    expect(siteMetadata.rootMetadata.metadataBase).toBeUndefined();
    expect(siteMetadata.rootMetadata.alternates).toBeUndefined();
    expect(siteMetadata.rootMetadata.robots).toMatchObject({
      index: false,
      follow: false,
    });

    expect(robots()).toEqual({
      rules: [
        {
          userAgent: "*",
          disallow: "/",
        },
      ],
    });
    expect(sitemap()).toEqual([]);

    const proxyResponse = proxy({
      url: "https://browser-image-tools.vercel.app/tools",
      headers: new Headers({
        host: "browser-image-tools.vercel.app",
      }),
    } as never);

    expect(proxyResponse.headers.get("x-robots-tag")).toBe("noindex, nofollow");

    const rssResponse = await rss();

    expect(rssResponse.status).toBe(404);
    expect(rssResponse.headers.get("x-robots-tag")).toBe("noindex, nofollow");
  });

  it("keeps the default vercel hostname out of the index until a custom domain is configured", async () => {
    const { proxy, robots, siteConfig, siteMetadata } = await loadSiteModules({
      NEXT_PUBLIC_SITE_URL: "https://browser-image-tools.vercel.app",
      SITE_URL: undefined,
    });

    expect(siteConfig.hasConfiguredSiteOrigin).toBe(true);
    expect(siteConfig.siteOriginSource).toBe("NEXT_PUBLIC_SITE_URL");
    expect(siteConfig.usesVercelDefaultHostname).toBe(true);
    expect(siteConfig.isSiteIndexable).toBe(false);
    expect(siteConfig.siteIndexingBlockReason).toBe("vercel-hostname");
    expect(siteMetadata.rootMetadata.metadataBase).toBeUndefined();
    expect(siteConfig.getCanonicalRedirectUrl({
      requestUrl: "https://browser-image-tools.vercel.app/tools",
      requestHost: "browser-image-tools.vercel.app",
      deploymentEnvironment: "production",
    })).toBeNull();
    expect(robots()).toEqual({
      rules: [
        {
          userAgent: "*",
          disallow: "/",
        },
      ],
    });

    const proxyResponse = proxy({
      url: "https://browser-image-tools.vercel.app/tools/remove-exif",
      headers: new Headers({
        host: "browser-image-tools.vercel.app",
      }),
    } as never);

    expect(proxyResponse.headers.get("x-robots-tag")).toBe("noindex, nofollow");
  });

  it("builds production-only canonical redirects once a custom domain is configured", async () => {
    const { proxy, siteConfig } = await loadSiteModules({
      NEXT_PUBLIC_SITE_URL: "",
      SITE_URL: "https://images.example.com",
    });

    expect(siteConfig.getCanonicalRedirectUrl({
      requestUrl: "https://browser-image-tools.vercel.app/tools?mode=batch#results",
      requestHost: "browser-image-tools.vercel.app",
      deploymentEnvironment: "production",
    })).toBe("https://images.example.com/tools?mode=batch#results");

    expect(siteConfig.getCanonicalRedirectUrl({
      requestUrl: "https://browser-image-tools.vercel.app/tools?mode=batch#results",
      requestHost: "browser-image-tools.vercel.app",
      deploymentEnvironment: "preview",
    })).toBeNull();

    expect(siteConfig.getCanonicalRedirectUrl({
      requestUrl: "https://images.example.com/tools?mode=batch#results",
      requestHost: "images.example.com",
      deploymentEnvironment: "production",
    })).toBeNull();

    const proxyResponse = proxy({
      url: "https://images.example.com/tools",
      headers: new Headers({
        host: "images.example.com",
      }),
    } as never);

    expect(proxyResponse.headers.get("x-robots-tag")).toBeNull();
  });
});
