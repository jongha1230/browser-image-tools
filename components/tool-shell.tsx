"use client";

import Image from "next/image";
import {
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type KeyboardEvent,
} from "react";

import { useImageUploads } from "@/components/image-upload-provider";
import {
  compressionOutputOptions,
  getCompressionDeltaPercent,
  getCompressionMimeTypeLabel,
  isQualityAdjustableFormat,
  resolveCompressionMimeType,
  type CompressionOutputFormat,
} from "@/lib/compress-image";
import {
  conversionOutputOptions,
  getConversionOutputDescription,
  getDefaultConversionMimeType,
} from "@/lib/convert-image";
import {
  createImageProcessingWorkerClient,
  isUnsupportedWorkerError,
  processImageFileOnMainThread,
} from "@/lib/image-processing-client";
import {
  createBatchZipFileName,
  createProcessingSignature,
  resolveImageProcessingPlan,
  type ImageProcessOptions,
  type ImageProcessVariant,
  type ProcessedImagePayload,
} from "@/lib/image-processing";
import {
  formatFileSize,
  getSupportedImageMimeType,
  shouldReplaceUploadQueue,
  supportedImageAccept,
  supportedImageTypesText,
  type SupportedImageMimeType,
} from "@/lib/image-upload";
import {
  calculateHeightFromWidth,
  calculateWidthFromHeight,
  fitWithinResizePreset,
  resizePresetOptions,
  validateResizeDimensions,
  type ResizeDimensions,
} from "@/lib/resize-image";
import { createStoredZipArchive } from "@/lib/zip-archive";

type StepKey = "upload" | "options" | "export";
type ToolShellVariant =
  | "default"
  | "compress"
  | "resize"
  | "convert"
  | "removeExif";

type QueueItemState = {
  status: "queued" | "processing" | "success" | "error";
  errorMessage?: string;
  result?: ProcessedImagePayload;
};

type ProcessingEngine = "worker" | "main";
type SummaryRow = {
  label: string;
  value: string;
};

const stepLabels: Record<StepKey, string> = {
  upload: "파일 준비",
  options: "옵션 선택",
  export: "결과 저장",
};

const sourceLabels = {
  drop: "드래그 앤 드롭",
  input: "파일 선택",
  paste: "클립보드 붙여넣기",
} as const;

type ToolShellProps = {
  title: string;
  description: string;
  primaryActionLabel: string;
  sectionId?: string;
  variant?: ToolShellVariant;
};

function getClipboardFiles(dataTransfer: DataTransfer | null) {
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

function loadImageElement(sourceUrl: string) {
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

function downloadBlob(blob: Blob, fileName: string) {
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

function yieldToBrowser() {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, 0);
  });
}

