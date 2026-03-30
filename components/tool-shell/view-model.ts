"use client";

import { getCompressionMimeTypeLabel } from "@/lib/compress-image";
import { formatFileSize, type SupportedImageMimeType } from "@/lib/image-upload";
import {
  resolveImageProcessingPlan,
  type ImageProcessOptions,
  type ProcessedImagePayload,
} from "@/lib/image-processing";
import type { ResizeDimensions } from "@/lib/resize-image";

import type { UploadedImage } from "@/components/image-upload-provider";

import {
  formatCompressionSummary,
  formatDimensions,
  formatResizeScaleSummary,
  type QueueItemState,
  type StepKey,
  type SummaryRow,
  type ToolShellVariant,
} from "./shared";

type QueueSummaryArgs = {
  itemsLength: number;
  hasItems: boolean;
  totalSize: number;
  hasResults: boolean;
  successCount: number;
  errorCount: number;
};

type WorkflowStatusArgs = {
  isProcessing: boolean;
  hasResults: boolean;
  successCount: number;
};

type SelectedSummaryArgs = {
  conversionOutputFormat: SupportedImageMimeType;
  currentOptions: ImageProcessOptions | null;
  isCompressTool: boolean;
  isConvertTool: boolean;
  isRemoveExifTool: boolean;
  isResizeTool: boolean;
  itemsLength: number;
  referenceDimensions: ResizeDimensions | null;
  selectedItem: UploadedImage | null;
  selectedMimeType: SupportedImageMimeType | null;
};

type SelectedResultArgs = {
  selectedItem: UploadedImage | null;
  selectedMimeType: SupportedImageMimeType | null;
  selectedResult: ProcessedImagePayload | null;
  toolVariant: ToolShellVariant;
};

type ToolStatusCopyArgs = {
  activeStep: StepKey;
  conversionOutputFormat: SupportedImageMimeType;
  errorCount: number;
  fileCountLabel: string;
  hasResults: boolean;
  isCompressTool: boolean;
  isConvertQualityEnabled: boolean;
  isConvertTool: boolean;
  isRemoveExifTool: boolean;
  isResizeTool: boolean;
  itemsLength: number;
  keepAspectRatio: boolean;
  quality: number;
  repeatActionMessage: string | null;
  resizeTargetDimensions: ResizeDimensions | null;
  resizeValidationMessage: string | null;
  successCount: number;
  targetMimeType: SupportedImageMimeType | null;
};

export function buildQueueSummaryRows({
  itemsLength,
  hasItems,
  totalSize,
  hasResults,
  successCount,
  errorCount,
}: QueueSummaryArgs): SummaryRow[] {
  return [
    {
      label: "준비 파일",
      value: `${itemsLength}개`,
    },
    {
      label: "총 업로드 용량",
      value: hasItems ? formatFileSize(totalSize) : "0 B",
    },
    {
      label: "성공 / 실패",
      value: hasResults
        ? `${successCount}개 / ${errorCount}개`
        : itemsLength > 0
          ? "실행 전"
          : "아직 없음",
    },
  ];
}

export function getWorkflowStatus({
  isProcessing,
  hasResults,
  successCount,
}: WorkflowStatusArgs) {
  const tone: QueueItemState["status"] = isProcessing
    ? "processing"
    : hasResults
      ? successCount > 0
        ? "success"
        : "error"
      : "queued";
  const label = isProcessing
    ? "처리 중"
    : hasResults
      ? successCount > 0
        ? "결과 준비됨"
        : "실패"
      : "실행 대기";

  return { tone, label };
}

function resolvePreviewPlan({
  currentOptions,
  referenceDimensions,
  selectedItem,
}: Pick<
  SelectedSummaryArgs,
  "currentOptions" | "referenceDimensions" | "selectedItem"
>) {
  if (!selectedItem || !referenceDimensions || !currentOptions) {
    return null;
  }

  try {
    return resolveImageProcessingPlan(
      selectedItem.file,
      referenceDimensions,
      currentOptions,
    );
  } catch {
    return null;
  }
}

