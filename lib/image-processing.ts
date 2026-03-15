import {
  createCompressedFileName,
  isQualityAdjustableFormat,
  resolveCompressionMimeType,
  type CompressionOutputFormat,
} from "./compress-image";
import { createConvertedFileName } from "./convert-image";
import {
  getSupportedImageMimeType,
  type SupportedImageMimeType,
  type UploadFileLike,
} from "./image-upload";
import { createExifRemovedFileName } from "./remove-exif";
import {
  createResizedFileName,
  fitWithinResizePreset,
  type ResizeDimensions,
} from "./resize-image";

export type ImageProcessVariant =
  | "compress"
  | "resize"
  | "convert"
  | "removeExif";

export type CompressProcessOptions = {
  variant: "compress";
  outputFormat: CompressionOutputFormat;
  quality: number;
};

export type ResizeProcessOptions = {
  variant: "resize";
  width: number;
  height: number;
  keepAspectRatio: boolean;
};

export type ConvertProcessOptions = {
  variant: "convert";
  targetMimeType: SupportedImageMimeType;
  quality: number;
};

export type RemoveExifProcessOptions = {
  variant: "removeExif";
};

export type ImageProcessOptions =
  | CompressProcessOptions
  | ResizeProcessOptions
  | ConvertProcessOptions
  | RemoveExifProcessOptions;

export type ImageProcessingPlan = {
  fileName: string;
  mimeType: SupportedImageMimeType;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  fillBackground: boolean;
  encodeQuality?: number;
  outputFormat?: CompressionOutputFormat;
  quality?: number;
};

export type ProcessedImagePayload = ImageProcessingPlan & {
  blob: Blob;
};

export type ImageWorkerRequest = {
  id: string;
  file: File;
  options: ImageProcessOptions;
};

export type ImageWorkerResponse =
  | {
      id: string;
      ok: true;
      result: ProcessedImagePayload;
    }
  | {
      id: string;
      ok: false;
      error: {
        code: "PROCESSING_ERROR" | "UNSUPPORTED_ENV";
        message: string;
      };
    };

export function getUnsupportedSourceMessage(variant: ImageProcessVariant) {
  if (variant === "compress") {
    return "이 파일 형식은 현재 압축 출력 대상으로 사용할 수 없습니다.";
  }

  if (variant === "resize") {
    return "이 파일 형식은 현재 크기 조절 출력 대상으로 사용할 수 없습니다.";
  }

  if (variant === "convert") {
    return "이 파일 형식은 현재 포맷 변환 대상으로 사용할 수 없습니다.";
  }

  return "이 파일 형식은 현재 EXIF 제거 출력 대상으로 사용할 수 없습니다.";
}

export function getMimeMismatchMessage(
  options: ImageProcessOptions,
  expectedMimeType: SupportedImageMimeType,
) {
  if (options.variant === "compress") {
    return expectedMimeType === "image/webp"
      ? "현재 브라우저에서는 WebP 내보내기를 지원하지 않습니다. JPEG 또는 원본 형식으로 다시 시도해 주세요."
      : "선택한 출력 형식으로 파일을 저장하지 못했습니다. 다른 형식으로 다시 시도해 주세요.";
  }

  if (options.variant === "resize") {
    return expectedMimeType === "image/webp"
      ? "현재 브라우저에서는 WebP 리사이즈 내보내기를 지원하지 않습니다. 다른 형식으로 다시 저장해 주세요."
      : "선택한 형식으로 리사이즈 결과를 저장하지 못했습니다. 다른 이미지로 다시 시도해 주세요.";
  }

  if (options.variant === "convert") {
    if (expectedMimeType === "image/webp") {
      return "현재 브라우저에서는 WebP 변환 내보내기를 지원하지 않습니다. JPEG 또는 PNG로 다시 시도해 주세요.";
    }

    if (expectedMimeType === "image/jpeg") {
      return "선택한 이미지를 JPEG로 저장하지 못했습니다. PNG 또는 WebP로 다시 시도해 주세요.";
    }

    return "선택한 이미지를 PNG로 저장하지 못했습니다. JPEG 또는 WebP로 다시 시도해 주세요.";
  }

  return expectedMimeType === "image/webp"
    ? "현재 브라우저에서는 WebP 형식으로 메타데이터 제거 결과를 다시 저장하지 못했습니다. 다른 브라우저에서 다시 시도해 주세요."
    : "선택한 형식으로 메타데이터 제거 결과를 저장하지 못했습니다. 다른 이미지로 다시 시도해 주세요.";
}

