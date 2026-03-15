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

export const maxResizeDimension = 16_384;

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
