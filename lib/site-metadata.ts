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
  "이미지 압축",
  "이미지 리사이즈",
  "이미지 포맷 변환",
  "EXIF 제거",
  "브라우저 로컬 처리",
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
    title: "업로드 전 이미지 압축·리사이즈·변환·EXIF 제거",
    description:
      "업로드 전에 이미지 압축, 리사이즈, 포맷 변환, EXIF 제거를 브라우저에서 처리하고 여러 장 결과를 개별 저장하거나 ZIP으로 내려받는 로컬 이미지 도구입니다.",
  },
  "/tools": {
    title: "이미지 압축·리사이즈·변환·EXIF 제거 도구 모음",
    description:
      "이미지 압축, 크기 조절, 포맷 변환, EXIF 제거 도구를 작업 목적별로 바로 열고 브라우저 안에서 처리할 수 있는 도구 허브입니다.",
  },
  "/guides": {
    title: "이미지 업로드 전 압축·리사이즈·변환 가이드",
    description:
      "이미지 압축 기준, 리사이즈 순서, 포맷 선택, EXIF 제거, 블로그 업로드 준비, 쇼핑몰 이미지 준비를 정리한 실전 가이드 허브입니다.",
  },
  "/about": {
    title: "브라우저 이미지 툴 소개",
    description:
      "이미지 압축, 리사이즈, 포맷 변환, EXIF 제거 도구를 왜 브라우저 로컬 처리로 제공하는지와 현재 지원 범위를 설명합니다.",
  },
  "/privacy": {
    title: "이미지 로컬 처리와 개인정보 안내",
    description:
      "이미지 파일이 서버 업로드 없이 브라우저 안에서 처리되는 방식과 데이터 보관 범위를 설명하는 페이지입니다.",
  },
  "/contact": {
    title: "브라우저 이미지 툴 문의",
    description:
      "이미지 압축, 리사이즈, 포맷 변환, EXIF 제거 도구 사용 중 생긴 문제를 제보할 때 필요한 정보와 연락 방식을 안내합니다.",
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
