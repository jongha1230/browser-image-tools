import {
  formatBytes,
  prefixFileLimitMessage,
  PROCESSING_LIMITS,
  validateImageFileLimit,
} from "./processing-limits";

export type UploadFileLike = {
  name: string;
  size: number;
  type: string;
  lastModified: number;
};

export type UploadMode = "append" | "replace";
export type UploadValidationIssueCode =
  | "duplicate"
  | "unsupported-type"
  | "file-too-large"
  | "too-many-files"
  | "batch-too-large";
export type UploadQueueStatus = "queued" | "processing" | "success" | "error";

export type UploadValidationIssue = {
  code: UploadValidationIssueCode;
  fileName: string;
  message: string;
};

const supportedExtensions = [".jpg", ".jpeg", ".png", ".webp"] as const;

export const supportedImageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type SupportedImageMimeType = (typeof supportedImageMimeTypes)[number];

export const supportedImageTypesText = "JPEG, PNG, WebP";
export const supportedImageAccept = [
  ...supportedImageMimeTypes,
  ...supportedExtensions,
].join(",");

function normalizeFileName(name: string) {
  return name.trim().toLowerCase();
}

export function getFileExtension(name: string) {
  const normalizedName = normalizeFileName(name);
  const extensionIndex = normalizedName.lastIndexOf(".");

  return extensionIndex >= 0 ? normalizedName.slice(extensionIndex) : "";
}

export function createUploadFileId(file: UploadFileLike) {
  return [
    normalizeFileName(file.name),
    file.size,
    file.lastModified,
    file.type.toLowerCase() || "unknown",
  ].join(":");
}

export function isSupportedImageFile(file: UploadFileLike) {
  return getSupportedImageMimeType(file) !== null;
}

export function getSupportedImageMimeType(
  file: UploadFileLike,
): SupportedImageMimeType | null {
  const normalizedType = file.type.toLowerCase();

  if (
    supportedImageMimeTypes.includes(normalizedType as SupportedImageMimeType)
  ) {
    return normalizedType as SupportedImageMimeType;
  }

  const extension = getFileExtension(file.name);

  if (extension === ".jpg" || extension === ".jpeg") {
    return "image/jpeg";
  }

  if (extension === ".png") {
    return "image/png";
  }

  if (extension === ".webp") {
    return "image/webp";
  }

  return null;
}

export function getSupportedImageLabel(file: UploadFileLike) {
  const normalizedType = file.type.toLowerCase();
  const extension = getFileExtension(file.name);

  if (
    normalizedType === "image/jpeg" ||
    extension === ".jpg" ||
    extension === ".jpeg"
  ) {
    return "JPEG";
  }

  if (normalizedType === "image/png" || extension === ".png") {
    return "PNG";
  }

  if (normalizedType === "image/webp" || extension === ".webp") {
    return "WebP";
  }

  return "이미지";
}

export function validateImageFiles<TFile extends UploadFileLike>(
  files: readonly TFile[],
  existingFiles: readonly UploadFileLike[] = [],
) {
  const accepted: TFile[] = [];
  const rejected: UploadValidationIssue[] = [];
  const seenIds = new Set(existingFiles.map((file) => createUploadFileId(file)));
  let nextFileCount = existingFiles.length;
  let nextTotalBytes = existingFiles.reduce((sum, file) => sum + file.size, 0);

  for (const file of files) {
    const fileName = file.name || "이름 없는 파일";
    const fileId = createUploadFileId(file);

    if (!isSupportedImageFile(file)) {
      rejected.push({
        code: "unsupported-type",
        fileName,
        message: `${fileName}: ${supportedImageTypesText} 파일만 추가할 수 있습니다.`,
      });
      continue;
    }

    const fileSizeValidation = validateImageFileLimit(file);

    if (!fileSizeValidation.ok) {
      rejected.push({
        code: "file-too-large",
        fileName,
        message: prefixFileLimitMessage(fileName, fileSizeValidation.message),
      });
      continue;
    }

    if (seenIds.has(fileId)) {
      rejected.push({
        code: "duplicate",
        fileName,
        message: `${fileName}: 이미 업로드 목록에 있는 파일입니다.`,
      });
      continue;
    }

    if (nextFileCount + 1 > PROCESSING_LIMITS.maxBatchFiles) {
      rejected.push({
        code: "too-many-files",
        fileName,
        message: prefixFileLimitMessage(
          fileName,
          `한 번에 처리할 수 있는 이미지는 최대 ${PROCESSING_LIMITS.maxBatchFiles.toLocaleString("ko-KR")}개입니다.`,
        ),
      });
      continue;
    }

    if (nextTotalBytes + file.size > PROCESSING_LIMITS.maxBatchTotalBytes) {
      rejected.push({
        code: "batch-too-large",
        fileName,
        message: prefixFileLimitMessage(
          fileName,
          `선택한 이미지의 전체 용량이 너무 큽니다. 총 ${formatBytes(PROCESSING_LIMITS.maxBatchTotalBytes)} 이하로 줄여 주세요.`,
        ),
      });
      continue;
    }

    seenIds.add(fileId);
    accepted.push(file);
    nextFileCount += 1;
    nextTotalBytes += file.size;
  }

  return { accepted, rejected };
}

export function shouldReplaceUploadQueue({
  existingItemCount,
  existingStatus,
  isProcessing,
  readyForReplacement,
}: {
  existingItemCount: number;
  existingStatus: UploadQueueStatus | null;
  isProcessing: boolean;
  readyForReplacement: boolean;
}) {
  if (isProcessing || existingItemCount !== 1 || !existingStatus) {
    return false;
  }

  if (existingStatus === "error") {
    return true;
  }

  return existingStatus === "success" && readyForReplacement;
}

export function formatFileSize(bytes: number) {
  return formatBytes(bytes);
}
