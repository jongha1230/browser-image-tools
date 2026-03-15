export const siteOrigin = "https://browser-image-tools.example";

export type ToolSlug =
  | "compress-image"
  | "resize-image"
  | "convert-image"
  | "remove-exif";

type ToolRouteBase<TSlug extends ToolSlug> = {
  slug: TSlug;
  href: `/tools/${TSlug}`;
  title: string;
  shortLabel: string;
  description: string;
  metadataDescription: string;
  intro: string;
  highlights: string[];
  checklist: string[];
  shellActionLabel: string;
};

export type ToolRoute =
  | ToolRouteBase<"compress-image">
  | ToolRouteBase<"resize-image">
  | ToolRouteBase<"convert-image">
  | ToolRouteBase<"remove-exif">;

export const siteName = "브라우저 이미지 툴";
export const siteTagline = "한국어 중심, 광고 기반, 브라우저 내 이미지 유틸리티";
export const siteDescription =
  "이미지 압축, 크기 조절, 포맷 변환, EXIF 제거를 모두 브라우저 안에서 처리하는 한국어 중심 이미지 도구 사이트 스캐폴드입니다.";

export const primaryNav = [
  { href: "/tools", label: "도구" },
  { href: "/guides", label: "가이드" },
  { href: "/about", label: "소개" },
  { href: "/privacy", label: "개인정보" },
  { href: "/contact", label: "문의" },
] as const;

export const footerNav = [
  { href: "/about", label: "소개" },
  { href: "/privacy", label: "개인정보" },
  { href: "/contact", label: "문의" },
] as const;

export const toolRoutes = [
  {
    slug: "compress-image",
    href: "/tools/compress-image",
    title: "이미지 압축",
    shortLabel: "압축",
    description:
      "업로드 전 이미지 용량을 줄여 전송 속도와 저장 효율을 개선하는 로컬 브라우저 압축 도구입니다.",
    metadataDescription:
      "브라우저에서 JPG, PNG, WebP 이미지 용량을 로컬로 줄이는 이미지 압축 도구 안내 페이지입니다.",
    intro:
      "블로그, 커뮤니티, 쇼핑몰 업로드 전에 JPG, PNG, WebP 파일 크기를 빠르게 낮추는 흐름을 염두에 둔 페이지입니다.",
    highlights: [
      "품질 조절, 예상 용량 비교, 원본 유지 흐름을 이후 단계에 연결합니다.",
      "파일은 서버로 전송하지 않고 브라우저 탭 안에서만 처리합니다.",
      "배치 처리와 일괄 다운로드를 고려한 정보 구조를 먼저 고정합니다.",
    ],
    checklist: [
      "목표 용량 또는 품질 범위 선택",
      "원본 대비 미리보기와 다운로드 크기 비교",
      "여러 파일 일괄 내보내기 준비",
    ],
    shellActionLabel: "압축 시작 예정",
  },
  {
    slug: "resize-image",
    href: "/tools/resize-image",
    title: "이미지 크기 조절",
    shortLabel: "리사이즈",
    description:
      "썸네일, 상세 페이지, 문서 첨부용으로 픽셀 크기를 조정하는 로컬 브라우저 리사이즈 도구입니다.",
    metadataDescription:
      "브라우저에서 JPG, PNG, WebP 이미지 크기를 로컬로 조정하고 결과를 다운로드하는 리사이즈 도구 페이지입니다.",
    intro:
      "가로와 세로 입력, 비율 잠금, 자주 쓰는 크기 프리셋을 이용해 이미지 1개의 해상도를 바로 조절할 수 있습니다.",
    highlights: [
      "가로와 세로 픽셀 값을 직접 입력해 출력 크기를 조정할 수 있습니다.",
      "비율 잠금이 켜져 있으면 원본 비율을 유지한 채 다른 한쪽 값을 자동 계산합니다.",
      "대표 프리셋을 눌러 빠르게 크기를 맞추고 결과 파일을 바로 저장할 수 있습니다.",
    ],
    checklist: [
      "비율 유지 또는 직접 입력 선택",
      "대표 프리셋으로 빠른 크기 지정",
      "원본과 결과 해상도 및 파일명 비교",
    ],
    shellActionLabel: "이미지 크기 조절하기",
  },
  {
    slug: "convert-image",
    href: "/tools/convert-image",
    title: "이미지 포맷 변환",
    shortLabel: "변환",
    description:
      "JPG, PNG, WebP 사이를 브라우저에서 상호 변환하고 결과를 바로 저장하는 로컬 포맷 변환 도구입니다.",
    metadataDescription:
      "브라우저에서 JPG, PNG, WebP 사이를 로컬로 변환하고 품질과 결과 정보를 확인하는 포맷 변환 도구 페이지입니다.",
    intro:
      "JPEG, PNG, WebP 가운데 다른 형식으로 1장씩 변환하면서 품질, 파일 크기, 저장 파일명을 바로 확인할 수 있습니다.",
    highlights: [
      "지원 포맷과 제약 사항을 도구 상단에서 바로 읽을 수 있게 구성합니다.",
      "JPEG, PNG, WebP별 차이와 투명 배경 처리 방식을 한국어 설명으로 제공합니다.",
      "원본과 결과 형식, 용량, 저장 이름을 같은 화면에서 비교할 수 있습니다.",
    ],
    checklist: [
      "출력 형식과 품질 선택",
      "원본과 결과 파일 정보 비교",
      "단일 파일 변환 후 즉시 다운로드",
    ],
    shellActionLabel: "이미지 포맷 변환하기",
  },
  {
    slug: "remove-exif",
    href: "/tools/remove-exif",
    title: "EXIF 제거",
    shortLabel: "EXIF 제거",
    description:
      "사진 메타데이터를 로컬 브라우저에서 제거해 공유 전 개인정보 노출을 줄이는 도구입니다.",
    metadataDescription:
      "브라우저에서 사진 EXIF 메타데이터를 로컬로 제거하는 개인정보 보호 도구 안내 페이지입니다.",
    intro:
      "촬영 위치, 기기 정보, 날짜 정보 같은 메타데이터를 제거하는 프라이버시 중심 흐름을 위한 페이지입니다.",
    highlights: [
      "EXIF가 무엇인지와 제거 이유를 페이지 본문에서 먼저 설명합니다.",
      "원본 파일 업로드 없이 메타데이터 제거가 로컬에서 이뤄진다는 점을 강조합니다.",
      "배치 제거 후 일괄 저장까지 자연스럽게 확장할 수 있게 구조를 잡습니다.",
    ],
    checklist: [
      "EXIF 포함 가능 정보 안내",
      "제거 후 공유 전 확인 포인트 정리",
      "배치 내보내기 연계 준비",
    ],
    shellActionLabel: "EXIF 제거하기",
  },
] satisfies ToolRoute[];

export const requiredRoutes = [
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
] as const;

export const guideTopics = [
  "웹 업로드 전에 이미지 용량을 줄여야 하는 이유",
  "쇼핑몰 썸네일과 상세 이미지 권장 크기 가이드",
  "JPG, PNG, WebP 차이와 선택 기준",
  "메타데이터 제거가 필요한 공유 상황 정리",
] as const;

export function getToolRoute<TSlug extends ToolSlug>(
  slug: TSlug,
): Extract<ToolRoute, { slug: TSlug }> {
  const tool = toolRoutes.find((entry) => entry.slug === slug);

  if (!tool) {
    throw new Error(`Unknown tool route: ${slug}`);
  }

  return tool as Extract<ToolRoute, { slug: TSlug }>;
}