function formatCompressionSummary(originalBytes: number, outputBytes: number) {
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

function formatDimensions(dimensions: ResizeDimensions) {
  return `${dimensions.width} x ${dimensions.height}`;
}

function formatResizeScaleSummary(
  original: ResizeDimensions,
  target: ResizeDimensions,
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

function getResizeDimensionValue(value: string) {
  const trimmedValue = value.trim();

  if (!/^\d+$/.test(trimmedValue)) {
    return null;
  }

  return Number(trimmedValue);
}

function getVariantLabel(variant: ToolShellVariant) {
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

function getQueueStatusLabel(status: QueueItemState["status"]) {
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

function getEngineLabel(engine: ProcessingEngine) {
  return engine === "worker" ? "웹 워커 우선" : "메인 스레드";
}

function getToolVariant(variant: ToolShellVariant): ImageProcessVariant | null {
  if (variant === "default") {
    return null;
  }

  return variant;
}

function getDropzoneCopy(
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

export function ToolShell({
  title,
  description,
  primaryActionLabel,
  sectionId,
  variant = "default",
}: ToolShellProps) {
  const shellId = useId();
  const [activeStep, setActiveStep] = useState<StepKey>("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [outputFormat, setOutputFormat] =
    useState<CompressionOutputFormat>("original");
  const [conversionOutputFormat, setConversionOutputFormat] =
    useState<SupportedImageMimeType>("image/webp");
  const [quality, setQuality] = useState(82);
  const [resizeWidthValue, setResizeWidthValue] = useState("");
  const [resizeHeightValue, setResizeHeightValue] = useState("");
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [lastEditedDimension, setLastEditedDimension] = useState<
    "width" | "height"
  >("width");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPreparingZip, setIsPreparingZip] = useState(false);
  const [readyForReplacement, setReadyForReplacement] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [processingNote, setProcessingNote] = useState<string | null>(null);
  const [referenceDimensions, setReferenceDimensions] =
    useState<ResizeDimensions | null>(null);
  const [queueState, setQueueState] = useState<Record<string, QueueItemState>>(
    {},
  );
  const [processingEngine, setProcessingEngine] =
    useState<ProcessingEngine>("main");
  const dragDepthRef = useRef(0);
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionPanelRef = useRef<HTMLElement>(null);
  const workflowSummaryRef = useRef<HTMLDivElement>(null);
  const runIdRef = useRef(0);
  const workerClientRef =
    useRef<ReturnType<typeof createImageProcessingWorkerClient> | null>(null);
  const previousItemCountRef = useRef(0);
  const previousHasResultsRef = useRef(false);
  const {
    addFiles,
    clearErrors,
    clearItems,
    errors,
    items,
    lastSource,
    removeItem,
  } = useImageUploads();
  const titleId = `${shellId}-title`;
  const descriptionId = `${shellId}-description`;
  const dropzoneTitleId = `${shellId}-dropzone-title`;
  const dropzoneHintId = `${shellId}-dropzone-hint`;
  const uploadMessagesId = `${shellId}-upload-messages`;
  const processingErrorId = `${shellId}-processing-error`;
  const processingNoteId = `${shellId}-processing-note`;
  const progressLabelId = `${shellId}-progress-label`;
  const progressHintId = `${shellId}-progress-hint`;
  const resizeValidationId = `${shellId}-resize-validation`;
  const stepStatusId = `${shellId}-step-status`;
  const isCompressTool = variant === "compress";
  const isResizeTool = variant === "resize";
  const isConvertTool = variant === "convert";
  const isRemoveExifTool = variant === "removeExif";
  const toolVariant = getToolVariant(variant);
  const selectedItem = items[0] ?? null;
  const selectedItemId = selectedItem?.id ?? null;
  const selectedPreviewUrl = selectedItem?.previewUrl ?? null;
  const selectedMimeType = selectedItem
    ? getSupportedImageMimeType(selectedItem.file)
    : null;
  const targetMimeType =
    isCompressTool && selectedItem
      ? resolveCompressionMimeType(selectedItem.file, outputFormat)
      : null;
  const isQualityEnabled = targetMimeType
    ? isQualityAdjustableFormat(targetMimeType)
    : true;
  const isConvertQualityEnabled = isQualityAdjustableFormat(
    conversionOutputFormat,
  );
  const resizeValidation = isResizeTool
    ? validateResizeDimensions(resizeWidthValue, resizeHeightValue)
    : null;
  const resizeTargetDimensions =
    isResizeTool && resizeValidation && resizeValidation.ok
      ? {
          width: resizeValidation.width,
          height: resizeValidation.height,
        }
      : null;
  const resizeValidationMessage =
    isResizeTool && resizeValidation && !resizeValidation.ok
      ? resizeValidation.message
      : null;
  const skippedConvertCount = isConvertTool
    ? items.filter(
        (item) => getSupportedImageMimeType(item.file) === conversionOutputFormat,
      ).length
    : 0;
  const totalSize = items.reduce((sum, item) => sum + item.file.size, 0);
  const hasItems = items.length > 0;
  const fileCountLabel =
    hasItems ? `${items.length}개 파일 준비됨` : "아직 업로드된 파일이 없음";

  let currentOptions: ImageProcessOptions | null = null;

  if (isCompressTool) {
    currentOptions = {
      variant: "compress",
      outputFormat,
      quality,
    };
  } else if (isResizeTool && resizeValidation && resizeValidation.ok) {
    currentOptions = {
      variant: "resize",
      width: resizeValidation.width,
      height: resizeValidation.height,
      keepAspectRatio,
    };
  } else if (isConvertTool) {
    currentOptions = {
      variant: "convert",
      targetMimeType: conversionOutputFormat,
      quality,
    };
  } else if (isRemoveExifTool) {
    currentOptions = {
      variant: "removeExif",
    };
  }

  const processingSignature = createProcessingSignature(currentOptions);
  const itemIdsSignature = items.map((item) => item.id).join("|");
  const successCount = items.filter(
    (item) => queueState[item.id]?.status === "success",
  ).length;
  const errorCount = items.filter(
    (item) => queueState[item.id]?.status === "error",
  ).length;
  const processingCount = items.filter(
    (item) => queueState[item.id]?.status === "processing",
  ).length;
  const completedCount = successCount + errorCount;
  const progressPercent =
    items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;
  const hasResults = completedCount > 0 || processingCount > 0;
  const canProcess =
    toolVariant !== null &&
    items.length > 0 &&
    !isProcessing &&
    (!isResizeTool || Boolean(resizeValidation?.ok));
  const canDownloadZip =
    toolVariant !== null && successCount > 0 && !isProcessing && !isPreparingZip;
  const showProgress = toolVariant !== null && (isProcessing || hasResults);
  const selectedItemState = selectedItem
    ? (queueState[selectedItem.id] ?? { status: "queued" })
    : null;
  const hasQueuedItems = items.some(
    (item) => (queueState[item.id]?.status ?? "queued") === "queued",
  );
  const shouldPrioritizeZipDownload = successCount > 1;
  const selectedResult =
    selectedItemState?.status === "success" ? selectedItemState.result ?? null : null;
  const isLosslessPngCompression =
    isCompressTool && targetMimeType === "image/png";
  const shouldReplaceOnAdd = shouldReplaceUploadQueue({
    existingItemCount: items.length,
    existingStatus: selectedItemState?.status ?? null,
    isProcessing,
    readyForReplacement,
  });
  const repeatActionMessage = readyForReplacement
    ? "다운로드를 시작했습니다. 새 파일을 추가하면 현재 단일 결과와 미리보기가 자동으로 새 작업으로 교체됩니다."
    : selectedItemState?.status === "error" && shouldReplaceOnAdd
      ? "실패한 단일 작업은 새 파일을 추가하면 자동으로 교체됩니다."
      : null;
  const dropzoneTitle = !hasItems
    ? "이미지를 끌어 놓거나 파일 선택으로 여러 개 추가하세요"
    : shouldReplaceOnAdd
      ? "다음 파일을 추가하면 새 작업으로 바로 시작합니다"
      : "이미지를 더 추가하거나 현재 큐를 조정하세요";
  const dropzoneHint = !hasItems
    ? `지원 형식은 ${supportedImageTypesText}입니다. 붙여넣기 이미지는 이 페이지에서 바로 추가할 수 있고, 드롭 영역에 포커스한 뒤 Enter 또는 Space 로도 파일 선택 창을 열 수 있습니다.`
    : shouldReplaceOnAdd
      ? `새 파일을 선택, 드롭, 붙여넣기하면 현재 단일 작업을 자동으로 교체합니다. 여러 파일을 한 번에 고르면 이전 단일 세션 대신 새 배치로 시작합니다.`
      : `추가한 파일은 현재 큐 뒤에 이어 붙습니다. ${supportedImageTypesText} 이미지를 다시 선택하거나 클립보드 붙여넣기로 바로 더할 수 있습니다.`;
  const showClearQueueAction = hasItems && !shouldReplaceOnAdd;
  const startChecklist = toolVariant
    ? [
        "JPEG, PNG, WebP 이미지를 드래그, 파일 선택, 붙여넣기로 추가",
        `옵션을 확인한 뒤 ${primaryActionLabel}`,
        "성공한 결과를 개별 파일 또는 ZIP으로 저장",
      ]
    : [
        "JPEG, PNG, WebP 이미지를 업로드",
        "현재 업로드 상태와 미리보기를 확인",
        "다음 단계 옵션과 배치 내보내기 흐름으로 이어가기",
      ];
  const dropzoneDescriptionIds =
    [
      dropzoneHintId,
      errors.length > 0 ? uploadMessagesId : null,
      processingError ? processingErrorId : null,
    ]
      .filter((value): value is string => Boolean(value))
      .join(" ") || undefined;
  const progressValueText =
    items.length > 0
      ? `${completedCount}개 완료, ${successCount}개 성공, ${errorCount}개 실패`
      : "실행 대기";
  const queueSummaryRows: SummaryRow[] = [
    {
      label: "준비 파일",
      value: `${items.length}개`,
    },
    {
      label: "총 업로드 용량",
      value: hasItems ? formatFileSize(totalSize) : "0 B",
    },
    {
      label: "성공 / 실패",
      value: hasResults
        ? `${successCount}개 / ${errorCount}개`
        : items.length > 0
          ? "실행 전"
          : "아직 없음",
    },
  ];
  const workflowStatusTone: QueueItemState["status"] = isProcessing
    ? "processing"
    : hasResults
      ? successCount > 0
        ? "success"
        : "error"
      : "queued";
  const workflowStatusLabel = isProcessing
    ? "처리 중"
    : hasResults
      ? successCount > 0
        ? "결과 준비됨"
        : "실패"
      : "실행 대기";

  let previewPlan: ReturnType<typeof resolveImageProcessingPlan> | null = null;

  if (selectedItem && referenceDimensions && currentOptions) {
    try {
      previewPlan = resolveImageProcessingPlan(
        selectedItem.file,
        referenceDimensions,
        currentOptions,
      );
    } catch {
      previewPlan = null;
    }
  }

  const selectedSummaryRows: SummaryRow[] = [];
  const selectedResultRows: SummaryRow[] = [];

  if (selectedItem) {
    selectedSummaryRows.push(
      { label: "기준 파일", value: selectedItem.file.name },
      {
        label: "원본 형식",
        value: selectedMimeType
          ? getCompressionMimeTypeLabel(selectedMimeType)
          : "확인 불가",
      },
    );

    if (isCompressTool) {
      selectedSummaryRows.push(
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
      selectedSummaryRows.push(
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
      selectedSummaryRows.push(
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
      selectedSummaryRows.push(
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
          value: `${items.length}개 파일`,
        },
      );
    }
  }

  if (selectedItem && selectedResult) {
    selectedResultRows.push(
      { label: "저장 이름", value: selectedResult.fileName },
      {
        label: "출력 형식",
        value: getCompressionMimeTypeLabel(selectedResult.mimeType),
      },
      { label: "결과 크기", value: formatFileSize(selectedResult.blob.size) },
      { label: "해상도", value: formatDimensions(selectedResult) },
    );

    if (toolVariant === "resize") {
      selectedResultRows.push({
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
      selectedResultRows.push({
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
      selectedResultRows.push({
        label: "원본 형식",
        value: selectedMimeType
          ? getCompressionMimeTypeLabel(selectedMimeType)
          : "확인 불가",
      });
    }
  }

  const compressionOptionDescription =
    isLosslessPngCompression
      ? "PNG는 무손실 재저장이라 스크린샷, 차트, UI 이미지처럼 이미 최적화된 파일은 용량이 오히려 커질 수 있습니다. 더 작게 만들려면 WebP 또는 JPEG를 선택해 주세요."
      : compressionOutputOptions.find((option) => option.value === outputFormat)
          ?.description ?? "출력 형식을 선택해 압축 결과를 저장합니다.";
  const selectedCompressionGrowthMessage =
    isCompressTool &&
    selectedItem &&
    selectedResult &&
    selectedResult.blob.size > selectedItem.file.size
      ? `현재 설정에서는 원본보다 ${formatFileSize(
          selectedResult.blob.size - selectedItem.file.size,
        )} 커졌습니다. PNG 무손실 재저장일 수 있으니 더 작게 만들려면 WebP 또는 JPEG를 선택해 주세요.`
      : null;

  function focusWorkspaceRegion(node: HTMLElement | null) {
    if (!node || typeof window === "undefined") {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.requestAnimationFrame(() => {
      node.focus({ preventScroll: true });
      node.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  useEffect(() => {
    setProcessingEngine(typeof Worker === "undefined" ? "main" : "worker");
  }, []);

  useEffect(() => {
    return () => {
      runIdRef.current += 1;
      workerClientRef.current?.terminate();
      workerClientRef.current = null;
    };
  }, []);

  function handleIncomingFiles(
    files: Iterable<File> | ArrayLike<File> | null | undefined,
    source: "drop" | "input" | "paste",
  ) {
    const replaceCurrentQueue = shouldReplaceOnAdd;
    const acceptedCount = addFiles(
      files,
      source,
      replaceCurrentQueue ? "replace" : "append",
    );

    if (acceptedCount > 0) {
      setReadyForReplacement(false);

      if (replaceCurrentQueue) {
        window.setTimeout(() => {
          focusWorkspaceRegion(optionPanelRef.current);
        }, 120);
      }
    }
  }

  const handleWindowPaste = useEffectEvent((event: ClipboardEvent) => {
    const target = event.target;

    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      (target instanceof HTMLElement && target.isContentEditable)
    ) {
      return;
    }

    handleIncomingFiles(getClipboardFiles(event.clipboardData), "paste");
  });

  useEffect(() => {
    function onPaste(event: ClipboardEvent) {
      handleWindowPaste(event);
    }

    window.addEventListener("paste", onPaste);

    return () => {
      window.removeEventListener("paste", onPaste);
    };
  }, []);

  useEffect(() => {
    setQueueState({});
    setProcessingError(null);
    setProcessingNote(null);
    setReadyForReplacement(false);
  }, [processingSignature, variant]);

  useEffect(() => {
    setQueueState((current) => {
      if (items.length === 0) {
        return {};
      }

      const nextEntries = Object.fromEntries(
        items.flatMap((item) =>
          current[item.id] ? [[item.id, current[item.id]]] : [],
        ),
      );
      const currentKeys = Object.keys(current);
      const nextKeys = Object.keys(nextEntries);

      if (
        currentKeys.length === nextKeys.length &&
        currentKeys.every((key) => current[key] === nextEntries[key])
      ) {
        return current;
      }

      return nextEntries;
    });
    setProcessingError(null);
    setProcessingNote(null);

    if (items.length === 0) {
      setReadyForReplacement(false);
    }
  }, [itemIdsSignature, items]);

  useEffect(() => {
    if (!selectedPreviewUrl) {
      setReferenceDimensions(null);
      setActiveStep("upload");

      if (isResizeTool) {
        setResizeWidthValue("");
        setResizeHeightValue("");
        setKeepAspectRatio(true);
        setLastEditedDimension("width");
      }

      if (isConvertTool) {
        setConversionOutputFormat("image/webp");
      }

      return;
    }

    let isCancelled = false;

    loadImageElement(selectedPreviewUrl)
      .then((image) => {
        if (isCancelled) {
          return;
        }

        const nextDimensions = {
          width: image.naturalWidth,
          height: image.naturalHeight,
        };

        setReferenceDimensions(nextDimensions);

        if (isResizeTool) {
          setResizeWidthValue(String(nextDimensions.width));
          setResizeHeightValue(String(nextDimensions.height));
          setKeepAspectRatio(true);
          setLastEditedDimension("width");
        }

        if (isConvertTool && selectedMimeType) {
          setConversionOutputFormat(getDefaultConversionMimeType(selectedMimeType));
        }
      })
      .catch((error: unknown) => {
        if (isCancelled) {
          return;
        }

        setProcessingError(
          error instanceof Error
            ? error.message
            : "선택한 이미지 정보를 읽지 못했습니다. 다시 시도해 주세요.",
        );
      });

    return () => {
      isCancelled = true;
    };
  }, [isConvertTool, isResizeTool, selectedItemId, selectedMimeType, selectedPreviewUrl]);

  useEffect(() => {
    if (items.length === 0) {
      setActiveStep("upload");
      return;
    }

    if (!isProcessing && hasQueuedItems) {
      setActiveStep("options");
      return;
    }

    if (isProcessing || hasResults) {
      setActiveStep("export");
      return;
    }

    setActiveStep("options");
  }, [hasQueuedItems, hasResults, isProcessing, items.length]);

  useEffect(() => {
    if (!hasItems) {
      previousItemCountRef.current = 0;
      return;
    }

    if (previousItemCountRef.current === 0 && items.length > 0) {
      focusWorkspaceRegion(optionPanelRef.current);
    }

    previousItemCountRef.current = items.length;
  }, [hasItems, items.length]);

  useEffect(() => {
    if (!hasResults) {
      previousHasResultsRef.current = false;
      return;
    }

    if (!previousHasResultsRef.current) {
      focusWorkspaceRegion(workflowSummaryRef.current);
    }

    previousHasResultsRef.current = true;
  }, [hasResults]);

  function openFilePicker() {
    if (isProcessing) {
      return;
    }

    inputRef.current?.click();
  }

  function handleDropzoneKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || isProcessing) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFilePicker();
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    handleIncomingFiles(event.currentTarget.files, "input");
    event.currentTarget.value = "";
  }

  function handleDragEnter(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    dragDepthRef.current += 1;
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);

    if (dragDepthRef.current === 0) {
      setIsDragging(false);
    }
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    dragDepthRef.current = 0;
    setIsDragging(false);
    handleIncomingFiles(event.dataTransfer.files, "drop");
  }

  function handleQualityChange(event: ChangeEvent<HTMLInputElement>) {
    setQuality(Number(event.currentTarget.value));
    setProcessingError(null);
    setProcessingNote(null);

    if (items.length > 0) {
      setActiveStep("options");
    }
  }

  function handleCompressOutputChange(event: ChangeEvent<HTMLSelectElement>) {
    setOutputFormat(event.currentTarget.value as CompressionOutputFormat);
    setProcessingError(null);
    setProcessingNote(null);

    if (items.length > 0) {
      setActiveStep("options");
    }
  }

  function handleConversionOutputChange(event: ChangeEvent<HTMLSelectElement>) {
    setConversionOutputFormat(event.currentTarget.value as SupportedImageMimeType);
    setProcessingError(null);
    setProcessingNote(null);

    if (items.length > 0) {
      setActiveStep("options");
    }
  }

  function handleResizeWidthChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.currentTarget.value;

    setResizeWidthValue(nextValue);
    setLastEditedDimension("width");
    setProcessingError(null);
    setProcessingNote(null);

    if (items.length > 0) {
      setActiveStep("options");
    }

    if (!keepAspectRatio || !referenceDimensions) {
      return;
    }

    const nextWidth = getResizeDimensionValue(nextValue);

    if (nextWidth === null || nextWidth < 1) {
      return;
    }

    setResizeHeightValue(
      String(calculateHeightFromWidth(nextWidth, referenceDimensions)),
    );
  }

  function handleResizeHeightChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.currentTarget.value;

    setResizeHeightValue(nextValue);
    setLastEditedDimension("height");
    setProcessingError(null);
    setProcessingNote(null);

    if (items.length > 0) {
      setActiveStep("options");
    }

    if (!keepAspectRatio || !referenceDimensions) {
      return;
    }

    const nextHeight = getResizeDimensionValue(nextValue);

    if (nextHeight === null || nextHeight < 1) {
      return;
    }

    setResizeWidthValue(
      String(calculateWidthFromHeight(nextHeight, referenceDimensions)),
    );
  }

  function handleKeepAspectRatioChange(event: ChangeEvent<HTMLInputElement>) {
    const nextChecked = event.currentTarget.checked;

    setKeepAspectRatio(nextChecked);
    setProcessingError(null);
    setProcessingNote(null);

    if (items.length > 0) {
      setActiveStep("options");
    }

    if (!nextChecked || !referenceDimensions) {
      return;
    }

    if (lastEditedDimension === "height") {
      const nextHeight = getResizeDimensionValue(resizeHeightValue);

      if (nextHeight === null || nextHeight < 1) {
        return;
      }

      setResizeWidthValue(
        String(calculateWidthFromHeight(nextHeight, referenceDimensions)),
      );
      return;
    }

    const nextWidth = getResizeDimensionValue(resizeWidthValue);

    if (nextWidth === null || nextWidth < 1) {
      return;
    }

    setResizeHeightValue(
      String(calculateHeightFromWidth(nextWidth, referenceDimensions)),
    );
  }

  function applyResizePreset(preset: ResizeDimensions) {
    setProcessingError(null);
    setProcessingNote(null);

    if (items.length > 0) {
      setActiveStep("options");
    }

    const nextDimensions =
      keepAspectRatio && referenceDimensions
        ? fitWithinResizePreset(referenceDimensions, preset)
        : preset;

    setResizeWidthValue(String(nextDimensions.width));
    setResizeHeightValue(String(nextDimensions.height));
    setLastEditedDimension("width");
  }

  function getWorkerClient() {
    if (!workerClientRef.current) {
      workerClientRef.current = createImageProcessingWorkerClient();
    }

    return workerClientRef.current;
  }

  async function handleProcessAll() {
    if (!toolVariant) {
      return;
    }

    if (items.length === 0) {
      setProcessingError("먼저 처리할 이미지를 추가해 주세요.");
      setActiveStep("upload");
      return;
    }

    if (isResizeTool && (!resizeValidation || !resizeValidation.ok)) {
      setProcessingError(
        resizeValidation?.message ?? "가로와 세로 값을 다시 확인해 주세요.",
      );
      setActiveStep("options");
      return;
    }

    if (!currentOptions) {
      setProcessingError("현재 설정을 확인한 뒤 다시 시도해 주세요.");
      setActiveStep("options");
      return;
    }

    const runId = runIdRef.current + 1;
    let engine = processingEngine;

    runIdRef.current = runId;
    setIsProcessing(true);
    setProcessingError(null);
    setProcessingNote(null);
    setReadyForReplacement(false);
    setActiveStep("export");
    setQueueState(
      Object.fromEntries(
        items.map((item) => [
          item.id,
          { status: "queued" } satisfies QueueItemState,
        ]),
      ),
    );

    for (const item of items) {
      if (runIdRef.current !== runId) {
        return;
      }

      setQueueState((current) => ({
        ...current,
        [item.id]: {
          status: "processing",
        },
      }));

      try {
        let result: ProcessedImagePayload;

        if (engine === "worker") {
          try {
            result = await getWorkerClient().process(item.file, currentOptions);
          } catch (error: unknown) {
            if (!isUnsupportedWorkerError(error)) {
              throw error;
            }

            workerClientRef.current?.terminate();
            workerClientRef.current = null;
            engine = "main";
            setProcessingEngine("main");
            setProcessingNote(
              "현재 브라우저에서는 백그라운드 작업자를 사용할 수 없어 이번 실행은 메인 스레드에서 이어집니다. 처리 중에는 탭 반응이 더 느려질 수 있지만 결과 형식과 저장 흐름은 같습니다.",
            );
            result = await processImageFileOnMainThread(
              item.file,
              item.previewUrl,
              currentOptions,
            );
          }
        } else {
          result = await processImageFileOnMainThread(
            item.file,
            item.previewUrl,
            currentOptions,
          );
        }

        if (runIdRef.current !== runId) {
          return;
        }

        setQueueState((current) => ({
          ...current,
          [item.id]: {
            status: "success",
            result,
          },
        }));
      } catch (error: unknown) {
        if (runIdRef.current !== runId) {
          return;
        }

        setQueueState((current) => ({
          ...current,
          [item.id]: {
            status: "error",
            errorMessage:
              error instanceof Error
                ? error.message
                : "이미지 처리 중 오류가 발생했습니다. 다시 시도해 주세요.",
          },
        }));
      }

      await yieldToBrowser();
    }

    if (engine === "worker") {
      setProcessingEngine("worker");
    }

    setIsProcessing(false);
  }

  function moveToNextUploadStep() {
    setReadyForReplacement(true);
    setActiveStep("upload");

    window.setTimeout(() => {
      focusWorkspaceRegion(dropzoneRef.current);
    }, 120);
  }

  async function handleDownloadZip() {
    if (!toolVariant || successCount === 0) {
      return;
    }

    setIsPreparingZip(true);
    setProcessingError(null);

    try {
      const entries = await Promise.all(
        items
          .map((item) => queueState[item.id]?.result)
          .filter((result): result is ProcessedImagePayload => result !== undefined)
          .map(async (result) => ({
            fileName: result.fileName,
            data: new Uint8Array(await result.blob.arrayBuffer()),
          })),
      );
      const archive = createStoredZipArchive(entries);

      downloadBlob(
        new Blob([archive], { type: "application/zip" }),
        createBatchZipFileName(toolVariant),
      );

      if (items.length === 1 && successCount === 1) {
        moveToNextUploadStep();
      }
    } catch (error: unknown) {
      setProcessingError(
        error instanceof Error
          ? error.message
          : "ZIP 파일을 만드는 중 오류가 발생했습니다. 다시 시도해 주세요.",
      );
    } finally {
      setIsPreparingZip(false);
    }
  }

  function handleDownloadResult(itemId: string) {
    const result = queueState[itemId]?.result;

    if (!result) {
      return;
    }

    downloadBlob(result.blob, result.fileName);

    if (items.length === 1 && selectedItemId === itemId) {
      moveToNextUploadStep();
    }
  }

  let statusByStep: Record<StepKey, string>;

  if (isCompressTool) {
    statusByStep = {
      upload:
        items.length > 0
          ? `${items.length}개 파일이 준비되었습니다. 같은 압축 기준을 한 번에 적용하고 결과는 이 브라우저 안에서만 생성됩니다.`
          : "JPEG, PNG, WebP 이미지를 여러 개 추가하면 바로 압축을 시작할 수 있습니다.",
      options:
        items.length > 0 && targetMimeType
          ? `${items.length}개 파일에 ${getCompressionMimeTypeLabel(targetMimeType)} 형식과 ${
              isQualityEnabled ? `${quality}% 품질` : "무손실 재저장"
            }을 일괄 적용합니다.${
              targetMimeType === "image/png"
                ? " PNG 무손실 재저장은 원본보다 커질 수 있습니다."
                : ""
            }`
          : "먼저 압축할 이미지를 추가하면 배치 품질과 출력 형식을 선택할 수 있습니다.",
      export:
        hasResults
          ? `총 ${items.length}개 중 ${successCount}개 압축 완료, ${errorCount}개 실패입니다. 성공한 결과만 개별 저장하거나 ZIP으로 받을 수 있습니다.`
          : "압축을 실행하면 파일별 결과와 다운로드 가능 상태를 이 단계에서 확인할 수 있습니다.",
    };
  } else if (isResizeTool) {
    statusByStep = {
      upload:
        items.length > 0
          ? `${items.length}개 파일이 준비되었습니다. 목표 크기를 기준으로 각 파일을 계산하며 비율 유지 여부에 따라 결과 해상도가 달라집니다.`
          : "JPEG, PNG, WebP 이미지를 여러 개 추가하면 바로 크기 조절을 시작할 수 있습니다.",
      options:
        items.length > 0 && resizeTargetDimensions
          ? `${items.length}개 파일을 ${formatDimensions(resizeTargetDimensions)} 기준으로 저장합니다. 비율 잠금은 ${
              keepAspectRatio ? "켜짐" : "꺼짐"
            } 상태입니다.`
          : items.length > 0 && resizeValidationMessage
            ? `${resizeValidationMessage} 입력을 수정하면 배치 가로·세로 값과 비율 잠금 옵션을 바로 적용할 수 있습니다.`
            : "먼저 리사이즈할 이미지를 추가하면 배치 가로·세로 값과 비율 잠금 옵션을 선택할 수 있습니다.",
      export:
        hasResults
          ? `총 ${items.length}개 중 ${successCount}개 크기 조절 완료, ${errorCount}개 실패입니다. 성공한 결과만 개별 저장하거나 ZIP으로 받을 수 있습니다.`
          : "크기 조절을 실행하면 파일별 결과와 다운로드 가능 상태를 이 단계에서 확인할 수 있습니다.",
    };
  } else if (isConvertTool) {
    statusByStep = {
      upload:
        items.length > 0
          ? `${items.length}개 파일이 준비되었습니다. 선택한 형식으로 한 번에 변환하며 원본과 같은 형식인 파일은 따로 실패로 표시합니다.`
          : "JPEG, PNG, WebP 이미지를 여러 개 추가하면 바로 포맷 변환을 시작할 수 있습니다.",
      options:
        items.length > 0
          ? `${items.length}개 파일에 ${getCompressionMimeTypeLabel(conversionOutputFormat)} 출력 형식을 적용합니다. ${
              isConvertQualityEnabled ? `${quality}% 품질` : "PNG 무손실 저장"
            } 기준으로 내보냅니다.`
          : "먼저 변환할 이미지를 추가하면 출력 형식과 품질을 선택할 수 있습니다.",
      export:
        hasResults
          ? `총 ${items.length}개 중 ${successCount}개 변환 완료, ${errorCount}개 실패입니다. 성공한 결과만 개별 저장하거나 ZIP으로 받을 수 있습니다.`
          : "포맷 변환을 실행하면 파일별 결과와 다운로드 가능 상태를 이 단계에서 확인할 수 있습니다.",
    };
  } else if (isRemoveExifTool) {
    statusByStep = {
      upload:
        items.length > 0
          ? `${items.length}개 파일이 준비되었습니다. 원본 형식으로 다시 저장해 공유 전 메타데이터를 정리합니다.`
          : "JPEG, PNG, WebP 이미지를 여러 개 추가하면 바로 EXIF 정리를 시작할 수 있습니다.",
      options:
        items.length > 0
          ? `${items.length}개 파일을 원본과 같은 형식으로 다시 저장합니다. GPS 위치, 기기, 촬영 시각 같은 정보가 함께 정리될 수 있습니다.`
          : "먼저 EXIF를 정리할 이미지를 추가하면 처리 방식과 현재 제한을 확인할 수 있습니다.",
      export:
        hasResults
          ? `총 ${items.length}개 중 ${successCount}개 정리 완료, ${errorCount}개 실패입니다. 성공한 결과만 개별 저장하거나 ZIP으로 받을 수 있습니다.`
          : "EXIF 정리를 실행하면 파일별 결과와 다운로드 가능 상태를 이 단계에서 확인할 수 있습니다.",
    };
  } else {
    statusByStep = {
      upload:
        items.length > 0
          ? `${fileCountLabel}. 선택한 이미지는 현재 브라우저 탭 안에서만 유지되며, 이후 도구 페이지에서도 같은 업로드 상태를 재사용할 수 있습니다.`
          : `JPEG, PNG, WebP 이미지를 업로드하면 이 단계에서 바로 미리보기와 오류 상태를 확인할 수 있습니다.`,
      options:
        items.length > 0
          ? `${items.length}개 파일이 준비되어 있어 다음 단계에서는 도구별 옵션 UI만 추가하면 됩니다.`
          : "먼저 파일을 올리면 압축 품질, 크기, 출력 포맷, 메타데이터 제거 여부 같은 옵션 패널을 이 단계에 연결할 수 있습니다.",
      export:
        items.length > 0
          ? `현재 업로드 상태와 미리보기가 준비되어 있어 이후 단계에서 결과 비교, 개별 다운로드, 배치 내보내기를 붙일 수 있습니다.`
          : "업로드가 준비되면 처리 결과 미리보기와 개별 다운로드, 배치 내보내기 흐름이 이 단계에 이어집니다.",
    };
  }

  const uploadStepMessage = repeatActionMessage ?? statusByStep.upload;
  const currentStepMessage =
    activeStep === "upload" ? uploadStepMessage : statusByStep[activeStep];

  function renderWorkflowSidebar() {
    if (!selectedItem || !selectedItemState) {
      return null;
    }

    const sidebarRows =
      selectedResultRows.length > 0 ? selectedResultRows : queueSummaryRows;

    return (
      <section className="card tool-shell__workflow-sidebar">
        <div className="tool-shell__workflow-section">
          <div className="tool-shell__workflow-heading">
            <h3>선택한 파일</h3>
            <span
              className="tool-shell__queue-status"
              data-status={selectedItemState.status}
            >
              {getQueueStatusLabel(selectedItemState.status)}
            </span>
          </div>
          <dl className="tool-shell__stat-list tool-shell__stat-list--compact">
            {selectedSummaryRows.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div
          aria-atomic="true"
          aria-live="polite"
          className="tool-shell__workflow-section tool-shell__workflow-section--accent"
          ref={workflowSummaryRef}
          role="status"
          tabIndex={-1}
        >
          <div className="tool-shell__workflow-heading">
            <h3>{hasResults ? "결과와 저장" : "실행 준비"}</h3>
            <span
              className="tool-shell__queue-status"
              data-status={workflowStatusTone}
            >
              {workflowStatusLabel}
            </span>
          </div>

          <p className="tool-shell__helper">
            {hasResults
              ? `총 ${items.length}개 중 ${successCount}개 성공, ${errorCount}개 실패입니다.`
              : isProcessing
                ? `${items.length}개 파일을 순서대로 처리하고 있습니다.`
                : currentStepMessage}
          </p>

          <div className="tool-shell__actions tool-shell__actions--stack">
            {toolVariant ? (
              <>
                <button
                  className={hasResults ? "button-muted" : "button-link"}
                  disabled={!canProcess}
                  onClick={handleProcessAll}
                  type="button"
                >
                  {isProcessing ? "배치 처리 중..." : primaryActionLabel}
                </button>
                <button
                  className={
                    shouldPrioritizeZipDownload ||
                    (hasResults && !selectedResult)
                      ? "button-link"
                      : "button-muted"
                  }
                  disabled={!canDownloadZip}
                  onClick={handleDownloadZip}
                  type="button"
                >
                  {isPreparingZip ? "ZIP 준비 중..." : "성공 파일 ZIP 다운로드"}
                </button>
                {selectedResult && !shouldPrioritizeZipDownload ? (
                  <button
                    className="button-link"
                    onClick={() => handleDownloadResult(selectedItem.id)}
                    type="button"
                  >
                    대표 결과 다운로드
                  </button>
                ) : null}
              </>
            ) : (
              <>
                <button className="button-link" disabled type="button">
                  {primaryActionLabel}
                </button>
                <button className="button-muted" disabled type="button">
                  배치 내보내기 연결 예정
                </button>
              </>
            )}
          </div>

          {repeatActionMessage ? (
            <p className="tool-shell__helper tool-shell__helper--next-action">
              {repeatActionMessage}
            </p>
          ) : null}

          {showProgress ? (
            <div className="tool-shell__progress tool-shell__progress--compact">
              <div className="tool-shell__progress-header">
                <strong id={progressLabelId}>배치 진행률</strong>
                <span>{`${completedCount}/${items.length} 완료`}</span>
              </div>
              <div
                aria-describedby={progressHintId}
                aria-labelledby={progressLabelId}
                aria-valuemax={Math.max(items.length, 1)}
                aria-valuemin={0}
                aria-valuenow={completedCount}
                aria-valuetext={progressValueText}
                className="tool-shell__progress-bar"
                role="progressbar"
              >
                <span style={{ width: `${progressPercent}%` }} />
              </div>
              <p className="tool-shell__helper" id={progressHintId}>
                {processingCount > 0
                  ? `${processingCount}개 파일을 현재 처리 중입니다.`
                  : shouldPrioritizeZipDownload
                    ? `성공한 결과가 여러 개면 ZIP으로 한 번에 받고, 개별 파일은 아래 카드의 결과 다운로드 버튼으로 받을 수 있습니다.`
                    : `성공한 결과는 바로 개별 다운로드하거나 ZIP으로 한 번에 받을 수 있습니다.`}
              </p>
            </div>
          ) : null}

          {selectedItemState.status === "processing" ? (
            <p className="tool-shell__helper">
              대표 파일을 처리하고 있습니다. 완료되면 이 영역에 결과 요약과
              다운로드 버튼이 먼저 표시됩니다.
            </p>
          ) : null}

          {selectedItemState.status === "error" ? (
            <p className="tool-shell__helper tool-shell__helper--error">
              {selectedItemState.errorMessage}
            </p>
          ) : null}

          {selectedCompressionGrowthMessage ? (
            <p className="tool-shell__helper">
              {selectedCompressionGrowthMessage}
            </p>
          ) : null}

          <dl className="tool-shell__stat-list tool-shell__stat-list--compact">
            {sidebarRows.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-busy={isProcessing || isPreparingZip}
      aria-describedby={descriptionId}
      aria-labelledby={titleId}
      className="tool-shell"
      id={sectionId}
    >
      <div className="tool-shell__header">
        <div>
          <h2 id={titleId}>{title} 작업 패널</h2>
          <p id={descriptionId}>{description}</p>
        </div>
        <span className="tool-shell__badge">{getVariantLabel(variant)}</span>
      </div>

      <div className="tool-shell__workspace">
        <div className="tool-shell__primary-grid">
          <div
            aria-describedby={dropzoneDescriptionIds}
            aria-labelledby={dropzoneTitleId}
            className="tool-shell__dropzone"
            data-dragging={isDragging}
            data-has-items={hasItems}
            data-ready-for-replacement={shouldReplaceOnAdd}
            onKeyDown={handleDropzoneKeyDown}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            ref={dropzoneRef}
            role="group"
            tabIndex={isProcessing ? -1 : 0}
          >
            <input
              ref={inputRef}
              accept={supportedImageAccept}
              aria-describedby={dropzoneDescriptionIds}
              aria-label="이미지 파일 선택"
              className="visually-hidden"
              disabled={isProcessing}
              multiple
              onChange={handleInputChange}
              type="file"
            />
            <strong id={dropzoneTitleId}>{dropzoneTitle}</strong>
            <p id={dropzoneHintId}>
              {dropzoneHint}
              <span className="visually-hidden">
                키보드 사용 시 Ctrl + V, Enter, Space를 지원합니다.
              </span>
            </p>
            <div className="tool-shell__drop-actions">
              <button className="button-link" onClick={openFilePicker} type="button">
                파일 선택
              </button>
              {showClearQueueAction ? (
                <button
                  className="button-muted"
                  disabled={isProcessing}
                  onClick={clearItems}
                  type="button"
                >
                  업로드 목록 비우기
                </button>
              ) : null}
            </div>
            <ul className="tool-shell__drop-highlights">
              <li>브라우저 안에서만 파일 보관 및 처리</li>
              <li>JPEG, PNG, WebP 파일만 허용</li>
              <li>
                {getDropzoneCopy(
                  variant,
                  keepAspectRatio,
                  skippedConvertCount,
                  shouldReplaceOnAdd,
                )}
              </li>
            </ul>
          </div>

          <aside className="card tool-shell__overview-card" data-has-items={hasItems}>
            <h3>{hasItems ? "현재 큐 요약" : "빠른 시작"}</h3>

            {hasItems ? (
              <>
                <div className="tool-shell__overview-head">
                  <div>
                    <strong>{fileCountLabel}</strong>
                    <p>
                      {lastSource
                        ? `${sourceLabels[lastSource]}로 최근 파일을 추가했습니다.`
                        : "대표 파일과 옵션을 바로 이어서 확인하세요."}
                    </p>
                  </div>
                  {selectedItemState ? (
                    <span
                      className="tool-shell__queue-status"
                      data-status={selectedItemState.status}
                    >
                      {getQueueStatusLabel(selectedItemState.status)}
                    </span>
                  ) : null}
                </div>
                <div
                  aria-atomic="true"
                  aria-live="polite"
                  className="tool-shell__status"
                  id={stepStatusId}
                  role="status"
                >
                  <strong>{stepLabels[activeStep]}</strong>
                  <p>{currentStepMessage}</p>
                </div>
                <dl className="tool-shell__stat-list tool-shell__stat-list--compact">
                  <div>
                    <dt>총 업로드 용량</dt>
                    <dd>{formatFileSize(totalSize)}</dd>
                  </div>
                  <div>
                    <dt>성공 / 실패</dt>
                    <dd>{hasResults ? `${successCount}개 / ${errorCount}개` : "실행 전"}</dd>
                  </div>
                  <div>
                    <dt>처리 엔진</dt>
                    <dd>{getEngineLabel(processingEngine)}</dd>
                  </div>
                </dl>
              </>
            ) : (
              <>
                <ol className="tool-shell__start-list">
                  {startChecklist.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
                <div
                  aria-atomic="true"
                  aria-live="polite"
                  className="tool-shell__status"
                  id={stepStatusId}
                  role="status"
                >
                  <strong>{stepLabels.upload}</strong>
                  <p>{uploadStepMessage}</p>
                </div>
              </>
            )}
          </aside>
        </div>

        {errors.length > 0 ? (
          <div
            aria-atomic="true"
            aria-live="assertive"
            className="tool-shell__message"
            id={uploadMessagesId}
            role="alert"
          >
            <div className="tool-shell__message-header">
              <strong>확인할 업로드 메시지</strong>
              <button className="button-muted" onClick={clearErrors} type="button">
                업로드 메시지 지우기
              </button>
            </div>
            <ul className="list-reset tool-shell__message-list">
              {errors.map((error) => (
                <li key={error.id}>{error.message}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {processingError ? (
          <div
            aria-atomic="true"
            aria-live="assertive"
            className="tool-shell__message"
            id={processingErrorId}
            role="alert"
          >
            <strong>처리를 진행할 수 없습니다</strong>
            <p>{processingError}</p>
          </div>
        ) : null}

        {processingNote ? (
          <div
            aria-live="polite"
            className="tool-shell__message"
            id={processingNoteId}
            role="status"
          >
            <strong>처리 엔진 안내</strong>
            <p>{processingNote}</p>
          </div>
        ) : null}

        {isCompressTool && selectedItem ? (
          <div className="detail-grid tool-shell__comparison-grid">
            <section
              className="card tool-shell__option-card"
              ref={optionPanelRef}
              tabIndex={-1}
            >
              <h3>압축 옵션</h3>

              <label className="tool-shell__field" htmlFor="compress-output-format">
                <span>출력 형식</span>
                <select
                  className="tool-shell__select"
                  disabled={isProcessing}
                  id="compress-output-format"
                  onChange={handleCompressOutputChange}
                  value={outputFormat}
                >
                  {compressionOutputOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.value === "original" && selectedMimeType
                        ? `${option.label} (${getCompressionMimeTypeLabel(
                            selectedMimeType,
                          )})`
                        : option.label}
                    </option>
                  ))}
                </select>
              </label>

              <p className="tool-shell__helper">
                {compressionOptionDescription}
              </p>

              <label className="tool-shell__field" htmlFor="compress-quality">
                <span>품질</span>
                <div className="tool-shell__range-row">
                  <input
                    disabled={!isQualityEnabled || isProcessing}
                    id="compress-quality"
                    max="100"
                    min="40"
                    onChange={handleQualityChange}
                    step="1"
                    type="range"
                    value={quality}
                  />
                  <strong>{isQualityEnabled ? `${quality}%` : "무손실"}</strong>
                </div>
              </label>

              <p className="tool-shell__helper">
                선택한 품질과 출력 형식이 모든 파일에 동일하게 적용됩니다. 결과는
                개별 저장하거나 ZIP으로 묶어 받을 수 있습니다.
              </p>
            </section>

            {renderWorkflowSidebar()}
          </div>
        ) : null}

        {isResizeTool && selectedItem ? (
          <div className="detail-grid tool-shell__comparison-grid">
            <section
              className="card tool-shell__option-card"
              ref={optionPanelRef}
              tabIndex={-1}
            >
              <h3>크기 조절 옵션</h3>

              <div className="tool-shell__dimension-grid">
                <label className="tool-shell__field" htmlFor="resize-width">
                  <span>가로 (px)</span>
                  <input
                    aria-describedby={
                      resizeValidationMessage ? resizeValidationId : undefined
                    }
                    aria-invalid={resizeValidationMessage ? true : undefined}
                    className="tool-shell__input"
                    disabled={isProcessing}
                    id="resize-width"
                    inputMode="numeric"
                    min="1"
                    onChange={handleResizeWidthChange}
                    type="number"
                    value={resizeWidthValue}
                  />
                </label>

                <label className="tool-shell__field" htmlFor="resize-height">
                  <span>세로 (px)</span>
                  <input
                    aria-describedby={
                      resizeValidationMessage ? resizeValidationId : undefined
                    }
                    aria-invalid={resizeValidationMessage ? true : undefined}
                    className="tool-shell__input"
                    disabled={isProcessing}
                    id="resize-height"
                    inputMode="numeric"
                    min="1"
                    onChange={handleResizeHeightChange}
                    type="number"
                    value={resizeHeightValue}
                  />
                </label>
              </div>

              <label className="tool-shell__toggle" htmlFor="resize-keep-aspect-ratio">
                <input
                  checked={keepAspectRatio}
                  disabled={isProcessing}
                  id="resize-keep-aspect-ratio"
                  onChange={handleKeepAspectRatioChange}
                  type="checkbox"
                />
                <span>
                  <strong>비율 유지</strong>
                  <small>
                    켜져 있으면 각 파일이 지정한 가로·세로 박스 안에 맞게 개별
                    비율을 유지합니다.
                  </small>
                </span>
              </label>

              <div className="tool-shell__field">
                <span>자주 쓰는 프리셋</span>
                <div className="tool-shell__preset-list">
                  {resizePresetOptions.map((preset) => {
                    const nextDimensions =
                      keepAspectRatio && referenceDimensions
                        ? fitWithinResizePreset(referenceDimensions, preset)
                        : preset;

                    return (
                      <button
                        className="tool-shell__preset"
                        disabled={isProcessing}
                        key={preset.label}
                        onClick={() => applyResizePreset(preset)}
                        type="button"
                      >
                        <strong>{preset.label}</strong>
                        <span>{formatDimensions(nextDimensions)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="tool-shell__helper">
                입력한 크기는 모든 파일에 공통으로 적용됩니다. 비율 유지를 켜면
                실제 저장 크기는 파일마다 조금씩 달라질 수 있습니다.
              </p>

              {resizeValidationMessage ? (
                <p
                  className="tool-shell__helper tool-shell__helper--error"
                  id={resizeValidationId}
                >
                  {resizeValidationMessage}
                </p>
              ) : null}
            </section>

            {renderWorkflowSidebar()}
          </div>
        ) : null}

        {isConvertTool && selectedItem ? (
          <div className="detail-grid tool-shell__comparison-grid">
            <section
              className="card tool-shell__option-card"
              ref={optionPanelRef}
              tabIndex={-1}
            >
              <h3>포맷 변환 옵션</h3>

              <label className="tool-shell__field" htmlFor="convert-output-format">
                <span>출력 형식</span>
                <select
                  className="tool-shell__select"
                  disabled={isProcessing}
                  id="convert-output-format"
                  onChange={handleConversionOutputChange}
                  value={conversionOutputFormat}
                >
                  {conversionOutputOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <p className="tool-shell__helper">
                {getConversionOutputDescription(conversionOutputFormat)}
              </p>

              <label className="tool-shell__field" htmlFor="convert-quality">
                <span>품질</span>
                <div className="tool-shell__range-row">
                  <input
                    disabled={!isConvertQualityEnabled || isProcessing}
                    id="convert-quality"
                    max="100"
                    min="40"
                    onChange={handleQualityChange}
                    step="1"
                    type="range"
                    value={quality}
                  />
                  <strong>
                    {isConvertQualityEnabled ? `${quality}%` : "무손실"}
                  </strong>
                </div>
              </label>

              <p className="tool-shell__helper">
                {conversionOutputFormat === "image/jpeg" && selectedMimeType !== "image/jpeg"
                  ? "JPEG는 투명 배경을 저장하지 못하므로 투명 영역이 있다면 흰색으로 채워집니다."
                  : isConvertQualityEnabled
                    ? "JPEG와 WebP는 품질 값을 낮출수록 파일이 더 작아질 수 있지만 세부 묘사가 줄어들 수 있습니다."
                    : "PNG는 무손실 저장으로 다시 생성됩니다."}
              </p>

              {skippedConvertCount > 0 ? (
                <p className="tool-shell__helper">
                  현재 큐에서 {skippedConvertCount}개 파일은 원본과 같은 출력 형식을
                  선택해 변환 시 실패로 표시될 예정입니다.
                </p>
              ) : null}
            </section>

            {renderWorkflowSidebar()}
          </div>
        ) : null}

        {isRemoveExifTool && selectedItem ? (
          <div className="detail-grid tool-shell__comparison-grid">
            <section
              className="card tool-shell__option-card"
              ref={optionPanelRef}
              tabIndex={-1}
            >
              <h3>메타데이터 제거 안내</h3>
              <p>
                업로드한 이미지를 원본 형식으로 다시 저장해 공유 전에 위치, 기기,
                촬영 시각 같은 EXIF 정보를 정리하는 방식입니다.
              </p>
              <ul className="chip-list">
                <li>GPS 위치 정보 정리 가능</li>
                <li>기기 모델 및 촬영 설정 정리 가능</li>
                <li>필요한 결과만 골라 저장 가능</li>
              </ul>
              <p className="tool-shell__helper">
                처리 방식은 재인코딩 기반이므로 일부 앱 전용 메타데이터도 함께
                사라질 수 있습니다.
              </p>
            </section>

            {renderWorkflowSidebar()}
          </div>
        ) : null}

        {hasItems ? (
          <div className="detail-grid tool-shell__preview-grid">
            {items.map((item) => {
              const itemState = queueState[item.id] ?? { status: "queued" };
              const itemMimeType =
                getSupportedImageMimeType(item.file) ?? "image/jpeg";

              return (
                <article
                  className="card tool-shell__preview-card"
                  data-primary={item.id === selectedItemId}
                  key={item.id}
                >
                  <div className="tool-shell__preview-media">
                    <Image
                      alt={`${item.file.name} 미리보기`}
                      fill
                      sizes="(min-width: 900px) 30vw, (min-width: 640px) 45vw, 100vw"
                      src={item.previewUrl}
                      unoptimized
                    />
                  </div>
                  <div className="tool-shell__preview-meta">
                    <div className="tool-shell__preview-heading">
                      <h3>{item.file.name}</h3>
                      <span
                        className="tool-shell__queue-status"
                        data-status={itemState.status}
                      >
                        {getQueueStatusLabel(itemState.status)}
                      </span>
                    </div>
                    <p>{`${item.typeLabel} · ${formatFileSize(item.file.size)}`}</p>
                    {item.id === selectedItemId ? (
                      <p className="tool-shell__preview-badge">현재 기준 파일</p>
                    ) : null}
                  </div>

                  {itemState.status === "processing" ? (
                    <p className="tool-shell__helper">
                      현재 파일을 처리하고 있습니다. 이 단계가 끝나면 성공 또는 실패
                      상태가 바로 업데이트됩니다.
                    </p>
                  ) : null}

                  {itemState.status === "error" ? (
                    <p className="tool-shell__helper tool-shell__helper--error">
                      {itemState.errorMessage}
                    </p>
                  ) : null}

                  {itemState.status === "success" && itemState.result ? (
                    <dl className="tool-shell__stat-list tool-shell__stat-list--compact tool-shell__queue-result">
                      <div>
                        <dt>저장 이름</dt>
                        <dd>{itemState.result.fileName}</dd>
                      </div>
                      <div>
                        <dt>출력 형식</dt>
                        <dd>{getCompressionMimeTypeLabel(itemState.result.mimeType)}</dd>
                      </div>
                      <div>
                        <dt>결과 크기</dt>
                        <dd>{formatFileSize(itemState.result.blob.size)}</dd>
                      </div>
                      <div>
                        <dt>해상도</dt>
                        <dd>{formatDimensions(itemState.result)}</dd>
                      </div>
                      {toolVariant === "resize" ? (
                        <div>
                          <dt>크기 비율</dt>
                          <dd>
                            {formatResizeScaleSummary(
                              {
                                width: itemState.result.originalWidth,
                                height: itemState.result.originalHeight,
                              },
                              itemState.result,
                            )}
                          </dd>
                        </div>
                      ) : (
                        <div>
                          <dt>용량 변화</dt>
                          <dd>
                            {formatCompressionSummary(
                              item.file.size,
                              itemState.result.blob.size,
                            )}
                          </dd>
                        </div>
                      )}
                      {toolVariant === "removeExif" ? (
                        <div>
                          <dt>메타데이터</dt>
                          <dd>EXIF 제거용 재저장</dd>
                        </div>
                      ) : null}
                      {toolVariant === "convert" ? (
                        <div>
                          <dt>원본 형식</dt>
                          <dd>{getCompressionMimeTypeLabel(itemMimeType)}</dd>
                        </div>
                      ) : null}
                    </dl>
                  ) : null}

                  <div className="tool-shell__preview-actions">
                    <button
                      className="button-muted"
                      disabled={isProcessing}
                      onClick={() => removeItem(item.id)}
                      type="button"
                    >
                      목록에서 제거
                    </button>
                    {itemState.status === "success" ? (
                      <button
                        className="button-link"
                        onClick={() => handleDownloadResult(item.id)}
                        type="button"
                      >
                        결과 다운로드
                      </button>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
