import type { Metadata } from "next";

import {
  requiredRoutes,
  siteDescription,
  siteName,
  siteOrigin,
  toolRoutes,
} from "./site-content";

type SitePath = (typeof requiredRoutes)[number];

type PageMetadataEntry = {
  title: string;
  description: string;
};

type PageMetadataInput = PageMetadataEntry & {
  path: SitePath;
};

const defaultKeywords = [
  "이미지 도구",
  "브라우저 처리",
  "이미지 압축",
  "이미지 변환",
  "EXIF 제거",
] as const;

const toolPageMetadataEntries = Object.fromEntries(
  toolRoutes.map((tool) => [
    tool.href,
    {
      title: tool.title,
      description: tool.metadataDescription,
    },
  ]),
) as Record<(typeof toolRoutes)[number]["href"], PageMetadataEntry>;

export const pageMetadataCatalog: Record<SitePath, PageMetadataEntry> = {
  "/": {
    title: "홈",
    description:
      "브라우저 안에서 이미지 압축, 크기 조절, 포맷 변환, EXIF 제거 흐름을 살펴보는 한국어 중심 이미지 도구 홈입니다.",
  },
  "/tools": {
    title: "도구 모음",
    description:
      "이미지 압축, 크기 조절, 포맷 변환, EXIF 제거 도구를 실제 라우트로 모아 둔 허브 페이지입니다.",
  },
  "/guides": {
    title: "가이드",
    description:
      "이미지 최적화, 포맷 선택, 개인정보 보호 흐름을 다룰 한국어 가이드 허브 페이지입니다.",
  },
  "/about": {
    title: "소개",
    description:
      "브라우저 로컬 처리 원칙과 한국어 중심 이미지 유틸리티 서비스 방향을 소개하는 페이지입니다.",
  },
  "/privacy": {
    title: "개인정보 처리방침",
    description:
      "브라우저 로컬 처리 원칙과 향후 광고 운영 시의 개인정보 기준을 설명하는 페이지입니다.",
  },
  "/contact": {
    title: "문의",
    description:
      "문의 채널과 향후 운영 연락 방식을 안내하는 기본 연락처 페이지입니다.",
  },
  ...toolPageMetadataEntries,
};

export function getPageMetadataEntry(path: SitePath) {
  return {
    path,
    ...pageMetadataCatalog[path],
  };
}

export function createPageMetadata({
  path,
  title,
  description,
}: PageMetadataInput): Metadata {
  const url = new URL(path, siteOrigin);

  return {
    title,
    description,
    applicationName: siteName,
    category: "technology",
    keywords: [...defaultKeywords],
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  category: "technology",
  keywords: [...defaultKeywords],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteName,
    description: siteDescription,
    url: siteOrigin,
    siteName,
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
};
