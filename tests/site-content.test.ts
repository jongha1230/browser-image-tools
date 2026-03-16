import { describe, expect, it } from "vitest";

import {
  contactEmail,
  contactEmailHref,
  footerNav,
  guideRoutes,
  primaryNav,
  repositoryIssuesUrl,
  requiredRoutes,
  toolRoutes,
} from "../lib/site-content";
import {
  createPageMetadata,
  getPageMetadataEntry,
  pageMetadataCatalog,
} from "../lib/site-metadata";

describe("site content scaffold", () => {
  it("defines the required route skeletons", () => {
    expect(requiredRoutes).toEqual([
      "/",
      "/tools",
      "/tools/compress-image",
      "/tools/resize-image",
      "/tools/convert-image",
      "/tools/remove-exif",
      "/guides",
      "/guides/resize-or-compress-first",
      "/guides/transparent-image-conversion-checklist",
      "/guides/why-converted-images-get-larger",
      "/guides/batch-processing-preflight-checklist",
      "/guides/browser-local-image-processing-limits",
      "/guides/blog-cms-image-prep-checklist",
      "/guides/product-thumbnail-image-settings",
      "/guides/avoid-repeat-export-quality-loss",
      "/guides/when-png-is-the-wrong-choice",
      "/guides/blog-image-upload-final-checklist",
      "/guides/listing-image-resize-vs-compress",
      "/guides/detail-image-upload-mistakes",
      "/guides/batch-cleanup-before-product-upload",
      "/guides/image-compression-basics",
      "/guides/webp-vs-jpeg-vs-png",
      "/guides/remove-exif-for-privacy",
      "/guides/batch-resize-checklist",
      "/about",
      "/privacy",
      "/contact",
    ]);
  });

  it("keeps crawlable navigation focused on real routes", () => {
    expect(primaryNav.map((item) => item.href)).toEqual([
      "/tools",
      "/guides",
      "/about",
      "/privacy",
      "/contact",
    ]);
    expect(footerNav.map((item) => item.href)).toEqual([
      "/about",
      "/privacy",
      "/contact",
    ]);
  });

  it("publishes the public support contacts", () => {
    expect(contactEmail).toBe("browserimagetools@gmail.com");
    expect(contactEmailHref).toBe("mailto:browserimagetools@gmail.com");
    expect(repositoryIssuesUrl).toBe(
      "https://github.com/jongha1230/browser-image-tools/issues",
    );
  });

  it("keeps the launched tool routes unique", () => {
    expect(toolRoutes.map((tool) => tool.href)).toEqual([
      "/tools/compress-image",
      "/tools/resize-image",
      "/tools/convert-image",
      "/tools/remove-exif",
    ]);
    expect(new Set(toolRoutes.map((tool) => tool.title)).size).toBe(
      toolRoutes.length,
    );
  });

  it("publishes unique guide routes with related tools", () => {
    expect(guideRoutes.map((guide) => guide.href)).toEqual([
      "/guides/resize-or-compress-first",
      "/guides/transparent-image-conversion-checklist",
      "/guides/why-converted-images-get-larger",
      "/guides/batch-processing-preflight-checklist",
      "/guides/browser-local-image-processing-limits",
      "/guides/blog-cms-image-prep-checklist",
      "/guides/product-thumbnail-image-settings",
      "/guides/avoid-repeat-export-quality-loss",
      "/guides/when-png-is-the-wrong-choice",
      "/guides/blog-image-upload-final-checklist",
      "/guides/listing-image-resize-vs-compress",
      "/guides/detail-image-upload-mistakes",
      "/guides/batch-cleanup-before-product-upload",
      "/guides/image-compression-basics",
      "/guides/webp-vs-jpeg-vs-png",
      "/guides/remove-exif-for-privacy",
      "/guides/batch-resize-checklist",
    ]);
    expect(new Set(guideRoutes.map((guide) => guide.title)).size).toBe(
      guideRoutes.length,
    );

    for (const guide of guideRoutes) {
      expect(guide.relatedTools.length).toBeGreaterThan(0);
      expect(guide.relatedGuides.length).toBeGreaterThan(0);
      expect(
        guide.relatedTools.every((toolSlug) =>
          toolRoutes.some((tool) => tool.slug === toolSlug),
        ),
      ).toBe(true);
      expect(
        guide.relatedGuides.every((guideSlug) =>
          guideRoutes.some((entry) => entry.slug === guideSlug),
        ),
      ).toBe(true);
    }

    expect(guideRoutes.filter((guide) => guide.cluster === "cluster-02")).toHaveLength(4);
    expect(guideRoutes.filter((guide) => guide.cluster === "cluster-03")).toHaveLength(4);
  });

  it("covers every current route with unique metadata", () => {
    const entries = requiredRoutes.map((path) => getPageMetadataEntry(path));

    expect(Object.keys(pageMetadataCatalog)).toHaveLength(requiredRoutes.length);
    expect(new Set(entries.map((entry) => entry.title)).size).toBe(entries.length);
    expect(new Set(entries.map((entry) => entry.description)).size).toBe(entries.length);
  });

  it("omits canonical URLs until a real production origin is configured", () => {
    const metadata = createPageMetadata(getPageMetadataEntry("/tools"));

    expect(metadata.alternates).toBeUndefined();
    expect(metadata.openGraph).toMatchObject({
      title: "이미지 압축, 리사이즈, 변환, EXIF 제거 도구",
      description:
        "이미지 압축, 크기 조절, 포맷 변환, EXIF 제거 도구를 작업별로 고르고 브라우저에서 바로 처리할 수 있는 도구 허브입니다.",
      locale: "ko_KR",
      siteName: "브라우저 이미지 툴",
      type: "website",
    });
    expect(metadata.openGraph?.url).toBeUndefined();
    expect(metadata.robots).toMatchObject({
      index: false,
      follow: false,
    });
  });
});
