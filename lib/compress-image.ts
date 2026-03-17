import {
  getSupportedImageMimeType,
  type SupportedImageMimeType,
  type UploadFileLike,
} from "./image-upload";

export type CompressionOutputFormat = "original" | "image/jpeg" | "image/webp";

export type CompressionWorkflowPreset = {
  id:
    | "blog-upload"
    | "thumbnail-preview"
    | "product-image-upload"
    | "quick-share";
  label: string;
  description: string;
  summary: string;
  outputFormat: CompressionOutputFormat;
  quality: number;
};

export const compressionOutputOptions = [
  {
    value: "original",
    label: "원본 형식 유지",
    description: "현재 형식을 유지한 채 다시 압축합니다.",
  },
  {
    value: "image/jpeg",
    label: "JPEG",
    description: "사진 계열 이미지에 적합한 손실 압축 형식입니다.",
  },
  {
    value: "image/webp",
    label: "WebP",
    description: "JPEG보다 더 작은 파일 크기를 기대할 수 있는 최신 형식입니다.",
  },
] as const satisfies ReadonlyArray<{
  value: CompressionOutputFormat;
  label: string;
  description: string;
}>;

export const compressionWorkflowPresetOptions = [
  {
    id: "blog-upload",
    label: "블로그 업로드",
    description:
      "본문 사진과 설명 이미지를 업로드 전 정리할 때 바로 써볼 수 있는 추천 시작점입니다.",
    summary: "WebP · 품질 80%",
    outputFormat: "image/webp",
    quality: 80,
  },
  {
    id: "thumbnail-preview",
    label: "썸네일 / 미리보기",
    description:
      "목록 카드, 링크 미리보기, 작은 대표 이미지를 조금 더 가볍게 만들 때 쓰기 좋습니다.",
    summary: "WebP · 품질 72%",
    outputFormat: "image/webp",
    quality: 72,
  },
  {
    id: "product-image-upload",
    label: "상품 이미지 업로드",
    description:
      "상품 대표 이미지와 상세 사진을 업로드 전 정리할 때 호환성을 우선해 시작하기 좋습니다.",
    summary: "JPEG · 품질 88%",
    outputFormat: "image/jpeg",
    quality: 88,
  },
  {
    id: "quick-share",
    label: "빠른 공유 / 가볍게",
    description:
      "메신저, 문서 첨부, 임시 전달처럼 파일 크기를 더 적극적으로 줄이고 싶을 때 맞는 시작점입니다.",
    summary: "JPEG · 품질 70%",
    outputFormat: "image/jpeg",
    quality: 70,
  },
] as const satisfies ReadonlyArray<CompressionWorkflowPreset>;

const mimeTypeLabels: Record<SupportedImageMimeType, string> = {
  "image/jpeg": "JPEG",
  "image/png": "PNG",
  "image/webp": "WebP",
};

function stripFileExtension(fileName: string) {
  const trimmedName = fileName.trim();
  const extensionIndex = trimmedName.lastIndexOf(".");

  if (extensionIndex <= 0) {
    return trimmedName || "image";
  }

  return trimmedName.slice(0, extensionIndex);
}

export function getCompressionMimeTypeLabel(mimeType: SupportedImageMimeType) {
  return mimeTypeLabels[mimeType];
}

export function resolveCompressionMimeType(
  file: UploadFileLike,
  outputFormat: CompressionOutputFormat,
) {
  if (outputFormat === "original") {
    return getSupportedImageMimeType(file);
  }

  return outputFormat;
}

export function getCompressionOutputExtension(
  mimeType: SupportedImageMimeType,
) {
  if (mimeType === "image/jpeg") {
    return ".jpg";
  }

  if (mimeType === "image/png") {
    return ".png";
  }

  return ".webp";
}

export function createCompressedFileName(
  fileName: string,
  mimeType: SupportedImageMimeType,
) {
  return `${stripFileExtension(fileName)}-compressed${getCompressionOutputExtension(mimeType)}`;
}

export function isQualityAdjustableFormat(mimeType: SupportedImageMimeType) {
  return mimeType !== "image/png";
}

export function getCompressionDeltaPercent(
  originalBytes: number,
  outputBytes: number,
) {
  if (originalBytes <= 0) {
    return 0;
  }

  return ((originalBytes - outputBytes) / originalBytes) * 100;
}
