"use client";

import {
  useEffect,
  useEffectEvent,
  type Dispatch,
  type MutableRefObject,
  type RefObject,
  type SetStateAction,
} from "react";

import type { UploadedImage } from "@/components/image-upload-provider";
import { getDefaultConversionMimeType } from "@/lib/convert-image";
import { createImageProcessingWorkerClient } from "@/lib/image-processing-client";
import type { SupportedImageMimeType } from "@/lib/image-upload";
import type { ResizeDimensions } from "@/lib/resize-image";

import {
  getClipboardFiles,
  loadImageElement,
  type ProcessingEngine,
  type QueueItemState,
  type StepKey,
  type ToolShellVariant,
  type WorkflowPresetId,
} from "./shared";

type UseToolShellEffectsArgs = {
  handleIncomingFiles: (
    files: Iterable<File> | ArrayLike<File> | null | undefined,
    source: "drop" | "input" | "paste",
  ) => void;
  hasItems: boolean;
  hasQueuedItems: boolean;
  hasResults: boolean;
  isConvertTool: boolean;
  isProcessing: boolean;
  isResizeTool: boolean;
  itemIdsSignature: string;
  items: UploadedImage[];
  optionPanelRef: RefObject<HTMLElement | null>;
  previousHasResultsRef: MutableRefObject<boolean>;
  previousItemCountRef: MutableRefObject<number>;
  processingSignature: string;
  runIdRef: MutableRefObject<number>;
  selectedItemId: string | null;
  selectedMimeType: SupportedImageMimeType | null;
  selectedPreviewUrl: string | null;
  setActiveStep: Dispatch<SetStateAction<StepKey>>;
  setConversionOutputFormat: Dispatch<
    SetStateAction<SupportedImageMimeType>
  >;
  setKeepAspectRatio: Dispatch<SetStateAction<boolean>>;
  setLastEditedDimension: Dispatch<SetStateAction<"width" | "height">>;
  setProcessingEngine: Dispatch<SetStateAction<ProcessingEngine>>;
  setProcessingError: Dispatch<SetStateAction<string | null>>;
  setProcessingNote: Dispatch<SetStateAction<string | null>>;
  setQueueState: Dispatch<
    SetStateAction<Record<string, QueueItemState>>
  >;
  setReadyForReplacement: Dispatch<SetStateAction<boolean>>;
  setReferenceDimensions: Dispatch<SetStateAction<ResizeDimensions | null>>;
  setResizeHeightValue: Dispatch<SetStateAction<string>>;
  setResizeWidthValue: Dispatch<SetStateAction<string>>;
  setSelectedWorkflowPresetId: Dispatch<
    SetStateAction<WorkflowPresetId | null>
  >;
  variant: ToolShellVariant;
  workerClientRef: MutableRefObject<
    ReturnType<typeof createImageProcessingWorkerClient> | null
  >;
  workflowSummaryRef: RefObject<HTMLDivElement | null>;
};

export function focusWorkspaceRegion(node: HTMLElement | null) {
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

export function useToolShellEffects({
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
}: UseToolShellEffectsArgs) {
  useEffect(() => {
    setProcessingEngine(typeof Worker === "undefined" ? "main" : "worker");
  }, [setProcessingEngine]);

  useEffect(() => {
    return () => {
      runIdRef.current += 1;
      workerClientRef.current?.terminate();
      workerClientRef.current = null;
    };
  }, [runIdRef, workerClientRef]);

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
  }, [
    processingSignature,
    setProcessingError,
    setProcessingNote,
    setQueueState,
    setReadyForReplacement,
    variant,
  ]);

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
  }, [
    itemIdsSignature,
    items,
    setProcessingError,
    setProcessingNote,
    setQueueState,
    setReadyForReplacement,
  ]);

  useEffect(() => {
    setSelectedWorkflowPresetId(null);

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
          setConversionOutputFormat(
            getDefaultConversionMimeType(selectedMimeType),
          );
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
    isConvertTool,
    isResizeTool,
    selectedItemId,
    selectedMimeType,
    selectedPreviewUrl,
    setActiveStep,
    setConversionOutputFormat,
    setKeepAspectRatio,
    setLastEditedDimension,
    setProcessingError,
    setReferenceDimensions,
    setResizeHeightValue,
    setResizeWidthValue,
    setSelectedWorkflowPresetId,
  ]);

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
  }, [hasQueuedItems, hasResults, isProcessing, items.length, setActiveStep]);

  useEffect(() => {
    if (!hasItems) {
      previousItemCountRef.current = 0;
      return;
    }

    if (previousItemCountRef.current === 0 && items.length > 0) {
      focusWorkspaceRegion(optionPanelRef.current);
    }

    previousItemCountRef.current = items.length;
  }, [hasItems, items.length, optionPanelRef, previousItemCountRef]);

  useEffect(() => {
    if (!hasResults) {
      previousHasResultsRef.current = false;
      return;
    }

    if (!previousHasResultsRef.current) {
      focusWorkspaceRegion(workflowSummaryRef.current);
    }

    previousHasResultsRef.current = true;
  }, [hasResults, previousHasResultsRef, workflowSummaryRef]);
}
