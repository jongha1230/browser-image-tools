import { getCompressionOutputExtension } from "./compress-image";
import type { SupportedImageMimeType } from "./image-upload";

export type ConversionWorkflowPreset = {
  id:
    | "blog-upload"
    | "thumbnail-preview"
    | "product-image-upload"
    | "quick-share";
  label: string;
  description: string;
  summary: string;
  preferredTargetMimeType: SupportedImageMimeType;
  fallbackTargetMimeType: SupportedImageMimeType;
  quality: number;
};

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

export const conversionWorkflowPresetOptions = [
  {
    id: "blog-upload",
    label: "블로그 업로드",
    description:
      "본문 사진과 설명 이미지를 웹 업로드용으로 다시 저장해 볼 때 고르기 쉬운 시작점입니다.",
    summary: "기본 WebP · 품질 80%",
    preferredTargetMimeType: "image/webp",
    fallbackTargetMimeType: "image/jpeg",
    quality: 80,
  },
  {
    id: "thumbnail-preview",
    label: "썸네일 / 미리보기",
    description:
      "목록 카드와 미리보기 이미지를 조금 더 가볍게 바꿔 보고 싶을 때 바로 적용하기 좋습니다.",
    summary: "기본 WebP · 품질 72%",
    preferredTargetMimeType: "image/webp",
    fallbackTargetMimeType: "image/jpeg",
    quality: 72,
  },
  {
    id: "product-image-upload",
    label: "상품 이미지 업로드",
    description:
      "상품 이미지처럼 호환성을 우선해서 다시 저장해 볼 때 많이 쓰는 시작점입니다.",
    summary: "기본 JPEG · 품질 88%",
    preferredTargetMimeType: "image/jpeg",
    fallbackTargetMimeType: "image/webp",
    quality: 88,
  },
  {
    id: "quick-share",
    label: "빠른 공유 / 가볍게",
    description:
      "파일 크기를 더 적극적으로 줄여 바로 전달하고 싶을 때 먼저 눌러 보기 좋습니다.",
    summary: "기본 JPEG · 품질 72%",
    preferredTargetMimeType: "image/jpeg",
    fallbackTargetMimeType: "image/webp",
    quality: 72,
  },
] as const satisfies ReadonlyArray<ConversionWorkflowPreset>;

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

export function resolveConversionWorkflowMimeType(
  sourceMimeType: SupportedImageMimeType | null | undefined,
  preset: Pick<
    ConversionWorkflowPreset,
    "preferredTargetMimeType" | "fallbackTargetMimeType"
  >,
) {
  if (sourceMimeType === preset.preferredTargetMimeType) {
    return preset.fallbackTargetMimeType;
  }

  return preset.preferredTargetMimeType;
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
