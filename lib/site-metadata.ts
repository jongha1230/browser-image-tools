import type { Metadata } from "next";

import {
  guideRoutes,
  requiredRoutes,
  siteDescription,
  siteName,
  toolRoutes,
} from "./site-content";
import { getIndexableSiteUrl, isSiteIndexable, siteOriginUrl } from "./site-config";

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
    title: "브라우저 이미지 작업 도구",
    description:
      "브라우저 안에서 이미지 압축, 크기 조절, 포맷 변환, EXIF 제거와 배치 내보내기를 처리하는 한국어 이미지 작업 도구 홈입니다.",
  },
  "/tools": {
    title: "이미지 도구 모음",
    description:
      "이미지 압축, 크기 조절, 포맷 변환, EXIF 제거 도구를 작업별로 바로 고를 수 있게 모아 둔 페이지입니다.",
  },
  "/guides": {
    title: "이미지 작업 가이드",
    description:
      "이미지 최적화, 포맷 선택, EXIF 정리, 배치 리사이즈 기준을 다루는 한국어 가이드 모음 페이지입니다.",
  },
  "/about": {
    title: "서비스 소개",
    description:
      "브라우저 안에서 처리하는 방식, 현재 지원 범위, 서비스 운영 원칙을 소개하는 페이지입니다.",
  },
  "/privacy": {
    title: "개인정보와 로컬 처리 안내",
    description:
      "이미지 파일을 브라우저 안에서 처리하는 방식과 광고·쿠키 고지의 현재 상태를 설명하는 페이지입니다.",
  },
  "/contact": {
    title: "문의 안내",
    description:
      "버그 제보와 지원 범위 문의를 남길 때 확인하면 좋은 정보와 현재 연락 방식을 정리한 페이지입니다.",
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
  const canonicalUrl = getIndexableSiteUrl(path);
  const fullTitle = `${title} | ${siteName}`;

  return {
    title: fullTitle,
    description,
    applicationName: siteName,
    category: "technology",
    keywords: [...defaultKeywords],
    alternates: canonicalUrl
      ? {
          canonical: canonicalUrl,
        }
      : undefined,
    openGraph: {
      title,
      description,
      siteName,
      locale: "ko_KR",
      type: "website",
      ...(canonicalUrl ? { url: canonicalUrl } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: isSiteIndexable
      ? {
          index: true,
          follow: true,
        }
      : {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        },
  };
}

const rootCanonicalUrl = getIndexableSiteUrl("/");
const rootRssUrl = getIndexableSiteUrl("/rss.xml");

export const rootMetadata: Metadata = {
  metadataBase: isSiteIndexable ? siteOriginUrl : undefined,
  title: siteName,
  description: siteDescription,
  applicationName: siteName,
  category: "technology",
  keywords: [...defaultKeywords],
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  alternates:
    rootCanonicalUrl || rootRssUrl
      ? {
          ...(rootCanonicalUrl ? { canonical: rootCanonicalUrl } : {}),
          ...(rootRssUrl
            ? {
                types: {
                  "application/rss+xml": rootRssUrl,
                },
              }
            : {}),
        }
      : undefined,
  openGraph: {
    title: siteName,
    description: siteDescription,
    siteName,
    locale: "ko_KR",
    type: "website",
    ...(rootCanonicalUrl ? { url: rootCanonicalUrl } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
  robots: isSiteIndexable
    ? {
        index: true,
        follow: true,
      }
    : {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
          index: false,
          follow: false,
          noimageindex: true,
        },
      },
};
