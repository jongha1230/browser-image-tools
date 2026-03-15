"use client";

import Image from "next/image";
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";

import { useImageUploads } from "@/components/image-upload-provider";
import {
  compressionOutputOptions,
  createCompressedFileName,
  getCompressionDeltaPercent,
  getCompressionMimeTypeLabel,
  isQualityAdjustableFormat,
  resolveCompressionMimeType,
  type CompressionOutputFormat,
} from "@/lib/compress-image";
import {
  conversionOutputOptions,
  createConvertedFileName,
  getConversionOutputDescription,
  getDefaultConversionMimeType,
} from "@/lib/convert-image";
import {
  formatFileSize,
  getSupportedImageMimeType,
  supportedImageAccept,
  supportedImageTypesText,
  type SupportedImageMimeType,
} from "@/lib/image-upload";
import {
  calculateHeightFromWidth,
  calculateWidthFromHeight,
  createResizedFileName,
  fitWithinResizePreset,
  resizePresetOptions,
  validateResizeDimensions,
  type ResizeDimensions,
} from "@/lib/resize-image";

type StepKey = "upload" | "options" | "export";
type ToolShellVariant = "default" | "compress" | "resize" | "convert";

type CompressionResult = {
  blob: Blob;
  fileName: string;
  mimeType: SupportedImageMimeType;
  outputFormat: CompressionOutputFormat;
  previewUrl: string;
  quality: number;
  sourceId: string;
  width: number;
  height: number;
};

type ResizeResult = {
  blob: Blob;
  fileName: string;
  mimeType: SupportedImageMimeType;
  previewUrl: string;
  sourceId: string;
  width: number;
  height: number;
};

type ConvertResult = {
  blob: Blob;
  fileName: string;
  mimeType: SupportedImageMimeType;
  previewUrl: string;
  quality: number;
  sourceId: string;
  width: number;
  height: number;
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

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: SupportedImageMimeType,
  quality?: number,
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(
            new Error(
              "브라우저가 결과 파일을 만들지 못했습니다. 다른 형식이나 더 작은 크기로 다시 시도해 주세요.",
            ),
          );
          return;
        }

        resolve(blob);
      },
      mimeType,
      quality,
    );
  });
}

