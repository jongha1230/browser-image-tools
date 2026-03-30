"use client";

import { getCompressionDeltaPercent } from "@/lib/compress-image";
import {
  formatFileSize,
  type SupportedImageMimeType,
} from "@/lib/image-upload";
import type {
  ImageProcessVariant,
  ProcessedImagePayload,
} from "@/lib/image-processing";

export type StepKey = "upload" | "options" | "export";

export type ToolShellVariant =
  | "default"
  | "compress"
  | "resize"
  | "convert"
  | "removeExif";

export type WorkflowPresetId =
  | "blog-upload"
  | "thumbnail-preview"
  | "product-image-upload"
  | "quick-share";

export type QueueItemState = {
  status: "queued" | "processing" | "success" | "error";
  errorMessage?: string;
  result?: ProcessedImagePayload;
};

export type ProcessingEngine = "worker" | "main";

export type SummaryRow = {
  label: string;
  value: string;
};

export type DimensionsLike = {
  width: number;
  height: number;
};

export type ToolShellProps = {
  title: string;
  description: string;
  primaryActionLabel: string;
  sectionId?: string;
  variant?: ToolShellVariant;
};

export const stepLabels: Record<StepKey, string> = {
  upload: "파일 준비",
  options: "옵션 선택",
  export: "결과 저장",
};

export const sourceLabels = {
  drop: "드래그 앤 드롭",
  input: "파일 선택",
  paste: "클립보드 붙여넣기",
} as const;

export function getClipboardFiles(dataTransfer: DataTransfer | null) {
  if (!dataTransfer) {
    return [];
  }

  const files = Array.from(dataTransfer.files);

  if (files.length > 0) {
    return files;
  }

  return Array.from(dataTransfer.items)
    .filter((item) => item.kind === "file")
    .map((item) => item.getAsFile())
    .filter((file): file is File => file !== null);
}

export function loadImageElement(sourceUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();

    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(
        new Error(
          "선택한 이미지를 읽지 못했습니다. 다른 파일로 다시 시도해 주세요.",
        ),
      );
    image.src = sourceUrl;
  });
}

export function downloadBlob(blob: Blob, fileName: string) {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = fileName;
  link.rel = "noopener";
  link.click();

  window.setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 1_000);
}

export function yieldToBrowser() {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, 0);
  });
}

export function formatCompressionSummary(
  originalBytes: number,
  outputBytes: number,
) {
  const deltaPercent = getCompressionDeltaPercent(originalBytes, outputBytes);
  const savedBytes = originalBytes - outputBytes;

  if (savedBytes > 0) {
    return `${formatFileSize(savedBytes)} 감소 (${deltaPercent.toFixed(1)}%)`;
  }

  if (savedBytes < 0) {
    return `${formatFileSize(Math.abs(savedBytes))} 증가 (${Math.abs(
      deltaPercent,
    ).toFixed(1)}%)`;
  }

  return "용량 변화 없음";
}

export function formatDimensions(dimensions: DimensionsLike) {
  return `${dimensions.width} x ${dimensions.height}`;
}

export function formatResizeScaleSummary(
  original: DimensionsLike,
  target: DimensionsLike,
) {
  const widthPercent = (target.width / original.width) * 100;
  const heightPercent = (target.height / original.height) * 100;
  const formatter = new Intl.NumberFormat("ko-KR", {
    maximumFractionDigits: 1,
  });

  if (Math.abs(widthPercent - heightPercent) < 0.05) {
    return `${formatter.format(widthPercent)}%`;
  }

  return `가로 ${formatter.format(widthPercent)}%, 세로 ${formatter.format(
    heightPercent,
  )}%`;
}

export function getResizeDimensionValue(value: string) {
  const trimmedValue = value.trim();

  if (!/^\d+$/.test(trimmedValue)) {
    return null;
  }

  return Number(trimmedValue);
}

export function getVariantLabel(variant: ToolShellVariant) {
  if (variant === "compress") {
    return "배치 이미지 압축";
  }

  if (variant === "resize") {
    return "배치 이미지 크기 조절";
  }

  if (variant === "convert") {
    return "배치 이미지 포맷 변환";
  }

  if (variant === "removeExif") {
    return "배치 EXIF 정리";
  }

  return "이미지 업로드";
}

export function getQueueStatusLabel(status: QueueItemState["status"]) {
  if (status === "processing") {
    return "처리 중";
  }

  if (status === "success") {
    return "완료";
  }

  if (status === "error") {
    return "실패";
  }

  return "대기 중";
}

export function getEngineLabel(engine: ProcessingEngine) {
  return engine === "worker" ? "웹 워커 우선" : "메인 스레드";
}

export function getToolVariant(
  variant: ToolShellVariant,
): ImageProcessVariant | null {
  if (variant === "default") {
    return null;
  }

  return variant;
}

export function getDropzoneCopy(
  variant: ToolShellVariant,
  keepAspectRatio: boolean,
  skippedConvertCount: number,
  replaceOnNextAdd: boolean,
) {
  if (replaceOnNextAdd) {
    return "다음 파일을 추가하면 현재 단일 작업이 자동으로 바뀝니다";
  }

  if (variant === "compress") {
    return "선택한 품질과 형식을 모든 파일에 같은 기준으로 적용";
  }

  if (variant === "resize") {
    return keepAspectRatio
      ? "비율 유지 켜짐: 각 파일이 지정한 박스 안에 맞게 개별 비율 유지"
      : "비율 유지 꺼짐: 모든 파일을 같은 가로·세로 값으로 저장";
  }

  if (variant === "convert") {
    return skippedConvertCount > 0
      ? `${skippedConvertCount}개 파일은 현재 선택과 형식이 같아 변환 없이 실패로 표시`
      : "선택한 출력 형식으로 여러 파일을 한 번에 변환";
  }

  if (variant === "removeExif") {
    return "원본 형식으로 다시 저장해 메타데이터를 한 번에 정리";
  }

  return "현재 업로드 상태를 다른 도구에서도 이어서 사용할 수 있습니다";
}

export function isSupportedMimeType(
  value: SupportedImageMimeType | null | undefined,
): value is SupportedImageMimeType {
  return value === "image/jpeg" || value === "image/png" || value === "image/webp";
}
