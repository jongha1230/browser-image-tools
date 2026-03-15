import {
  getMimeMismatchMessage,
  resolveImageProcessingPlan,
  type ImageProcessOptions,
  type ImageWorkerRequest,
  type ImageWorkerResponse,
  type ProcessedImagePayload,
} from "./image-processing";
import { getSupportedImageMimeType, type SupportedImageMimeType } from "./image-upload";

const canvasErrorMessage =
  "브라우저에서 이미지 캔버스를 준비하지 못했습니다. 다른 브라우저에서 다시 시도해 주세요.";

class UnsupportedWorkerError extends Error {
  code = "UNSUPPORTED_ENV" as const;
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

function resolveActualMimeType(
  fileName: string,
  blob: Blob,
  options: ImageProcessOptions,
  expectedMimeType: SupportedImageMimeType,
) {
  const actualMimeType = getSupportedImageMimeType({
    name: fileName,
    size: blob.size,
    type: blob.type,
    lastModified: Date.now(),
  });

  if (!actualMimeType || actualMimeType !== expectedMimeType) {
    throw new Error(getMimeMismatchMessage(options, expectedMimeType));
  }

  return actualMimeType;
}

export function isUnsupportedWorkerError(error: unknown) {
  return error instanceof UnsupportedWorkerError;
}

export async function processImageFileOnMainThread(
  file: File,
  sourceUrl: string,
  options: ImageProcessOptions,
): Promise<ProcessedImagePayload> {
  const image = await loadImageElement(sourceUrl);
  const plan = resolveImageProcessingPlan(
    file,
    {
      width: image.naturalWidth,
      height: image.naturalHeight,
    },
    options,
  );
  const canvas = document.createElement("canvas");

  canvas.width = plan.width;
  canvas.height = plan.height;

  if (canvas.width !== plan.width || canvas.height !== plan.height) {
    throw new Error(
      "입력한 크기가 현재 브라우저에서 처리 가능한 범위를 넘습니다. 더 작은 값으로 다시 시도해 주세요.",
    );
  }

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error(canvasErrorMessage);
  }

  if (plan.fillBackground) {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const blob = await canvasToBlob(canvas, plan.mimeType, plan.encodeQuality);
  const actualMimeType = resolveActualMimeType(
    plan.fileName,
    blob,
    options,
    plan.mimeType,
  );

  return {
    ...plan,
    blob,
    mimeType: actualMimeType,
  };
}

export function createImageProcessingWorkerClient() {
  if (typeof Worker === "undefined") {
    throw new UnsupportedWorkerError(
      "현재 브라우저에서는 백그라운드 작업자를 사용할 수 없습니다.",
    );
  }

  const worker = new Worker(new URL("./image-processing.worker.ts", import.meta.url), {
    type: "module",
  });
  const pending = new Map<
    string,
    {
      reject: (reason?: unknown) => void;
      resolve: (value: ProcessedImagePayload) => void;
    }
  >();

  function rejectAll(reason: unknown) {
    for (const entry of pending.values()) {
      entry.reject(reason);
    }

    pending.clear();
  }

  worker.addEventListener("message", (event: MessageEvent<ImageWorkerResponse>) => {
    const message = event.data;
    const entry = pending.get(message.id);

    if (!entry) {
      return;
    }

    pending.delete(message.id);

    if (message.ok) {
      entry.resolve(message.result);
      return;
    }

    if (message.error.code === "UNSUPPORTED_ENV") {
      entry.reject(new UnsupportedWorkerError(message.error.message));
      return;
    }

    entry.reject(new Error(message.error.message));
  });

  worker.addEventListener("error", () => {
    rejectAll(
      new UnsupportedWorkerError(
        "브라우저 백그라운드 작업자를 시작하지 못해 메인 스레드 처리로 전환합니다.",
      ),
    );
  });

  return {
    process(file: File, options: ImageProcessOptions) {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const message: ImageWorkerRequest = {
        id,
        file,
        options,
      };

      return new Promise<ProcessedImagePayload>((resolve, reject) => {
        pending.set(id, { resolve, reject });
        worker.postMessage(message);
      });
    },
    terminate() {
      rejectAll(
        new Error("이미지 처리가 중단되었습니다. 다시 시도해 주세요."),
      );
      worker.terminate();
    },
  };
}