export function createBatchZipFileName(variant: ImageProcessVariant) {
  if (variant === "compress") {
    return "compressed-images.zip";
  }

  if (variant === "resize") {
    return "resized-images.zip";
  }

  if (variant === "convert") {
    return "converted-images.zip";
  }

  return "exif-cleaned-images.zip";
}

export function createProcessingSignature(options: ImageProcessOptions | null) {
  if (!options) {
    return "default";
  }

  return JSON.stringify(options);
}

export function resolveImageProcessingPlan(
  file: UploadFileLike,
  originalDimensions: ResizeDimensions,
  options: ImageProcessOptions,
): ImageProcessingPlan {
  const sourceMimeType = getSupportedImageMimeType(file);

  if (!sourceMimeType) {
    throw new Error(getUnsupportedSourceMessage(options.variant));
  }

  if (options.variant === "compress") {
    const targetMimeType = resolveCompressionMimeType(file, options.outputFormat);

    if (!targetMimeType) {
      throw new Error(getUnsupportedSourceMessage(options.variant));
    }

    return {
      fileName: createCompressedFileName(file.name, targetMimeType),
      mimeType: targetMimeType,
      width: originalDimensions.width,
      height: originalDimensions.height,
      originalWidth: originalDimensions.width,
      originalHeight: originalDimensions.height,
      fillBackground: targetMimeType === "image/jpeg",
      encodeQuality: isQualityAdjustableFormat(targetMimeType)
        ? options.quality / 100
        : undefined,
      outputFormat: options.outputFormat,
      quality: options.quality,
    };
  }

  if (options.variant === "resize") {
    const targetDimensions = options.keepAspectRatio
      ? fitWithinResizePreset(originalDimensions, {
          width: options.width,
          height: options.height,
        })
      : {
          width: options.width,
          height: options.height,
        };

    return {
      fileName: createResizedFileName(file.name, sourceMimeType),
      mimeType: sourceMimeType,
      width: targetDimensions.width,
      height: targetDimensions.height,
      originalWidth: originalDimensions.width,
      originalHeight: originalDimensions.height,
      fillBackground: sourceMimeType === "image/jpeg",
    };
  }

  if (options.variant === "convert") {
    if (sourceMimeType === options.targetMimeType) {
      throw new Error("원본과 같은 형식의 파일은 변환 대상에서 자동 제외됩니다.");
    }

    return {
      fileName: createConvertedFileName(file.name, options.targetMimeType),
      mimeType: options.targetMimeType,
      width: originalDimensions.width,
      height: originalDimensions.height,
      originalWidth: originalDimensions.width,
      originalHeight: originalDimensions.height,
      fillBackground: options.targetMimeType === "image/jpeg",
      encodeQuality: isQualityAdjustableFormat(options.targetMimeType)
        ? options.quality / 100
        : undefined,
      quality: options.quality,
    };
  }

  return {
    fileName: createExifRemovedFileName(file.name, sourceMimeType),
    mimeType: sourceMimeType,
    width: originalDimensions.width,
    height: originalDimensions.height,
    originalWidth: originalDimensions.width,
    originalHeight: originalDimensions.height,
    fillBackground: sourceMimeType === "image/jpeg",
    encodeQuality: isQualityAdjustableFormat(sourceMimeType) ? 0.92 : undefined,
  };
}