export function buildSelectedSummaryRows({
  conversionOutputFormat,
  currentOptions,
  isCompressTool,
  isConvertTool,
  isRemoveExifTool,
  isResizeTool,
  itemsLength,
  referenceDimensions,
  selectedItem,
  selectedMimeType,
}: SelectedSummaryArgs): SummaryRow[] {
  if (!selectedItem) {
    return [];
  }

  const previewPlan = resolvePreviewPlan({
    currentOptions,
    referenceDimensions,
    selectedItem,
  });
  const rows: SummaryRow[] = [
    { label: "기준 파일", value: selectedItem.file.name },
    {
      label: "원본 형식",
      value: selectedMimeType
        ? getCompressionMimeTypeLabel(selectedMimeType)
        : "확인 불가",
    },
  ];

  if (isCompressTool) {
    rows.push(
      { label: "파일 크기", value: formatFileSize(selectedItem.file.size) },
      {
        label: "해상도",
        value: referenceDimensions
          ? formatDimensions(referenceDimensions)
          : "읽는 중",
      },
      {
        label: "예상 저장 이름",
        value: previewPlan ? previewPlan.fileName : "형식 확인 필요",
      },
    );
  } else if (isResizeTool) {
    rows.push(
      {
        label: "원본 해상도",
        value: referenceDimensions
          ? formatDimensions(referenceDimensions)
          : "읽는 중",
      },
      {
        label: "예상 출력",
        value: previewPlan ? formatDimensions(previewPlan) : "입력 확인 필요",
      },
      {
        label: "예상 저장 이름",
        value: previewPlan ? previewPlan.fileName : "입력 확인 필요",
      },
    );
  } else if (isConvertTool) {
    rows.push(
      {
        label: "해상도",
        value: referenceDimensions
          ? formatDimensions(referenceDimensions)
          : "읽는 중",
      },
      {
        label: "출력 형식",
        value: getCompressionMimeTypeLabel(conversionOutputFormat),
      },
      {
        label: "예상 저장 이름",
        value: previewPlan ? previewPlan.fileName : "일부 파일은 실패 가능",
      },
    );
  } else if (isRemoveExifTool) {
    rows.push(
      {
        label: "해상도",
        value: referenceDimensions
          ? formatDimensions(referenceDimensions)
          : "읽는 중",
      },
      {
        label: "예상 저장 이름",
        value: previewPlan ? previewPlan.fileName : "형식 확인 필요",
      },
      {
        label: "배치 범위",
        value: `${itemsLength}개 파일`,
      },
    );
  }

  return rows;
}

export function buildSelectedResultRows({
  selectedItem,
  selectedMimeType,
  selectedResult,
  toolVariant,
}: SelectedResultArgs): SummaryRow[] {
  if (!selectedItem || !selectedResult) {
    return [];
  }

  const rows: SummaryRow[] = [
    { label: "저장 이름", value: selectedResult.fileName },
    {
      label: "출력 형식",
      value: getCompressionMimeTypeLabel(selectedResult.mimeType),
    },
    { label: "결과 크기", value: formatFileSize(selectedResult.blob.size) },
    { label: "해상도", value: formatDimensions(selectedResult) },
  ];

  if (toolVariant === "resize") {
    rows.push({
      label: "크기 비율",
      value: formatResizeScaleSummary(
        {
          width: selectedResult.originalWidth,
          height: selectedResult.originalHeight,
        },
        selectedResult,
      ),
    });
  } else {
    rows.push({
      label: toolVariant === "removeExif" ? "메타데이터" : "용량 변화",
      value:
        toolVariant === "removeExif"
          ? "EXIF 제거용 재저장"
          : formatCompressionSummary(
              selectedItem.file.size,
              selectedResult.blob.size,
            ),
    });
  }

  if (toolVariant === "convert") {
    rows.push({
      label: "원본 형식",
      value: selectedMimeType
        ? getCompressionMimeTypeLabel(selectedMimeType)
        : "확인 불가",
    });
  }

  return rows;
}