function downloadBlobUrl(blobUrl: string, fileName: string) {
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = fileName;
  link.rel = "noopener";
  link.click();
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

export function ToolShell({
  title,
  description,
  primaryActionLabel,
  variant = "default",
}: ToolShellProps) {
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
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [sourceDimensions, setSourceDimensions] =
    useState<ResizeDimensions | null>(null);
  const [compressionResult, setCompressionResult] =
    useState<CompressionResult | null>(null);
  const [resizeResult, setResizeResult] = useState<ResizeResult | null>(null);
  const [convertResult, setConvertResult] = useState<ConvertResult | null>(null);
  const dragDepthRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    addFiles,
    clearErrors,
    clearItems,
    errors,
    items,
    lastSource,
    removeItem,
  } = useImageUploads();
  const isCompressTool = variant === "compress";
  const isResizeTool = variant === "resize";
  const isConvertTool = variant === "convert";
  const isSingleFileTool = isCompressTool || isResizeTool || isConvertTool;
  const selectedItem = items[0] ?? null;
  const selectedItemId = selectedItem?.id ?? null;
  const selectedMimeType = selectedItem
    ? getSupportedImageMimeType(selectedItem.file)
    : null;
  const selectedPreviewUrl = selectedItem?.previewUrl ?? null;
  const targetMimeType = selectedItem
    ? resolveCompressionMimeType(selectedItem.file, outputFormat)
    : null;
  const conversionTargetMimeType = selectedItem ? conversionOutputFormat : null;
  const totalSize = items.reduce((sum, item) => sum + item.file.size, 0);
  const fileCountLabel =
    items.length > 0 ? `${items.length}개 파일 준비됨` : "아직 업로드된 파일이 없음";
  const hasTooManyFiles = isSingleFileTool && items.length > 1;
  const isQualityEnabled = targetMimeType
    ? isQualityAdjustableFormat(targetMimeType)
    : true;
  const isCompressionResultStale = compressionResult
    ? compressionResult.sourceId !== selectedItem?.id ||
      compressionResult.outputFormat !== outputFormat ||
      compressionResult.quality !== quality
    : false;
  const isConvertQualityEnabled = conversionTargetMimeType
    ? isQualityAdjustableFormat(conversionTargetMimeType)
    : true;
  const isConvertResultStale = convertResult
    ? convertResult.sourceId !== selectedItem?.id ||
      convertResult.mimeType !== conversionTargetMimeType ||
      (isConvertQualityEnabled && convertResult.quality !== quality)
    : false;
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
  const isResizeResultStale = resizeResult
    ? resizeResult.sourceId !== selectedItem?.id ||
      resizeResult.width !== resizeTargetDimensions?.width ||
      resizeResult.height !== resizeTargetDimensions?.height
    : false;
  const processingErrorTitle = isCompressTool
    ? "압축을 진행할 수 없습니다"
    : isResizeTool
      ? "크기 조절을 진행할 수 없습니다"
      : isConvertTool
        ? "포맷 변환을 진행할 수 없습니다"
      : "처리를 진행할 수 없습니다";
  const singleFileLimitMessage = isCompressTool
    ? "이미지 압축은 현재 한 번에 1개 파일만 지원합니다. 아래 카드에서 나머지 파일을 제거하면 바로 계속할 수 있습니다."
    : isResizeTool
      ? "이미지 크기 조절은 현재 한 번에 1개 파일만 지원합니다. 아래 카드에서 나머지 파일을 제거하면 바로 계속할 수 있습니다."
      : "이미지 포맷 변환은 현재 한 번에 1개 파일만 지원합니다. 아래 카드에서 나머지 파일을 제거하면 바로 계속할 수 있습니다.";

  let statusByStep: Record<StepKey, string>;

  if (isCompressTool) {
    statusByStep = {
      upload: hasTooManyFiles
        ? "이미지 압축은 현재 한 번에 1개 파일만 지원합니다. 미리보기 카드에서 하나만 남기면 압축을 계속할 수 있습니다."
        : selectedItem
          ? `${selectedItem.file.name} 파일이 준비되었습니다. 이 파일은 브라우저 탭 안에서만 유지되며 서버로 전송되지 않습니다.`
          : `JPEG, PNG, WebP 이미지 1개를 추가하면 이 페이지에서 바로 용량 비교와 다운로드까지 진행할 수 있습니다.`,
      options:
        selectedItem && targetMimeType
          ? `${getCompressionMimeTypeLabel(targetMimeType)} 형식으로 저장되며, 품질은 ${
              isQualityEnabled ? `${quality}%` : "무손실 재저장"
            } 기준으로 적용됩니다.`
          : "먼저 압축할 이미지를 1개만 준비하면 품질과 출력 형식을 선택할 수 있습니다.",
      export:
        compressionResult && !isCompressionResultStale
          ? `${compressionResult.fileName} 파일이 준비되었습니다. 원본과 결과 크기를 확인한 뒤 바로 다운로드할 수 있습니다.`
          : "압축을 실행하면 결과 파일 크기, 출력 형식, 저장용 파일명을 이 단계에서 확인할 수 있습니다.",
    };
  } else if (isConvertTool) {
    statusByStep = {
      upload: hasTooManyFiles
        ? "이미지 포맷 변환은 현재 한 번에 1개 파일만 지원합니다. 미리보기 카드에서 하나만 남기면 변환을 계속할 수 있습니다."
        : selectedItem
          ? `${selectedItem.file.name} 파일이 준비되었습니다. 이 파일은 브라우저 탭 안에서만 유지되며 서버로 전송되지 않습니다.`
          : `JPEG, PNG, WebP 이미지 1개를 추가하면 이 페이지에서 바로 포맷 변환과 다운로드까지 진행할 수 있습니다.`,
      options:
        selectedItem && selectedMimeType && conversionTargetMimeType
          ? `${getCompressionMimeTypeLabel(selectedMimeType)} 이미지를 ${getCompressionMimeTypeLabel(
              conversionTargetMimeType,
            )} 형식으로 저장합니다. ${
              isConvertQualityEnabled
                ? `품질은 ${quality}% 기준으로 적용됩니다.`
                : "PNG는 무손실로 다시 저장됩니다."
            }`
          : "먼저 변환할 이미지를 1개만 준비하면 출력 형식과 품질을 선택할 수 있습니다.",
      export:
        convertResult && !isConvertResultStale
          ? `${convertResult.fileName} 파일이 준비되었습니다. 원본과 결과 형식, 파일 크기를 확인한 뒤 바로 다운로드할 수 있습니다.`
          : "변환을 실행하면 결과 형식, 저장 파일명, 전후 파일 크기를 이 단계에서 확인할 수 있습니다.",
    };
  } else if (isResizeTool) {
    statusByStep = {
      upload: hasTooManyFiles
        ? "이미지 크기 조절은 현재 한 번에 1개 파일만 지원합니다. 미리보기 카드에서 하나만 남기면 작업을 계속할 수 있습니다."
        : selectedItem
          ? `${selectedItem.file.name} 파일이 준비되었습니다. 이 파일은 브라우저 탭 안에서만 유지되며 서버로 전송되지 않습니다.`
          : `JPEG, PNG, WebP 이미지 1개를 추가하면 이 페이지에서 바로 해상도 조정과 다운로드까지 진행할 수 있습니다.`,
      options:
        selectedItem && sourceDimensions
          ? resizeTargetDimensions
            ? `원본 ${formatDimensions(sourceDimensions)} 기준으로 ${formatDimensions(resizeTargetDimensions)} 크기로 저장합니다. 비율 잠금은 ${keepAspectRatio ? "켜짐" : "꺼짐"} 상태입니다.`
            : `원본 ${formatDimensions(sourceDimensions)} 기준으로 가로와 세로 값을 확인해 주세요.`
          : "먼저 크기를 조절할 이미지를 1개만 준비하면 가로, 세로, 비율 잠금 옵션을 선택할 수 있습니다.",
      export:
        resizeResult && !isResizeResultStale
          ? `${resizeResult.fileName} 파일이 준비되었습니다. 원본과 결과 해상도, 파일 크기를 확인한 뒤 바로 다운로드할 수 있습니다.`
          : "크기 조절을 실행하면 결과 해상도, 저장 파일명, 결과 파일 크기를 이 단계에서 확인할 수 있습니다.",
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

  const handleWindowPaste = useEffectEvent((event: ClipboardEvent) => {
    const target = event.target;

    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      (target instanceof HTMLElement && target.isContentEditable)
    ) {
      return;
    }

    addFiles(getClipboardFiles(event.clipboardData), "paste");
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
    if (!isSingleFileTool) {
      return;
    }

    if (!selectedPreviewUrl) {
      setSourceDimensions(null);
      setCompressionResult(null);
      setResizeResult(null);
      setConvertResult(null);
      setConversionOutputFormat("image/webp");
      setProcessingError(null);
      setResizeWidthValue("");
      setResizeHeightValue("");
      setKeepAspectRatio(true);
      setLastEditedDimension("width");
      setActiveStep("upload");
      return;
    }

    setProcessingError(null);
    setSourceDimensions(null);

    if (isCompressTool) {
      setCompressionResult(null);
    }

    if (isResizeTool) {
      setResizeResult(null);
      setResizeWidthValue("");
      setResizeHeightValue("");
    }

    if (isConvertTool) {
      setConvertResult(null);

      if (selectedMimeType) {
        setConversionOutputFormat(getDefaultConversionMimeType(selectedMimeType));
      }
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

        setSourceDimensions(nextDimensions);

        if (isResizeTool) {
          setResizeWidthValue(String(nextDimensions.width));
          setResizeHeightValue(String(nextDimensions.height));
          setKeepAspectRatio(true);
          setLastEditedDimension("width");
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
  }, [
    isCompressTool,
    isConvertTool,
    isResizeTool,
    isSingleFileTool,
    selectedItemId,
    selectedMimeType,
    selectedPreviewUrl,
  ]);

  useEffect(() => {
    if (!isSingleFileTool) {
      return;
    }

    if (!selectedItem) {
      return;
    }

    if (isCompressTool) {
      setActiveStep(
        compressionResult && !isCompressionResultStale ? "export" : "options",
      );
      return;
    }

    if (isResizeTool) {
      setActiveStep(resizeResult && !isResizeResultStale ? "export" : "options");
      return;
    }

    if (isConvertTool) {
      setActiveStep(convertResult && !isConvertResultStale ? "export" : "options");
    }
  }, [
    compressionResult,
    convertResult,
    isCompressTool,
    isCompressionResultStale,
    isConvertResultStale,
    isConvertTool,
    isResizeResultStale,
    isResizeTool,
    isSingleFileTool,
    resizeResult,
    selectedItem,
  ]);

  useEffect(() => {
    return () => {
      if (compressionResult) {
        URL.revokeObjectURL(compressionResult.previewUrl);
      }
    };
  }, [compressionResult]);

  useEffect(() => {
    return () => {
      if (resizeResult) {
        URL.revokeObjectURL(resizeResult.previewUrl);
      }
    };
  }, [resizeResult]);

  useEffect(() => {
    return () => {
      if (convertResult) {
        URL.revokeObjectURL(convertResult.previewUrl);
      }
    };
  }, [convertResult]);

  function openFilePicker() {
    inputRef.current?.click();
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    addFiles(event.currentTarget.files, "input");
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
    addFiles(event.dataTransfer.files, "drop");
  }

  function handleQualityChange(event: ChangeEvent<HTMLInputElement>) {
    setQuality(Number(event.currentTarget.value));
    setProcessingError(null);

    if (selectedItem) {
      setActiveStep("options");
    }
  }

  function handleConversionOutputChange(event: ChangeEvent<HTMLSelectElement>) {
    setConversionOutputFormat(event.currentTarget.value as SupportedImageMimeType);
    setProcessingError(null);

    if (selectedItem) {
      setActiveStep("options");
    }
  }

  function handleResizeWidthChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.currentTarget.value;

    setResizeWidthValue(nextValue);
    setLastEditedDimension("width");
    setProcessingError(null);

    if (selectedItem) {
      setActiveStep("options");
    }

    if (!keepAspectRatio || !sourceDimensions) {
      return;
    }

    const nextWidth = getResizeDimensionValue(nextValue);

    if (nextWidth === null || nextWidth < 1) {
      return;
    }

    setResizeHeightValue(
      String(calculateHeightFromWidth(nextWidth, sourceDimensions)),
    );
  }

  function handleResizeHeightChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.currentTarget.value;

    setResizeHeightValue(nextValue);
    setLastEditedDimension("height");
    setProcessingError(null);

    if (selectedItem) {
      setActiveStep("options");
    }

    if (!keepAspectRatio || !sourceDimensions) {
      return;
    }

    const nextHeight = getResizeDimensionValue(nextValue);

    if (nextHeight === null || nextHeight < 1) {
      return;
    }

    setResizeWidthValue(
      String(calculateWidthFromHeight(nextHeight, sourceDimensions)),
    );
  }

  function handleKeepAspectRatioChange(event: ChangeEvent<HTMLInputElement>) {
    const nextChecked = event.currentTarget.checked;

    setKeepAspectRatio(nextChecked);
    setProcessingError(null);

    if (selectedItem) {
      setActiveStep("options");
    }

    if (!nextChecked || !sourceDimensions) {
      return;
    }

    if (lastEditedDimension === "height") {
      const nextHeight = getResizeDimensionValue(resizeHeightValue);

      if (nextHeight === null || nextHeight < 1) {
        return;
      }

      setResizeWidthValue(
        String(calculateWidthFromHeight(nextHeight, sourceDimensions)),
      );
      return;
    }

    const nextWidth = getResizeDimensionValue(resizeWidthValue);

    if (nextWidth === null || nextWidth < 1) {
      return;
    }

    setResizeHeightValue(
      String(calculateHeightFromWidth(nextWidth, sourceDimensions)),
    );
  }

  function applyResizePreset(preset: ResizeDimensions) {
    setProcessingError(null);

    if (selectedItem) {
      setActiveStep("options");
    }

    const nextDimensions =
      keepAspectRatio && sourceDimensions
        ? fitWithinResizePreset(sourceDimensions, preset)
        : preset;

    setResizeWidthValue(String(nextDimensions.width));
    setResizeHeightValue(String(nextDimensions.height));
    setLastEditedDimension("width");
  }

  async function handleCompress() {
    if (!selectedItem) {
      setProcessingError("먼저 압축할 이미지를 추가해 주세요.");
      setActiveStep("upload");
      return;
    }

    if (hasTooManyFiles) {
      setProcessingError(
        "이미지 압축은 현재 한 번에 1개 파일만 지원합니다. 미리보기에서 하나만 남긴 뒤 다시 시도해 주세요.",
      );
      setActiveStep("upload");
      return;
    }

    if (!targetMimeType) {
      setProcessingError(
        "이 파일 형식은 현재 압축 출력 대상으로 사용할 수 없습니다.",
      );
      return;
    }

    setIsProcessing(true);
    setProcessingError(null);

    try {
      const image = await loadImageElement(selectedItem.previewUrl);
      const canvas = document.createElement("canvas");

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error(
          "브라우저에서 이미지 캔버스를 준비하지 못했습니다. 다른 브라우저에서 다시 시도해 주세요.",
        );
      }

      if (targetMimeType === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const blob = await canvasToBlob(
        canvas,
        targetMimeType,
        isQualityAdjustableFormat(targetMimeType) ? quality / 100 : undefined,
      );
      const actualMimeType = getSupportedImageMimeType({
        name: createCompressedFileName(selectedItem.file.name, targetMimeType),
        size: blob.size,
        type: blob.type,
        lastModified: Date.now(),
      });

      if (!actualMimeType || actualMimeType !== targetMimeType) {
        throw new Error(
          targetMimeType === "image/webp"
            ? "현재 브라우저에서는 WebP 내보내기를 지원하지 않습니다. JPEG 또는 원본 형식으로 다시 시도해 주세요."
            : "선택한 출력 형식으로 파일을 저장하지 못했습니다. 다른 형식으로 다시 시도해 주세요.",
        );
      }

      setCompressionResult({
        blob,
        fileName: createCompressedFileName(selectedItem.file.name, actualMimeType),
        mimeType: actualMimeType,
        outputFormat,
        previewUrl: URL.createObjectURL(blob),
        quality,
        sourceId: selectedItem.id,
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
      setActiveStep("export");
    } catch (error: unknown) {
      setProcessingError(
        error instanceof Error
          ? error.message
          : "이미지 압축 중 오류가 발생했습니다. 다시 시도해 주세요.",
      );
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleResize() {
    if (!selectedItem) {
      setProcessingError("먼저 크기를 조절할 이미지를 추가해 주세요.");
      setActiveStep("upload");
      return;
    }

    if (hasTooManyFiles) {
      setProcessingError(
        "이미지 크기 조절은 현재 한 번에 1개 파일만 지원합니다. 미리보기에서 하나만 남긴 뒤 다시 시도해 주세요.",
      );
      setActiveStep("upload");
      return;
    }

    if (!selectedMimeType) {
      setProcessingError(
        "이 파일 형식은 현재 크기 조절 출력 대상으로 사용할 수 없습니다.",
      );
      return;
    }

    if (!resizeValidation || !resizeValidation.ok) {
      setProcessingError(
        resizeValidation?.message ??
          "가로와 세로 값을 다시 확인해 주세요.",
      );
      setActiveStep("options");
      return;
    }

    setIsProcessing(true);
    setProcessingError(null);

    try {
      const image = await loadImageElement(selectedItem.previewUrl);
      const canvas = document.createElement("canvas");

      canvas.width = resizeValidation.width;
      canvas.height = resizeValidation.height;

      if (
        canvas.width !== resizeValidation.width ||
        canvas.height !== resizeValidation.height
      ) {
        throw new Error(
          "입력한 크기가 현재 브라우저에서 처리 가능한 범위를 넘습니다. 더 작은 값으로 다시 시도해 주세요.",
        );
      }

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error(
          "브라우저에서 이미지 캔버스를 준비하지 못했습니다. 다른 브라우저에서 다시 시도해 주세요.",
        );
      }

      if (selectedMimeType === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const blob = await canvasToBlob(canvas, selectedMimeType);
      const actualMimeType = getSupportedImageMimeType({
        name: createResizedFileName(selectedItem.file.name, selectedMimeType),
        size: blob.size,
        type: blob.type,
        lastModified: Date.now(),
      });

      if (!actualMimeType || actualMimeType !== selectedMimeType) {
        throw new Error(
          selectedMimeType === "image/webp"
            ? "현재 브라우저에서는 WebP 리사이즈 내보내기를 지원하지 않습니다. 다른 형식으로 다시 저장해 주세요."
            : "선택한 형식으로 리사이즈 결과를 저장하지 못했습니다. 다른 이미지로 다시 시도해 주세요.",
        );
      }

      setResizeResult({
        blob,
        fileName: createResizedFileName(selectedItem.file.name, actualMimeType),
        mimeType: actualMimeType,
        previewUrl: URL.createObjectURL(blob),
        sourceId: selectedItem.id,
        width: resizeValidation.width,
        height: resizeValidation.height,
      });
      setActiveStep("export");
    } catch (error: unknown) {
      setProcessingError(
        error instanceof Error
          ? error.message
          : "이미지 크기 조절 중 오류가 발생했습니다. 다시 시도해 주세요.",
      );
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleConvert() {
    if (!selectedItem) {
      setProcessingError("먼저 변환할 이미지를 추가해 주세요.");
      setActiveStep("upload");
      return;
    }

    if (hasTooManyFiles) {
      setProcessingError(
        "이미지 포맷 변환은 현재 한 번에 1개 파일만 지원합니다. 미리보기에서 하나만 남긴 뒤 다시 시도해 주세요.",
      );
      setActiveStep("upload");
      return;
    }

    if (!selectedMimeType) {
      setProcessingError(
        "이 파일 형식은 현재 포맷 변환 대상으로 사용할 수 없습니다.",
      );
      return;
    }

    if (selectedMimeType === conversionOutputFormat) {
      setProcessingError("출력 형식은 원본과 다른 형식을 선택해 주세요.");
      setActiveStep("options");
      return;
    }

    setIsProcessing(true);
    setProcessingError(null);

    try {
      const image = await loadImageElement(selectedItem.previewUrl);
      const canvas = document.createElement("canvas");

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error(
          "브라우저에서 이미지 캔버스를 준비하지 못했습니다. 다른 브라우저에서 다시 시도해 주세요.",
        );
      }

      if (conversionOutputFormat === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const blob = await canvasToBlob(
        canvas,
        conversionOutputFormat,
        isQualityAdjustableFormat(conversionOutputFormat)
          ? quality / 100
          : undefined,
      );
      const actualMimeType = getSupportedImageMimeType({
        name: createConvertedFileName(
          selectedItem.file.name,
          conversionOutputFormat,
        ),
        size: blob.size,
        type: blob.type,
        lastModified: Date.now(),
      });

      if (!actualMimeType || actualMimeType !== conversionOutputFormat) {
        throw new Error(
          conversionOutputFormat === "image/webp"
            ? "현재 브라우저에서는 WebP 변환 내보내기를 지원하지 않습니다. JPEG 또는 PNG로 다시 시도해 주세요."
            : conversionOutputFormat === "image/jpeg"
              ? "선택한 이미지를 JPEG로 저장하지 못했습니다. PNG 또는 WebP로 다시 시도해 주세요."
              : "선택한 이미지를 PNG로 저장하지 못했습니다. JPEG 또는 WebP로 다시 시도해 주세요.",
        );
      }

      setConvertResult({
        blob,
        fileName: createConvertedFileName(selectedItem.file.name, actualMimeType),
        mimeType: actualMimeType,
        previewUrl: URL.createObjectURL(blob),
        quality,
        sourceId: selectedItem.id,
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
      setActiveStep("export");
    } catch (error: unknown) {
      setProcessingError(
        error instanceof Error
          ? error.message
          : "이미지 포맷 변환 중 오류가 발생했습니다. 다시 시도해 주세요.",
      );
    } finally {
      setIsProcessing(false);
    }
  }

  function handleDownloadCompressionResult() {
    if (!compressionResult) {
      return;
    }

    downloadBlobUrl(compressionResult.previewUrl, compressionResult.fileName);
  }

  function handleDownloadResizeResult() {
    if (!resizeResult) {
      return;
    }

    downloadBlobUrl(resizeResult.previewUrl, resizeResult.fileName);
  }

  function handleDownloadConvertResult() {
    if (!convertResult) {
      return;
    }

    downloadBlobUrl(convertResult.previewUrl, convertResult.fileName);
  }

  return (
    <section className="tool-shell" aria-labelledby="tool-shell-title">
      <div className="tool-shell__header">
        <div>
          <h2 id="tool-shell-title">{title} 작업 패널</h2>
          <p>{description}</p>
        </div>
        <span className="tool-shell__badge">
          {isCompressTool
            ? "브라우저 로컬 압축 활성화"
            : isResizeTool
              ? "브라우저 로컬 리사이즈 활성화"
              : isConvertTool
                ? "브라우저 로컬 포맷 변환 활성화"
              : "브라우저 로컬 업로드 활성화"}
        </span>
      </div>

      <div className="tool-shell__workspace">
        <div
          className="tool-shell__dropzone"
          data-dragging={isDragging}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            accept={supportedImageAccept}
            aria-label="이미지 파일 선택"
            className="visually-hidden"
            multiple={!isSingleFileTool}
            onChange={handleInputChange}
            type="file"
          />
          <strong>이미지를 끌어 놓거나 파일 선택으로 추가하세요</strong>
          <p>
            지원 형식은 {supportedImageTypesText}입니다. 붙여넣기 이미지는 이
            페이지에서 <kbd>Ctrl</kbd> + <kbd>V</kbd> 로 바로 추가할 수
            있습니다.
          </p>
          <div className="tool-shell__drop-actions">
            <button className="button-link" onClick={openFilePicker} type="button">
              파일 선택
            </button>
            <button
              className="button-muted"
              onClick={clearItems}
              type="button"
              disabled={items.length === 0}
            >
              업로드 초기화
            </button>
          </div>
          <ul className="chip-list">
            <li>브라우저 안에서만 파일 보관 및 처리</li>
            <li>JPEG, PNG, WebP 파일만 허용</li>
            <li>
              {isCompressTool
                ? "현재 압축 도구는 단일 파일 작업만 지원"
                : isResizeTool
                  ? "현재 크기 조절 도구는 단일 파일 작업만 지원"
                  : isConvertTool
                    ? "현재 포맷 변환 도구는 단일 파일 작업만 지원"
                  : "이후 도구 페이지에서도 같은 업로드 상태 재사용 가능"}
            </li>
          </ul>
        </div>

        {errors.length > 0 ? (
          <div className="tool-shell__message" role="alert">
            <div className="tool-shell__message-header">
              <strong>확인할 업로드 메시지</strong>
              <button className="button-muted" onClick={clearErrors} type="button">
                메시지 지우기
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
          <div className="tool-shell__message" role="alert">
            <strong>{processingErrorTitle}</strong>
            <p>{processingError}</p>
          </div>
        ) : null}

        {hasTooManyFiles ? (
          <div className="tool-shell__message" role="alert">
            <strong>단일 파일만 남겨 주세요</strong>
            <p>{singleFileLimitMessage}</p>
          </div>
        ) : null}

        <div className="detail-grid tool-shell__summary-grid">
          <div className="card">
            <h3>현재 상태</h3>
            <p>{fileCountLabel}</p>
          </div>
          <div className="card">
            <h3>총 업로드 용량</h3>
            <p>{items.length > 0 ? formatFileSize(totalSize) : "0 B"}</p>
          </div>
          <div className="card">
            <h3>최근 추가 방법</h3>
            <p>{lastSource ? sourceLabels[lastSource] : "아직 없음"}</p>
          </div>
        </div>

        {items.length > 0 ? (
          <div className="detail-grid tool-shell__preview-grid">
            {items.map((item) => (
              <article className="card tool-shell__preview-card" key={item.id}>
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
                  <h3>{item.file.name}</h3>
                  <p>{item.typeLabel}</p>
                  <p>{formatFileSize(item.file.size)}</p>
                </div>
                <div className="tool-shell__preview-actions">
                  <button
                    className="button-muted"
                    onClick={() => removeItem(item.id)}
                    type="button"
                  >
                    목록에서 제거
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="tool-shell__empty">
            <strong>미리보기는 업로드 후 여기에 표시됩니다.</strong>
            <p>
              아직 파일이 없습니다. {supportedImageTypesText} 이미지를 추가하면
              각 파일 카드에서 형식과 용량을 바로 확인할 수 있습니다.
            </p>
          </div>
        )}

        {isCompressTool && selectedItem ? (
          <div className="detail-grid tool-shell__comparison-grid">
            <section className="card tool-shell__option-card">
              <h3>압축 옵션</h3>

              <label className="tool-shell__field" htmlFor="compress-output-format">
                <span>출력 형식</span>
                <select
                  className="tool-shell__select"
                  id="compress-output-format"
                  onChange={(event) =>
                    setOutputFormat(event.currentTarget.value as CompressionOutputFormat)
                  }
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
                {compressionOutputOptions.find((option) => option.value === outputFormat)
                  ?.description ?? "출력 형식을 선택해 압축 결과를 저장합니다."}
              </p>

              <label className="tool-shell__field" htmlFor="compress-quality">
                <span>품질</span>
                <div className="tool-shell__range-row">
                  <input
                    id="compress-quality"
                    max="100"
                    min="40"
                    onChange={(event) => setQuality(Number(event.currentTarget.value))}
                    step="1"
                    type="range"
                    value={quality}
                    disabled={!isQualityEnabled}
                  />
                  <strong>{isQualityEnabled ? `${quality}%` : "무손실"}</strong>
                </div>
              </label>

              <p className="tool-shell__helper">
                {isQualityEnabled
                  ? "값이 낮을수록 파일은 더 작아질 수 있지만, 세부 묘사가 줄어들 수 있습니다."
                  : "PNG로 저장하면 품질 슬라이더 대신 원본 해상도 그대로 무손실 재저장이 적용됩니다."}
              </p>
            </section>

            <section className="card">
              <h3>원본 정보</h3>
              <dl className="tool-shell__stat-list">
                <div>
                  <dt>파일명</dt>
                  <dd>{selectedItem.file.name}</dd>
                </div>
                <div>
                  <dt>원본 형식</dt>
                  <dd>
                    {selectedMimeType
                      ? getCompressionMimeTypeLabel(selectedMimeType)
                      : "확인 불가"}
                  </dd>
                </div>
                <div>
                  <dt>파일 크기</dt>
                  <dd>{formatFileSize(selectedItem.file.size)}</dd>
                </div>
                <div>
                  <dt>해상도</dt>
                  <dd>{sourceDimensions ? formatDimensions(sourceDimensions) : "읽는 중"}</dd>
                </div>
                <div>
                  <dt>저장 이름</dt>
                  <dd>
                    {targetMimeType
                      ? createCompressedFileName(selectedItem.file.name, targetMimeType)
                      : "형식 확인 필요"}
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        ) : null}

        {isResizeTool && selectedItem ? (
          <div className="detail-grid tool-shell__comparison-grid">
            <section className="card tool-shell__option-card">
              <h3>크기 조절 옵션</h3>

              <div className="tool-shell__dimension-grid">
                <label className="tool-shell__field" htmlFor="resize-width">
                  <span>가로 (px)</span>
                  <input
                    className="tool-shell__input"
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
                    className="tool-shell__input"
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
                  id="resize-keep-aspect-ratio"
                  onChange={handleKeepAspectRatioChange}
                  type="checkbox"
                />
                <span>
                  <strong>비율 유지</strong>
                  <small>
                    켜져 있으면 한쪽 값을 바꿀 때 원본 비율에 맞춰 다른 쪽 값을
                    자동 계산합니다.
                  </small>
                </span>
              </label>

              <div className="tool-shell__field">
                <span>자주 쓰는 프리셋</span>
                <div className="tool-shell__preset-list">
                  {resizePresetOptions.map((preset) => {
                    const nextDimensions =
                      keepAspectRatio && sourceDimensions
                        ? fitWithinResizePreset(sourceDimensions, preset)
                        : preset;

                    return (
                      <button
                        className="tool-shell__preset"
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
                {keepAspectRatio
                  ? "비율 잠금이 켜져 있으면 프리셋 박스 안에 맞도록 원본 비율을 유지해 자동 계산합니다."
                  : "비율 잠금이 꺼져 있으면 프리셋의 가로와 세로 값을 그대로 적용합니다."}
              </p>

              {resizeValidationMessage ? (
                <p className="tool-shell__helper tool-shell__helper--error">
                  {resizeValidationMessage}
                </p>
              ) : null}
            </section>

            <section className="card">
              <h3>원본 정보</h3>
              <dl className="tool-shell__stat-list">
                <div>
                  <dt>파일명</dt>
                  <dd>{selectedItem.file.name}</dd>
                </div>
                <div>
                  <dt>원본 형식</dt>
                  <dd>
                    {selectedMimeType
                      ? getCompressionMimeTypeLabel(selectedMimeType)
                      : "확인 불가"}
                  </dd>
                </div>
                <div>
                  <dt>파일 크기</dt>
                  <dd>{formatFileSize(selectedItem.file.size)}</dd>
                </div>
                <div>
                  <dt>원본 해상도</dt>
                  <dd>{sourceDimensions ? formatDimensions(sourceDimensions) : "읽는 중"}</dd>
                </div>
              </dl>
            </section>

            <section className="card">
              <h3>예상 출력</h3>
              <dl className="tool-shell__stat-list">
                <div>
                  <dt>출력 형식</dt>
                  <dd>
                    {selectedMimeType
                      ? getCompressionMimeTypeLabel(selectedMimeType)
                      : "형식 확인 필요"}
                  </dd>
                </div>
                <div>
                  <dt>출력 해상도</dt>
                  <dd>
                    {resizeTargetDimensions
                      ? formatDimensions(resizeTargetDimensions)
                      : "입력 확인 필요"}
                  </dd>
                </div>
                <div>
                  <dt>크기 비율</dt>
                  <dd>
                    {sourceDimensions && resizeTargetDimensions
                      ? formatResizeScaleSummary(
                          sourceDimensions,
                          resizeTargetDimensions,
                        )
                      : "입력 확인 필요"}
                  </dd>
                </div>
                <div>
                  <dt>저장 이름</dt>
                  <dd>
                    {selectedMimeType
                      ? createResizedFileName(selectedItem.file.name, selectedMimeType)
                      : "형식 확인 필요"}
                  </dd>
                </div>
              </dl>
              <p className="tool-shell__helper">
                리사이즈 결과는 원본 형식을 유지하며, 결과 파일명에는
                `-resized`가 붙습니다.
              </p>
            </section>
          </div>
        ) : null}

        {isConvertTool && selectedItem ? (
          <div className="detail-grid tool-shell__comparison-grid">
            <section className="card tool-shell__option-card">
              <h3>포맷 변환 옵션</h3>

              <label className="tool-shell__field" htmlFor="convert-output-format">
                <span>출력 형식</span>
                <select
                  className="tool-shell__select"
                  id="convert-output-format"
                  onChange={handleConversionOutputChange}
                  value={conversionOutputFormat}
                >
                  {conversionOutputOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      disabled={option.value === selectedMimeType}
                    >
                      {option.value === selectedMimeType
                        ? `${option.label} (원본과 동일)`
                        : option.label}
                    </option>
                  ))}
                </select>
              </label>

              <p className="tool-shell__helper">
                {conversionTargetMimeType
                  ? getConversionOutputDescription(conversionTargetMimeType)
                  : "출력 형식을 선택해 변환 결과를 저장합니다."}
              </p>

              <label className="tool-shell__field" htmlFor="convert-quality">
                <span>품질</span>
                <div className="tool-shell__range-row">
                  <input
                    id="convert-quality"
                    max="100"
                    min="40"
                    onChange={handleQualityChange}
                    step="1"
                    type="range"
                    value={quality}
                    disabled={!isConvertQualityEnabled}
                  />
                  <strong>{isConvertQualityEnabled ? `${quality}%` : "무손실"}</strong>
                </div>
              </label>

              <p className="tool-shell__helper">
                {conversionTargetMimeType === "image/jpeg" &&
                selectedMimeType &&
                selectedMimeType !== "image/jpeg"
                  ? "JPEG는 투명 배경을 저장하지 못하므로 투명 영역이 있다면 흰색으로 채워집니다."
                  : isConvertQualityEnabled
                    ? "JPEG와 WebP는 품질 값을 낮출수록 파일이 더 작아질 수 있지만 세부 묘사가 줄어들 수 있습니다."
                    : "PNG는 품질 슬라이더 대신 원본 해상도를 유지한 무손실 저장이 적용됩니다."}
              </p>
            </section>

            <section className="card">
              <h3>원본 정보</h3>
              <dl className="tool-shell__stat-list">
                <div>
                  <dt>파일명</dt>
                  <dd>{selectedItem.file.name}</dd>
                </div>
                <div>
                  <dt>원본 형식</dt>
                  <dd>
                    {selectedMimeType
                      ? getCompressionMimeTypeLabel(selectedMimeType)
                      : "확인 불가"}
                  </dd>
                </div>
                <div>
                  <dt>파일 크기</dt>
                  <dd>{formatFileSize(selectedItem.file.size)}</dd>
                </div>
                <div>
                  <dt>해상도</dt>
                  <dd>{sourceDimensions ? formatDimensions(sourceDimensions) : "읽는 중"}</dd>
                </div>
              </dl>
            </section>

            <section className="card">
              <h3>예상 출력</h3>
              <dl className="tool-shell__stat-list">
                <div>
                  <dt>출력 형식</dt>
                  <dd>
                    {conversionTargetMimeType
                      ? getCompressionMimeTypeLabel(conversionTargetMimeType)
                      : "형식 확인 필요"}
                  </dd>
                </div>
                <div>
                  <dt>형식 특징</dt>
                  <dd>
                    {conversionTargetMimeType
                      ? getConversionOutputDescription(conversionTargetMimeType)
                      : "형식 확인 필요"}
                  </dd>
                </div>
                <div>
                  <dt>품질 설정</dt>
                  <dd>{isConvertQualityEnabled ? `${quality}%` : "무손실"}</dd>
                </div>
                <div>
                  <dt>해상도</dt>
                  <dd>{sourceDimensions ? formatDimensions(sourceDimensions) : "읽는 중"}</dd>
                </div>
                <div>
                  <dt>저장 이름</dt>
                  <dd>
                    {conversionTargetMimeType
                      ? createConvertedFileName(
                          selectedItem.file.name,
                          conversionTargetMimeType,
                        )
                      : "형식 확인 필요"}
                  </dd>
                </div>
              </dl>
            </section>
          </div>
        ) : null}

        {isCompressTool && compressionResult && selectedItem ? (
          <div className="detail-grid tool-shell__comparison-grid">
            <article className="card tool-shell__preview-card">
              <div className="tool-shell__preview-media">
                <Image
                  alt={`${compressionResult.fileName} 미리보기`}
                  fill
                  sizes="(min-width: 900px) 30vw, (min-width: 640px) 45vw, 100vw"
                  src={compressionResult.previewUrl}
                  unoptimized
                />
              </div>
              <div className="tool-shell__preview-meta">
                <h3>{compressionResult.fileName}</h3>
                <p>{getCompressionMimeTypeLabel(compressionResult.mimeType)}</p>
                <p>{formatFileSize(compressionResult.blob.size)}</p>
              </div>
            </article>

            <section className="card">
              <h3>압축 결과</h3>
              <dl className="tool-shell__stat-list">
                <div>
                  <dt>압축 전</dt>
                  <dd>{formatFileSize(selectedItem.file.size)}</dd>
                </div>
                <div>
                  <dt>압축 후</dt>
                  <dd>{formatFileSize(compressionResult.blob.size)}</dd>
                </div>
                <div>
                  <dt>용량 변화</dt>
                  <dd>
                    {formatCompressionSummary(
                      selectedItem.file.size,
                      compressionResult.blob.size,
                    )}
                  </dd>
                </div>
                <div>
                  <dt>출력 형식</dt>
                  <dd>{getCompressionMimeTypeLabel(compressionResult.mimeType)}</dd>
                </div>
                <div>
                  <dt>해상도</dt>
                  <dd>{formatDimensions(compressionResult)}</dd>
                </div>
              </dl>

              {isCompressionResultStale ? (
                <p className="tool-shell__helper">
                  옵션이 변경되어 현재 결과는 이전 설정 기준입니다. 최신 설정으로
                  덮어쓰려면 다시 압축해 주세요.
                </p>
              ) : (
                <p className="tool-shell__helper">
                  결과 파일은 현재 브라우저 메모리에만 존재하며, 다운로드하지 않으면
                  서버로 전송되지 않습니다.
                </p>
              )}
            </section>
          </div>
        ) : null}

        {isResizeTool && resizeResult && selectedItem ? (
          <div className="detail-grid tool-shell__comparison-grid">
            <article className="card tool-shell__preview-card">
              <div className="tool-shell__preview-media">
                <Image
                  alt={`${resizeResult.fileName} 미리보기`}
                  fill
                  sizes="(min-width: 900px) 30vw, (min-width: 640px) 45vw, 100vw"
                  src={resizeResult.previewUrl}
                  unoptimized
                />
              </div>
              <div className="tool-shell__preview-meta">
                <h3>{resizeResult.fileName}</h3>
                <p>{getCompressionMimeTypeLabel(resizeResult.mimeType)}</p>
                <p>{formatFileSize(resizeResult.blob.size)}</p>
              </div>
            </article>

            <section className="card">
              <h3>크기 조절 결과</h3>
              <dl className="tool-shell__stat-list">
                <div>
                  <dt>원본 해상도</dt>
                  <dd>{sourceDimensions ? formatDimensions(sourceDimensions) : "확인 불가"}</dd>
                </div>
                <div>
                  <dt>결과 해상도</dt>
                  <dd>{formatDimensions(resizeResult)}</dd>
                </div>
                <div>
                  <dt>크기 비율</dt>
                  <dd>
                    {sourceDimensions
                      ? formatResizeScaleSummary(sourceDimensions, resizeResult)
                      : "확인 불가"}
                  </dd>
                </div>
                <div>
                  <dt>원본 크기</dt>
                  <dd>{formatFileSize(selectedItem.file.size)}</dd>
                </div>
                <div>
                  <dt>결과 크기</dt>
                  <dd>{formatFileSize(resizeResult.blob.size)}</dd>
                </div>
                <div>
                  <dt>출력 형식</dt>
                  <dd>{getCompressionMimeTypeLabel(resizeResult.mimeType)}</dd>
                </div>
                <div>
                  <dt>저장 이름</dt>
                  <dd>{resizeResult.fileName}</dd>
                </div>
              </dl>

              {isResizeResultStale ? (
                <p className="tool-shell__helper">
                  입력 값이 변경되어 현재 결과는 이전 설정 기준입니다. 최신 설정으로
                  다시 저장하려면 크기 조절을 한 번 더 실행해 주세요.
                </p>
              ) : (
                <p className="tool-shell__helper">
                  결과 파일은 현재 브라우저 메모리에만 존재하며, 다운로드하지 않으면
                  서버로 전송되지 않습니다.
                </p>
              )}
            </section>
          </div>
        ) : null}

        {isConvertTool && convertResult && selectedItem ? (
          <div className="detail-grid tool-shell__comparison-grid">
            <article className="card tool-shell__preview-card">
              <div className="tool-shell__preview-media">
                <Image
                  alt={`${convertResult.fileName} 미리보기`}
                  fill
                  sizes="(min-width: 900px) 30vw, (min-width: 640px) 45vw, 100vw"
                  src={convertResult.previewUrl}
                  unoptimized
                />
              </div>
              <div className="tool-shell__preview-meta">
                <h3>{convertResult.fileName}</h3>
                <p>{getCompressionMimeTypeLabel(convertResult.mimeType)}</p>
                <p>{formatFileSize(convertResult.blob.size)}</p>
              </div>
            </article>

            <section className="card">
              <h3>포맷 변환 결과</h3>
              <dl className="tool-shell__stat-list">
                <div>
                  <dt>변환 전 형식</dt>
                  <dd>
                    {selectedMimeType
                      ? getCompressionMimeTypeLabel(selectedMimeType)
                      : "확인 불가"}
                  </dd>
                </div>
                <div>
                  <dt>변환 후 형식</dt>
                  <dd>{getCompressionMimeTypeLabel(convertResult.mimeType)}</dd>
                </div>
                <div>
                  <dt>원본 크기</dt>
                  <dd>{formatFileSize(selectedItem.file.size)}</dd>
                </div>
                <div>
                  <dt>결과 크기</dt>
                  <dd>{formatFileSize(convertResult.blob.size)}</dd>
                </div>
                <div>
                  <dt>용량 변화</dt>
                  <dd>
                    {formatCompressionSummary(
                      selectedItem.file.size,
                      convertResult.blob.size,
                    )}
                  </dd>
                </div>
                <div>
                  <dt>해상도</dt>
                  <dd>{formatDimensions(convertResult)}</dd>
                </div>
                <div>
                  <dt>품질 설정</dt>
                  <dd>
                    {isQualityAdjustableFormat(convertResult.mimeType)
                      ? `${convertResult.quality}%`
                      : "무손실"}
                  </dd>
                </div>
                <div>
                  <dt>저장 이름</dt>
                  <dd>{convertResult.fileName}</dd>
                </div>
              </dl>

              {isConvertResultStale ? (
                <p className="tool-shell__helper">
                  옵션이 변경되어 현재 결과는 이전 설정 기준입니다. 최신 설정으로
                  다시 저장하려면 포맷 변환을 한 번 더 실행해 주세요.
                </p>
              ) : (
                <p className="tool-shell__helper">
                  결과 파일은 현재 브라우저 메모리에만 존재하며, 다운로드하지 않으면
                  서버로 전송되지 않습니다.
                </p>
              )}
            </section>
          </div>
        ) : null}
      </div>

      <div className="tool-shell__step-list" aria-label="작업 흐름">
        {Object.entries(stepLabels).map(([key, label]) => {
          const stepKey = key as StepKey;

          return (
            <button
              key={stepKey}
              className="tool-shell__step"
              data-active={activeStep === stepKey}
              onClick={() => setActiveStep(stepKey)}
              type="button"
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="tool-shell__status" role="status" aria-live="polite">
        <strong>{stepLabels[activeStep]}</strong>
        <p>{statusByStep[activeStep]}</p>
      </div>

      <div className="tool-shell__actions">
        {isCompressTool ? (
          <>
            <button
              className="button-link"
              type="button"
              disabled={!selectedItem || hasTooManyFiles || isProcessing}
              onClick={handleCompress}
            >
              {isProcessing ? "압축 중..." : primaryActionLabel}
            </button>
            <button
              className="button-muted"
              type="button"
              disabled={!compressionResult}
              onClick={handleDownloadCompressionResult}
            >
              결과 다운로드
            </button>
          </>
        ) : isResizeTool ? (
          <>
            <button
              className="button-link"
              type="button"
              disabled={!selectedItem || hasTooManyFiles || isProcessing}
              onClick={handleResize}
            >
              {isProcessing ? "크기 조절 중..." : primaryActionLabel}
            </button>
            <button
              className="button-muted"
              type="button"
              disabled={!resizeResult}
              onClick={handleDownloadResizeResult}
            >
              결과 다운로드
            </button>
          </>
        ) : isConvertTool ? (
          <>
            <button
              className="button-link"
              type="button"
              disabled={!selectedItem || hasTooManyFiles || isProcessing}
              onClick={handleConvert}
            >
              {isProcessing ? "변환 중..." : primaryActionLabel}
            </button>
            <button
              className="button-muted"
              type="button"
              disabled={!convertResult}
              onClick={handleDownloadConvertResult}
            >
              결과 다운로드
            </button>
          </>
        ) : (
          <>
            <button className="button-link" type="button" disabled>
              {primaryActionLabel}
            </button>
            <button className="button-muted" type="button" disabled>
              배치 내보내기 연결 예정
            </button>
          </>
        )}
      </div>
    </section>
  );
}
