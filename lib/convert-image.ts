import { getCompressionOutputExtension } from "./compress-image";
import type { SupportedImageMimeType } from "./image-upload";

export const conversionOutputOptions = [
  {
    value: "image/jpeg",
    label: "JPEG",
    description:
      "사진과 일반 콘텐츠 이미지를 호환성 좋게 공유할 때 적합한 손실 압축 형식입니다.",
  },
  {
    value: "image/png",
    label: "PNG",
    description:
      "로고, 캡처, 투명 배경처럼 선명한 가장자리와 무손실 저장이 필요할 때 적합합니다.",
  },
  {
    value: "image/webp",
    label: "WebP",
    description:
      "웹 배포용으로 JPEG와 PNG보다 더 작은 파일 크기를 기대할 수 있는 최신 형식입니다.",
  },
] as const satisfies ReadonlyArray<{
  value: SupportedImageMimeType;
  label: string;
  description: string;
}>;

function stripFileExtension(fileName: string) {
  const trimmedName = fileName.trim();
  const extensionIndex = trimmedName.lastIndexOf(".");

  if (extensionIndex <= 0) {
    return trimmedName || "image";
  }

  return trimmedName.slice(0, extensionIndex);
}

export function createConvertedFileName(
  fileName: string,
  mimeType: SupportedImageMimeType,
) {
  return `${stripFileExtension(fileName)}-converted${getCompressionOutputExtension(mimeType)}`;
}

export function getDefaultConversionMimeType(
  sourceMimeType: SupportedImageMimeType,
) {
  if (sourceMimeType === "image/webp") {
    return "image/jpeg";
  }

  return "image/webp";
}

export function getConversionOutputDescription(
  mimeType: SupportedImageMimeType,
) {
  return (
    conversionOutputOptions.find((option) => option.value === mimeType)
      ?.description ??
    "출력 형식 특징을 확인한 뒤 변환 결과를 저장합니다."
  );
}
