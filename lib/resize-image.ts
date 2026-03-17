import { getCompressionOutputExtension } from "./compress-image";
import type { SupportedImageMimeType } from "./image-upload";

export type ResizeDimensions = {
  width: number;
  height: number;
};

export type ResizePreset = ResizeDimensions & {
  label: string;
  description: string;
};

export type ResizeWorkflowPreset = ResizeDimensions & {
  id:
    | "blog-upload"
    | "thumbnail-preview"
    | "product-image-upload"
    | "quick-share";
  label: string;
  description: string;
  summary: string;
};

export const maxResizeDimension = 16_384;

export const resizeWorkflowPresetOptions = [
  {
    id: "blog-upload",
    label: "블로그 업로드",
    width: 1600,
    height: 1600,
    description:
      "본문 사진과 설명 이미지를 긴 변 1600px 안쪽으로 먼저 정리할 때 쓰는 추천 시작점입니다.",
    summary: "비율 유지 · 1600 x 1600 박스",
  },
  {
    id: "thumbnail-preview",
    label: "썸네일 / 미리보기",
    width: 1200,
    height: 630,
    description:
      "목록 카드나 공유 미리보기처럼 가로형 대표 이미지를 가볍게 맞출 때 시작하기 좋습니다.",
    summary: "비율 유지 · 1200 x 630 박스",
  },
  {
    id: "product-image-upload",
    label: "상품 이미지 업로드",
    width: 1800,
    height: 1800,
    description:
      "상품 대표 이미지와 상세 사진을 비슷한 크기감으로 정리할 때 자주 쓰는 박스 기준입니다.",
    summary: "비율 유지 · 1800 x 1800 박스",
  },
  {
    id: "quick-share",
    label: "빠른 공유 / 가볍게",
    width: 1280,
    height: 1280,
    description:
      "메신저, 문서 첨부, 내부 공유 전에 긴 변을 빠르게 줄일 때 무난한 시작점입니다.",
    summary: "비율 유지 · 1280 x 1280 박스",
  },
] as const satisfies ReadonlyArray<ResizeWorkflowPreset>;

export const resizePresetOptions = [
  {
    label: "정사각형 1080",
    width: 1080,
    height: 1080,
    description: "프로필 이미지나 카드 썸네일에 많이 쓰는 정사각형 크기입니다.",
  },
  {
    label: "게시글 1200",
    width: 1200,
    height: 1200,
    description: "블로그 본문이나 일반 콘텐츠 썸네일에 쓰기 쉬운 기준입니다.",
  },
  {
    label: "소셜 1200 x 630",
    width: 1200,
    height: 630,
    description: "링크 미리보기와 공유 카드 비율에 자주 맞추는 크기입니다.",
  },
  {
    label: "HD 1280 x 720",
    width: 1280,
    height: 720,
    description: "16:9 비율의 기본적인 웹용 이미지 크기입니다.",
  },
  {
    label: "Full HD 1920 x 1080",
    width: 1920,
    height: 1080,
    description: "와이드 배너나 프레젠테이션용으로 많이 쓰는 크기입니다.",
  },
] as const satisfies ReadonlyArray<ResizePreset>;

type ResizeValidationResult =
  | {
      ok: true;
      width: number;
      height: number;
    }
  | {
      ok: false;
      message: string;
    };

function stripFileExtension(fileName: string) {
  const trimmedName = fileName.trim();
  const extensionIndex = trimmedName.lastIndexOf(".");

  if (extensionIndex <= 0) {
    return trimmedName || "image";
  }

  return trimmedName.slice(0, extensionIndex);
}

function parseResizeDimension(value: string) {
  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    return null;
  }

  if (!/^\d+$/.test(trimmedValue)) {
    return Number.NaN;
  }

  return Number(trimmedValue);
}

export function createResizedFileName(
  fileName: string,
  mimeType: SupportedImageMimeType,
) {
  return `${stripFileExtension(fileName)}-resized${getCompressionOutputExtension(mimeType)}`;
}

export function calculateHeightFromWidth(
  width: number,
  original: ResizeDimensions,
) {
  return Math.max(1, Math.round((width * original.height) / original.width));
}

export function calculateWidthFromHeight(
  height: number,
  original: ResizeDimensions,
) {
  return Math.max(1, Math.round((height * original.width) / original.height));
}

export function fitWithinResizePreset(
  original: ResizeDimensions,
  preset: ResizeDimensions,
) {
  const scale = Math.min(
    preset.width / original.width,
    preset.height / original.height,
  );

  return {
    width: Math.max(1, Math.round(original.width * scale)),
    height: Math.max(1, Math.round(original.height * scale)),
  };
}

export function validateResizeDimensions(
  widthValue: string,
  heightValue: string,
): ResizeValidationResult {
  const width = parseResizeDimension(widthValue);
  const height = parseResizeDimension(heightValue);

  if (width === null || height === null) {
    return {
      ok: false,
      message: "가로와 세로 값을 모두 입력해 주세요.",
    };
  }

  if (!Number.isInteger(width) || !Number.isInteger(height)) {
    return {
      ok: false,
      message: "가로와 세로 값은 숫자만 입력할 수 있습니다.",
    };
  }

  if (
    width < 1 ||
    height < 1 ||
    width > maxResizeDimension ||
    height > maxResizeDimension
  ) {
    return {
      ok: false,
      message: `가로와 세로 값은 1 이상 ${maxResizeDimension.toLocaleString("ko-KR")} 이하의 정수여야 합니다.`,
    };
  }

  return {
    ok: true,
    width,
    height,
  };
}
