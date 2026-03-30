"use client";

import {
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
  compressionWorkflowPresetOptions,
  getCompressionMimeTypeLabel,
  isQualityAdjustableFormat,
  resolveCompressionMimeType,
  type CompressionOutputFormat,
} from "@/lib/compress-image";
import {
  conversionWorkflowPresetOptions,
  resolveConversionWorkflowMimeType,
} from "@/lib/convert-image";
import { createImageProcessingWorkerClient } from "@/lib/image-processing-client";
import {
  createProcessingSignature,
  type ImageProcessOptions,
} from "@/lib/image-processing";
import {
  formatFileSize,
  getSupportedImageMimeType,
  shouldReplaceUploadQueue,
  supportedImageTypesText,
  type SupportedImageMimeType,
} from "@/lib/image-upload";
import {
  calculateHeightFromWidth,
  calculateWidthFromHeight,
  fitWithinResizePreset,
  resizeWorkflowPresetOptions,
  validateResizeDimensions,
  type ResizeDimensions,
} from "@/lib/resize-image";

import { ToolShellOptionPanels } from "@/components/tool-shell/tool-shell-option-panels";
import { ToolShellPreviewGrid } from "@/components/tool-shell/tool-shell-preview-grid";
import { ToolShellStatusMessages } from "@/components/tool-shell/tool-shell-status-messages";
import { ToolShellUploadWorkspace } from "@/components/tool-shell/tool-shell-upload-workspace";
import {
  getResizeDimensionValue,
  getToolVariant,
  getVariantLabel,
  type ProcessingEngine,
  type QueueItemState,
  type ToolShellProps,
  type WorkflowPresetId,
} from "@/components/tool-shell/shared";
import {
  focusWorkspaceRegion,
  useToolShellEffects,
} from "@/components/tool-shell/use-tool-shell-effects";
import { useToolShellProcessing } from "@/components/tool-shell/use-tool-shell-processing";
import {
  buildQueueSummaryRows,
  buildSelectedResultRows,
  buildSelectedSummaryRows,
  buildToolStatusCopy,
  getWorkflowStatus,
} from "@/components/tool-shell/view-model";

