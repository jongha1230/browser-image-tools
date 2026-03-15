import {
  getSupportedImageMimeType,
  type SupportedImageMimeType,
  type UploadFileLike,
} from "./image-upload";

export type CompressionOutputFormat = "original" | "image/jpeg" | "image/webp";

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
