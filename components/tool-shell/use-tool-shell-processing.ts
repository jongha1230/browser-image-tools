"use client";

import {
  type Dispatch,
  type MutableRefObject,
  type RefObject,
  type SetStateAction,
} from "react";

import type { UploadedImage } from "@/components/image-upload-provider";
import {
  createImageProcessingWorkerClient,
  isUnsupportedWorkerError,
  processImageFileOnMainThread,
} from "@/lib/image-processing-client";
import {
  createBatchZipFileName,
  type ImageProcessOptions,
  type ProcessedImagePayload,
} from "@/lib/image-processing";
import { createStoredZipArchive } from "@/lib/zip-archive";

import { focusWorkspaceRegion } from "./use-tool-shell-effects";
import {
  downloadBlob,
  type ProcessingEngine,
  type QueueItemState,
  type StepKey,
} from "./shared";

type UseToolShellProcessingArgs = {
  currentOptions: ImageProcessOptions | null;
  dropzoneRef: RefObject<HTMLDivElement | null>;
  hasValidResizeOptions: boolean;
  isResizeTool: boolean;
  items: UploadedImage[];
  processingEngine: ProcessingEngine;
  queueState: Record<string, QueueItemState>;
  resizeValidationMessage: string | null;
  runIdRef: MutableRefObject<number>;
  selectedItemId: string | null;
  setActiveStep: Dispatch<SetStateAction<StepKey>>;
  setIsPreparingZip: Dispatch<SetStateAction<boolean>>;
  setIsProcessing: Dispatch<SetStateAction<boolean>>;
  setProcessingEngine: Dispatch<SetStateAction<ProcessingEngine>>;
  setProcessingError: Dispatch<SetStateAction<string | null>>;
  setProcessingNote: Dispatch<SetStateAction<string | null>>;
  setQueueState: Dispatch<
    SetStateAction<Record<string, QueueItemState>>
  >;
  setReadyForReplacement: Dispatch<SetStateAction<boolean>>;
  successCount: number;
  toolVariant: ImageProcessOptions["variant"] | null;
  workerClientRef: MutableRefObject<
    ReturnType<typeof createImageProcessingWorkerClient> | null
  >;
};

export function useToolShellProcessing({
  currentOptions,
  dropzoneRef,
  hasValidResizeOptions,
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
}: UseToolShellProcessingArgs) {
  function getWorkerClient() {
    if (!workerClientRef.current) {
      workerClientRef.current = createImageProcessingWorkerClient();
    }

    return workerClientRef.current;
  }

  function moveToNextUploadStep() {
    setReadyForReplacement(true);
    setActiveStep("upload");

    window.setTimeout(() => {
      focusWorkspaceRegion(dropzoneRef.current);
    }, 120);
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

    if (isResizeTool && !hasValidResizeOptions) {
      setProcessingError(
        resizeValidationMessage ?? "가로와 세로 값을 다시 확인해 주세요.",
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

      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 0);
      });
    }

    if (engine === "worker") {
      setProcessingEngine("worker");
    }

    setIsProcessing(false);
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

  return {
    handleDownloadResult,
    handleDownloadZip,
    handleProcessAll,
    moveToNextUploadStep,
  };
}
