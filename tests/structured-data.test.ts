import { afterEach, describe, expect, it, vi } from "vitest";

import { getGuideRoute } from "../lib/site-content";

const baseEnv = { ...process.env };

async function loadStructuredData(env: Record<string, string | undefined>) {
  vi.resetModules();
  process.env = {
    ...baseEnv,
    ...env,
  };

  return import("../lib/structured-data");
}

afterEach(() => {
  vi.resetModules();
  process.env = { ...baseEnv };
});

describe("structured data", () => {
  it("builds breadcrumb schema from canonical route URLs", async () => {
    const { createBreadcrumbListStructuredData } = await loadStructuredData({
      SITE_URL: "https://images.example.com",
      NEXT_PUBLIC_SITE_URL: "https://images.example.com",
    });

    expect(
      createBreadcrumbListStructuredData({
        breadcrumbs: [
          { href: "/", label: "홈" },
          { href: "/tools", label: "도구" },
          { label: "압축" },
        ],
        currentPath: "/tools/compress-image",
      }),
    ).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "홈",
          item: "https://images.example.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "도구",
          item: "https://images.example.com/tools",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "압축",
          item: "https://images.example.com/tools/compress-image",
        },
      ],
    });
  });

  it("builds article schema from visible guide copy", async () => {
    const { createGuideArticleStructuredData } = await loadStructuredData({
      SITE_URL: "https://images.example.com",
      NEXT_PUBLIC_SITE_URL: "https://images.example.com",
    });
    const guide = getGuideRoute("image-compression-basics");
    const schema = createGuideArticleStructuredData(guide);

    expect(schema).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      url: "https://images.example.com/guides/image-compression-basics",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://images.example.com/guides/image-compression-basics",
      },
      inLanguage: "ko-KR",
      articleSection: guide.categoryLabel,
    });
    expect(schema?.articleBody).toContain(guide.intro);
    expect(schema?.articleBody).toContain(guide.sections[0]?.title);
    expect(schema?.articleBody).toContain(guide.sections[0]?.paragraphs[0]);
  });

  it("skips structured data when the site is not indexable", async () => {
    const {
      createBreadcrumbListStructuredData,
      createGuideArticleStructuredData,
    } = await loadStructuredData({
      SITE_URL: "",
      NEXT_PUBLIC_SITE_URL: "",
    });

    expect(
      createBreadcrumbListStructuredData({
        breadcrumbs: [
          { href: "/", label: "홈" },
          { href: "/guides", label: "가이드" },
          { label: "이미지 압축 기초" },
        ],
        currentPath: "/guides/image-compression-basics",
      }),
    ).toBeNull();
    expect(
      createGuideArticleStructuredData(getGuideRoute("image-compression-basics")),
    ).toBeNull();
  });
});
