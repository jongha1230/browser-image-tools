import { describe, expect, it } from "vitest";

import { footerNav, primaryNav, requiredRoutes, toolRoutes } from "../lib/site-content";
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

  it("covers every current route with unique metadata", () => {
    const entries = requiredRoutes.map((path) => getPageMetadataEntry(path));

    expect(Object.keys(pageMetadataCatalog)).toHaveLength(requiredRoutes.length);
    expect(new Set(entries.map((entry) => entry.title)).size).toBe(entries.length);
    expect(new Set(entries.map((entry) => entry.description)).size).toBe(entries.length);
  });

  it("builds canonical and OG defaults from route metadata", () => {
    const metadata = createPageMetadata(getPageMetadataEntry("/tools"));

    expect(metadata.alternates).toEqual({ canonical: "/tools" });
    expect(metadata.openGraph).toMatchObject({
      title: "도구 모음",
      description:
        "이미지 압축, 크기 조절, 포맷 변환, EXIF 제거 도구를 실제 라우트로 모아 둔 허브 페이지입니다.",
      locale: "ko_KR",
      siteName: "브라우저 이미지 툴",
      type: "website",
    });
    expect(metadata.openGraph?.url?.toString()).toBe(
      "https://browser-image-tools.example/tools",
    );
  });
});
