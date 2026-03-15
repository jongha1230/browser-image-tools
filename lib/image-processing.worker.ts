/// <reference lib="webworker" />

import {
  getMimeMismatchMessage,
  resolveImageProcessingPlan,
  type ImageWorkerRequest,
  type ImageWorkerResponse,
} from "./image-processing";
import { getSupportedImageMimeType } from "./image-upload";

const workerScope = self as DedicatedWorkerGlobalScope;

class WorkerEnvironmentError extends Error {}

async function processImageInWorker({
  file,
  options,
}: ImageWorkerRequest) {
  if (
    typeof createImageBitmap !== "function" ||
    typeof OffscreenCanvas === "undefined"
  ) {
    throw new WorkerEnvironmentError(
      "현재 브라우저에서는 백그라운드 이미지 처리를 지원하지 않아 메인 스레드 처리로 전환합니다.",
    );
  }

  const bitmap = await createImageBitmap(file);

  try {
    const plan = resolveImageProcessingPlan(
      file,
      {
        width: bitmap.width,
        height: bitmap.height,
      },
      options,
    );
    const canvas = new OffscreenCanvas(plan.width, plan.height);
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error(
        "브라우저에서 이미지 캔버스를 준비하지 못했습니다. 다른 브라우저에서 다시 시도해 주세요.",
      );
    }

    if (typeof canvas.convertToBlob !== "function") {
      throw new WorkerEnvironmentError(
        "현재 브라우저에서는 백그라운드 결과 인코딩을 지원하지 않아 메인 스레드 처리로 전환합니다.",
      );
    }

    if (plan.fillBackground) {
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const blob = await canvas.convertToBlob({
      type: plan.mimeType,
      quality: plan.encodeQuality,
    });
    const actualMimeType = getSupportedImageMimeType({
      name: plan.fileName,
      size: blob.size,
      type: blob.type,
      lastModified: Date.now(),
    });

    if (!actualMimeType || actualMimeType !== plan.mimeType) {
      throw new Error(getMimeMismatchMessage(options, plan.mimeType));
    }

    return {
      ...plan,
      blob,
      mimeType: actualMimeType,
    };
  } finally {
    if ("close" in bitmap) {
      bitmap.close();
    }
  }
}

workerScope.onmessage = async (event: MessageEvent<ImageWorkerRequest>) => {
  const { data } = event;

  try {
    const result = await processImageInWorker(data);
    const message: ImageWorkerResponse = {
      id: data.id,
      ok: true,
      result,
    };

    workerScope.postMessage(message);
  } catch (error: unknown) {
    const message: ImageWorkerResponse = {
      id: data.id,
      ok: false,
      error: {
        code:
          error instanceof WorkerEnvironmentError
            ? "UNSUPPORTED_ENV"
            : "PROCESSING_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "이미지 처리 중 오류가 발생했습니다. 다시 시도해 주세요.",
      },
    };

    workerScope.postMessage(message);
  }
};

export {};