export function buildToolStatusCopy({
  activeStep,
  conversionOutputFormat,
  errorCount,
  fileCountLabel,
  hasResults,
  isCompressTool,
  isConvertQualityEnabled,
  isConvertTool,
  isRemoveExifTool,
  isResizeTool,
  itemsLength,
  keepAspectRatio,
  quality,
  repeatActionMessage,
  resizeTargetDimensions,
  resizeValidationMessage,
  successCount,
  targetMimeType,
}: ToolStatusCopyArgs) {
  let statusByStep: Record<StepKey, string>;

  if (isCompressTool) {
    statusByStep = {
      upload:
        itemsLength > 0
          ? `${itemsLength}개 파일이 준비되었습니다. 같은 압축 기준을 한 번에 적용하고 결과는 이 브라우저 안에서만 생성됩니다.`
          : "JPEG, PNG, WebP 이미지를 여러 개 추가하면 바로 압축을 시작할 수 있습니다.",
      options:
        itemsLength > 0 && targetMimeType
          ? `${itemsLength}개 파일에 ${getCompressionMimeTypeLabel(targetMimeType)} 형식과 ${
              targetMimeType === "image/png"
                ? "무손실 재저장"
                : `${quality}% 품질`
            }을 일괄 적용합니다.${
              targetMimeType === "image/png"
                ? " PNG 무손실 재저장은 원본보다 커질 수 있습니다."
                : ""
            }`
          : "먼저 압축할 이미지를 추가하면 배치 품질과 출력 형식을 선택할 수 있습니다.",
      export: hasResults
        ? `총 ${itemsLength}개 중 ${successCount}개 압축 완료, ${errorCount}개 실패입니다. 성공한 결과만 개별 저장하거나 ZIP으로 받을 수 있습니다.`
        : "압축을 실행하면 파일별 결과와 다운로드 가능 상태를 이 단계에서 확인할 수 있습니다.",
    };
  } else if (isResizeTool) {
    statusByStep = {
      upload:
        itemsLength > 0
          ? `${itemsLength}개 파일이 준비되었습니다. 목표 크기를 기준으로 각 파일을 계산하며 비율 유지 여부에 따라 결과 해상도가 달라집니다.`
          : "JPEG, PNG, WebP 이미지를 여러 개 추가하면 바로 크기 조절을 시작할 수 있습니다.",
      options:
        itemsLength > 0 && resizeTargetDimensions
          ? `${itemsLength}개 파일을 ${formatDimensions(resizeTargetDimensions)} 기준으로 저장합니다. 비율 잠금은 ${
              keepAspectRatio ? "켜짐" : "꺼짐"
            } 상태입니다.`
          : itemsLength > 0 && resizeValidationMessage
            ? `${resizeValidationMessage} 입력을 수정하면 배치 가로·세로 값과 비율 잠금 옵션을 바로 적용할 수 있습니다.`
            : "먼저 리사이즈할 이미지를 추가하면 배치 가로·세로 값과 비율 잠금 옵션을 선택할 수 있습니다.",
      export: hasResults
        ? `총 ${itemsLength}개 중 ${successCount}개 크기 조절 완료, ${errorCount}개 실패입니다. 성공한 결과만 개별 저장하거나 ZIP으로 받을 수 있습니다.`
        : "크기 조절을 실행하면 파일별 결과와 다운로드 가능 상태를 이 단계에서 확인할 수 있습니다.",
    };
  } else if (isConvertTool) {
    statusByStep = {
      upload:
        itemsLength > 0
          ? `${itemsLength}개 파일이 준비되었습니다. 선택한 형식으로 한 번에 변환하며 원본과 같은 형식인 파일은 따로 실패로 표시합니다.`
          : "JPEG, PNG, WebP 이미지를 여러 개 추가하면 바로 포맷 변환을 시작할 수 있습니다.",
      options:
        itemsLength > 0
          ? `${itemsLength}개 파일에 ${getCompressionMimeTypeLabel(conversionOutputFormat)} 출력 형식을 적용합니다. ${
              isConvertQualityEnabled ? `${quality}% 품질` : "PNG 무손실 저장"
            } 기준으로 내보냅니다.`
          : "먼저 변환할 이미지를 추가하면 출력 형식과 품질을 선택할 수 있습니다.",
      export: hasResults
        ? `총 ${itemsLength}개 중 ${successCount}개 변환 완료, ${errorCount}개 실패입니다. 성공한 결과만 개별 저장하거나 ZIP으로 받을 수 있습니다.`
        : "포맷 변환을 실행하면 파일별 결과와 다운로드 가능 상태를 이 단계에서 확인할 수 있습니다.",
    };
  } else if (isRemoveExifTool) {
    statusByStep = {
      upload:
        itemsLength > 0
          ? `${itemsLength}개 파일이 준비되었습니다. 원본 형식으로 다시 저장해 공유 전 메타데이터를 정리합니다.`
          : "JPEG, PNG, WebP 이미지를 여러 개 추가하면 바로 EXIF 정리를 시작할 수 있습니다.",
      options:
        itemsLength > 0
          ? `${itemsLength}개 파일을 원본과 같은 형식으로 다시 저장합니다. GPS 위치, 기기, 촬영 시각 같은 정보가 함께 정리될 수 있습니다.`
          : "먼저 EXIF를 정리할 이미지를 추가하면 처리 방식과 현재 제한을 확인할 수 있습니다.",
      export: hasResults
        ? `총 ${itemsLength}개 중 ${successCount}개 정리 완료, ${errorCount}개 실패입니다. 성공한 결과만 개별 저장하거나 ZIP으로 받을 수 있습니다.`
        : "EXIF 정리를 실행하면 파일별 결과와 다운로드 가능 상태를 이 단계에서 확인할 수 있습니다.",
    };
  } else {
    statusByStep = {
      upload:
        itemsLength > 0
          ? `${fileCountLabel}. 선택한 이미지는 현재 브라우저 탭 안에서만 유지되며, 이후 도구 페이지에서도 같은 업로드 상태를 재사용할 수 있습니다.`
          : "JPEG, PNG, WebP 이미지를 업로드하면 이 단계에서 바로 미리보기와 오류 상태를 확인할 수 있습니다.",
      options:
        itemsLength > 0
          ? `${itemsLength}개 파일이 준비되어 있어 다음 단계에서는 도구별 옵션 UI만 추가하면 됩니다.`
          : "먼저 파일을 올리면 압축 품질, 크기, 출력 포맷, 메타데이터 제거 여부 같은 옵션 패널을 이 단계에 연결할 수 있습니다.",
      export:
        itemsLength > 0
          ? "현재 업로드 상태와 미리보기가 준비되어 있어 이후 단계에서 결과 비교, 개별 다운로드, 배치 내보내기를 붙일 수 있습니다."
          : "업로드가 준비되면 처리 결과 미리보기와 개별 다운로드, 배치 내보내기 흐름이 이 단계에 이어집니다.",
    };
  }

  const uploadStepMessage = repeatActionMessage ?? statusByStep.upload;
  const currentStepMessage =
    activeStep === "upload" ? uploadStepMessage : statusByStep[activeStep];

  return {
    currentStepMessage,
    uploadStepMessage,
  };
}
