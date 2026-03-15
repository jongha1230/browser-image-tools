import type { Metadata } from "next";

import { siteDescription, siteName } from "@/lib/site-content";

export function buildMetadata(
  title: string,
  description: string,
): Metadata {
  return {
    title,
    description,
    applicationName: siteName,
    category: "technology",
    keywords: ["이미지 도구", "브라우저 처리", "이미지 압축", "이미지 변환"],
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
};