export function ToolShell({
  title,
  description,
  primaryActionLabel,
  sectionId,
  variant = "default",
}: ToolShellProps) {
  const shellId = useId();
  const [activeStep, setActiveStep] = useState<"upload" | "options" | "export">(
    "upload",
  );
  const [isDragging, setIsDragging] = useState(false);
  const [outputFormat, setOutputFormat] =
    useState<CompressionOutputFormat>("original");
  const [conversionOutputFormat, setConversionOutputFormat] =
    useState<SupportedImageMimeType>("image/webp");
  const [quality, setQuality] = useState(82);
  const [resizeWidthValue, setResizeWidthValue] = useState("");
  const [resizeHeightValue, setResizeHeightValue] = useState("");
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [selectedWorkflowPresetId, setSelectedWorkflowPresetId] =
    useState<WorkflowPresetId | null>(null);
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
  const selectedCompressionWorkflowPreset = isCompressTool
    ? (compressionWorkflowPresetOptions.find(
        (preset) => preset.id === selectedWorkflowPresetId,
      ) ?? null)
    : null;
  const selectedResizeWorkflowPreset = isResizeTool
    ? (resizeWorkflowPresetOptions.find(
        (preset) => preset.id === selectedWorkflowPresetId,
      ) ?? null)
    : null;
  const selectedConversionWorkflowPreset = isConvertTool
    ? (conversionWorkflowPresetOptions.find(
        (preset) => preset.id === selectedWorkflowPresetId,
      ) ?? null)
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
    isResizeTool && resizeValidation?.ok
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
  } else if (isResizeTool && resizeValidation?.ok) {
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
  const hasQueuedItems = items.some(
    (item) => (queueState[item.id]?.status ?? "queued") === "queued",
  );
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
  const selectedResult =
    selectedItemState?.status === "success" ? selectedItemState.result ?? null : null;
  const shouldPrioritizeZipDownload = successCount > 1;
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
      ? "새 파일을 선택, 드롭, 붙여넣기하면 현재 단일 작업을 자동으로 교체합니다. 여러 파일을 한 번에 고르면 이전 단일 세션 대신 새 배치로 시작합니다."
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

  const queueSummaryRows = buildQueueSummaryRows({
    itemsLength: items.length,
    hasItems,
    totalSize,
    hasResults,
    successCount,
    errorCount,
  });
  const { tone: workflowStatusTone, label: workflowStatusLabel } =
    getWorkflowStatus({
      isProcessing,
      hasResults,
      successCount,
    });
  const selectedSummaryRows = buildSelectedSummaryRows({
    conversionOutputFormat,
    currentOptions,
    isCompressTool,
    isConvertTool,
    isRemoveExifTool,
    isResizeTool,
    itemsLength: items.length,
    referenceDimensions,
    selectedItem,
    selectedMimeType,
  });
  const selectedResultRows = buildSelectedResultRows({
    selectedItem,
    selectedMimeType,
    selectedResult,
    toolVariant: variant,
  });
  const { uploadStepMessage, currentStepMessage } = buildToolStatusCopy({
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
    itemsLength: items.length,
    keepAspectRatio,
    quality,
    repeatActionMessage,
    resizeTargetDimensions,
    resizeValidationMessage,
    successCount,
    targetMimeType,
  });
  const compressionOptionDescription = isLosslessPngCompression
    ? "PNG는 무손실 재저장이라 스크린샷, 차트, UI 이미지처럼 이미 최적화된 파일은 용량이 오히려 커질 수 있습니다. 더 작게 만들려면 WebP 또는 JPEG를 선택해 주세요."
    : (compressionOutputOptions.find((option) => option.value === outputFormat)
        ?.description ?? "출력 형식을 선택해 압축 결과를 저장합니다.");
  const selectedCompressionGrowthMessage =
    isCompressTool &&
    selectedItem &&
    selectedResult &&
    selectedResult.blob.size > selectedItem.file.size
      ? `현재 설정에서는 원본보다 ${formatFileSize(
          selectedResult.blob.size - selectedItem.file.size,
        )} 커졌습니다. PNG 무손실 재저장일 수 있으니 더 작게 만들려면 WebP 또는 JPEG를 선택해 주세요.`
      : null;
  const workflowPresetNotice =
    "프리셋은 업로드 전 정리용 추천 시작점이며, 적용 뒤에도 아래 값을 직접 바꿀 수 있습니다. 최종 지원 형식과 크기는 업로드할 서비스에서 한 번 더 확인해 주세요.";
  const compressionFormatSideEffectMessage =
    targetMimeType === "image/jpeg" && selectedMimeType !== "image/jpeg"
      ? "JPEG로 다시 저장하면 투명 영역은 흰색으로 채워질 수 있습니다."
      : isQualityEnabled
        ? "품질 값을 낮출수록 파일이 더 작아질 수 있지만 세부 묘사가 줄어들 수 있습니다."
        : "PNG는 무손실 재저장이라 형식 변경이 용량에 더 큰 영향을 줄 수 있습니다.";
  const conversionWorkflowPresetNote = selectedConversionWorkflowPreset
    ? `${selectedConversionWorkflowPreset.label} 프리셋은 현재 기준 파일 형식과 겹치면 ${getCompressionMimeTypeLabel(
        resolveConversionWorkflowMimeType(
          selectedMimeType,
          selectedConversionWorkflowPreset,
        ),
      )}로 자동 전환해 바로 비교를 시작합니다.`
    : "프리셋은 현재 기준 파일과 같은 형식이면 다른 대표 형식으로 자동 전환해 바로 비교를 시작합니다.";

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

  useToolShellEffects({
    handleIncomingFiles,
    hasItems,
    hasQueuedItems,
    hasResults,
    isConvertTool,
    isProcessing,
    isResizeTool,
    itemIdsSignature,
    items,
    optionPanelRef,
    previousHasResultsRef,
    previousItemCountRef,
    processingSignature,
    runIdRef,
    selectedItemId,
    selectedMimeType,
    selectedPreviewUrl,
    setActiveStep,
    setConversionOutputFormat,
    setKeepAspectRatio,
    setLastEditedDimension,
    setProcessingEngine,
    setProcessingError,
    setProcessingNote,
    setQueueState,
    setReadyForReplacement,
    setReferenceDimensions,
    setResizeHeightValue,
    setResizeWidthValue,
    setSelectedWorkflowPresetId,
    variant,
    workerClientRef,
    workflowSummaryRef,
  });

  const { handleDownloadResult, handleDownloadZip, handleProcessAll } =
    useToolShellProcessing({
      currentOptions,
      dropzoneRef,
      hasValidResizeOptions: Boolean(resizeValidation?.ok),
      isResizeTool,
      items,
      processingEngine,
      queueState,
      resizeValidationMessage,
      runIdRef,
      selectedItemId,
      setActiveStep,
      setIsPreparingZip,
      setIsProcessing,
      setProcessingEngine,
      setProcessingError,
      setProcessingNote,
      setQueueState,
      setReadyForReplacement,
      successCount,
      toolVariant,
      workerClientRef,
    });

  function resetOptionEditingState() {
    setSelectedWorkflowPresetId(null);
    setProcessingError(null);
    setProcessingNote(null);

    if (items.length > 0) {
      setActiveStep("options");
    }
  }

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
    resetOptionEditingState();
  }

  function handleCompressOutputChange(event: ChangeEvent<HTMLSelectElement>) {
    setOutputFormat(event.currentTarget.value as CompressionOutputFormat);
    resetOptionEditingState();
  }

  function handleConversionOutputChange(event: ChangeEvent<HTMLSelectElement>) {
    setConversionOutputFormat(event.currentTarget.value as SupportedImageMimeType);
    resetOptionEditingState();
  }

  function handleResizeWidthChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.currentTarget.value;

    setResizeWidthValue(nextValue);
    setSelectedWorkflowPresetId(null);
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
    setSelectedWorkflowPresetId(null);
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
    setSelectedWorkflowPresetId(null);
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
    resetOptionEditingState();

    const nextDimensions =
      keepAspectRatio && referenceDimensions
        ? fitWithinResizePreset(referenceDimensions, preset)
        : preset;

    setResizeWidthValue(String(nextDimensions.width));
    setResizeHeightValue(String(nextDimensions.height));
    setLastEditedDimension("width");
  }

  function applyCompressionWorkflowPreset(
    preset: (typeof compressionWorkflowPresetOptions)[number],
  ) {
    setOutputFormat(preset.outputFormat);
    setQuality(preset.quality);
    setSelectedWorkflowPresetId(preset.id);
    setProcessingError(null);
    setProcessingNote(null);

    if (items.length > 0) {
      setActiveStep("options");
    }
  }

  function applyResizeWorkflowPreset(
    preset: (typeof resizeWorkflowPresetOptions)[number],
  ) {
    const nextDimensions =
      referenceDimensions !== null
        ? fitWithinResizePreset(referenceDimensions, preset)
        : {
            width: preset.width,
            height: preset.height,
          };

    setKeepAspectRatio(true);
    setResizeWidthValue(String(nextDimensions.width));
    setResizeHeightValue(String(nextDimensions.height));
    setSelectedWorkflowPresetId(preset.id);
    setLastEditedDimension("width");
    setProcessingError(null);
    setProcessingNote(null);

    if (items.length > 0) {
      setActiveStep("options");
    }
  }

  function applyConversionWorkflowPreset(
    preset: (typeof conversionWorkflowPresetOptions)[number],
  ) {
    setConversionOutputFormat(
      resolveConversionWorkflowMimeType(selectedMimeType, preset),
    );
    setQuality(preset.quality);
    setSelectedWorkflowPresetId(preset.id);
    setProcessingError(null);
    setProcessingNote(null);

    if (items.length > 0) {
      setActiveStep("options");
    }
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
        <ToolShellUploadWorkspace
          activeStep={activeStep}
          clearItems={clearItems}
          currentStepMessage={currentStepMessage}
          dropzoneDescriptionIds={dropzoneDescriptionIds}
          dropzoneHint={dropzoneHint}
          dropzoneHintId={dropzoneHintId}
          dropzoneRef={dropzoneRef}
          dropzoneTitle={dropzoneTitle}
          dropzoneTitleId={dropzoneTitleId}
          errorCount={errorCount}
          fileCountLabel={fileCountLabel}
          handleDragEnter={handleDragEnter}
          handleDragLeave={handleDragLeave}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleDropzoneKeyDown={handleDropzoneKeyDown}
          handleInputChange={handleInputChange}
          hasItems={hasItems}
          hasResults={hasResults}
          inputRef={inputRef}
          isDragging={isDragging}
          isProcessing={isProcessing}
          keepAspectRatio={keepAspectRatio}
          lastSource={lastSource}
          openFilePicker={openFilePicker}
          processingEngine={processingEngine}
          selectedItemState={selectedItemState}
          shouldReplaceOnAdd={shouldReplaceOnAdd}
          showClearQueueAction={showClearQueueAction}
          skippedConvertCount={skippedConvertCount}
          startChecklist={startChecklist}
          stepStatusId={stepStatusId}
          successCount={successCount}
          totalSize={totalSize}
          uploadStepMessage={uploadStepMessage}
          variant={variant}
        />

        <ToolShellStatusMessages
          clearErrors={clearErrors}
          errors={errors}
          processingError={processingError}
          processingErrorId={processingErrorId}
          processingNote={processingNote}
          processingNoteId={processingNoteId}
          uploadMessagesId={uploadMessagesId}
        />

        <ToolShellOptionPanels
          applyCompressionWorkflowPreset={applyCompressionWorkflowPreset}
          applyConversionWorkflowPreset={applyConversionWorkflowPreset}
          applyResizePreset={applyResizePreset}
          applyResizeWorkflowPreset={applyResizeWorkflowPreset}
          canDownloadZip={canDownloadZip}
          canProcess={canProcess}
          completedCount={completedCount}
          compressionFormatSideEffectMessage={compressionFormatSideEffectMessage}
          compressionOptionDescription={compressionOptionDescription}
          conversionOutputFormat={conversionOutputFormat}
          conversionWorkflowPresetNote={conversionWorkflowPresetNote}
          currentStepMessage={currentStepMessage}
          errorCount={errorCount}
          handleCompressOutputChange={handleCompressOutputChange}
          handleConversionOutputChange={handleConversionOutputChange}
          handleDownloadResult={handleDownloadResult}
          handleDownloadZip={handleDownloadZip}
          handleKeepAspectRatioChange={handleKeepAspectRatioChange}
          handleProcessAll={handleProcessAll}
          handleQualityChange={handleQualityChange}
          handleResizeHeightChange={handleResizeHeightChange}
          handleResizeWidthChange={handleResizeWidthChange}
          hasResults={hasResults}
          isCompressTool={isCompressTool}
          isConvertQualityEnabled={isConvertQualityEnabled}
          isConvertTool={isConvertTool}
          isPreparingZip={isPreparingZip}
          isProcessing={isProcessing}
          isQualityEnabled={isQualityEnabled}
          isRemoveExifTool={isRemoveExifTool}
          isResizeTool={isResizeTool}
          itemsLength={items.length}
          keepAspectRatio={keepAspectRatio}
          optionPanelRef={optionPanelRef}
          outputFormat={outputFormat}
          primaryActionLabel={primaryActionLabel}
          processingCount={processingCount}
          progressHintId={progressHintId}
          progressLabelId={progressLabelId}
          progressPercent={progressPercent}
          progressValueText={progressValueText}
          quality={quality}
          queueSummaryRows={queueSummaryRows}
          referenceDimensions={referenceDimensions}
          repeatActionMessage={repeatActionMessage}
          resizeHeightValue={resizeHeightValue}
          resizeValidationId={resizeValidationId}
          resizeValidationMessage={resizeValidationMessage}
          resizeWidthValue={resizeWidthValue}
          selectedCompressionGrowthMessage={selectedCompressionGrowthMessage}
          selectedCompressionWorkflowPreset={selectedCompressionWorkflowPreset}
          selectedConversionWorkflowPreset={selectedConversionWorkflowPreset}
          selectedItem={selectedItem}
          selectedItemState={selectedItemState}
          selectedMimeType={selectedMimeType}
          selectedResizeWorkflowPreset={selectedResizeWorkflowPreset}
          selectedResult={selectedResult}
          selectedResultRows={selectedResultRows}
          selectedSummaryRows={selectedSummaryRows}
          shouldPrioritizeZipDownload={shouldPrioritizeZipDownload}
          showProgress={showProgress}
          skippedConvertCount={skippedConvertCount}
          successCount={successCount}
          toolVariant={toolVariant}
          workflowPresetNotice={workflowPresetNotice}
          workflowStatusLabel={workflowStatusLabel}
          workflowStatusTone={workflowStatusTone}
          workflowSummaryRef={workflowSummaryRef}
        />

        <ToolShellPreviewGrid
          handleDownloadResult={handleDownloadResult}
          isProcessing={isProcessing}
          items={items}
          queueState={queueState}
          removeItem={removeItem}
          selectedItemId={selectedItemId}
          toolVariant={toolVariant}
        />
      </div>
    </section>
  );
}
