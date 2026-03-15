import type { Metadata } from "next";

import {
  guideRoutes,
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

const guidePageMetadataEntries = Object.fromEntries(
  guideRoutes.map((guide) => [
    guide.href,
    {
      title: guide.title,
      description: guide.metadataDescription,
    },
  ]),
) as Record<(typeof guideRoutes)[number]["href"], PageMetadataEntry>;

export const pageMetadataCatalog: Record<SitePath, PageMetadataEntry> = {
  "/": {
    title: "로컬 이미지 도구 홈",
    description:
      "브라우저 안에서 이미지 압축, 크기 조절, 포맷 변환, EXIF 제거와 배치 내보내기를 처리하는 한국어 중심 이미지 도구 홈입니다.",
  },
  "/tools": {
    title: "이미지 도구 허브",
    description:
      "이미지 압축, 크기 조절, 포맷 변환, EXIF 제거 도구를 실제 라우트로 모아 둔 허브 페이지입니다.",
  },
  "/guides": {
    title: "이미지 작업 가이드",
    description:
      "이미지 최적화, 포맷 선택, EXIF 제거, 배치 리사이즈 흐름을 다루는 한국어 가이드 허브 페이지입니다.",
  },
  "/about": {
    title: "서비스 소개",
    description:
      "브라우저 로컬 처리 원칙, 지원 범위, 광고 준비 방향을 소개하는 한국어 이미지 유틸리티 소개 페이지입니다.",
  },
  "/privacy": {
    title: "개인정보 처리방침",
    description:
      "브라우저 로컬 처리 원칙과 광고·쿠키 고지 예정 사항을 설명하는 한국어 개인정보 처리 페이지입니다.",
  },
  "/contact": {
    title: "문의 및 제휴 안내",
    description:
      "버그 제보, 운영 문의, 광고 제휴 문의 시 확인할 항목과 안내 방식을 정리한 페이지입니다.",
  },
  ...toolPageMetadataEntries,
  ...guidePageMetadataEntries,
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
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
  },
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
