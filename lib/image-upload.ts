export type UploadFileLike = {
  name: string;
  size: number;
  type: string;
  lastModified: number;
};

export type UploadValidationIssueCode = "duplicate" | "unsupported-type";

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

    if (seenIds.has(fileId)) {
      rejected.push({
        code: "duplicate",
        fileName,
        message: `${fileName}: 이미 업로드 목록에 있는 파일입니다.`,
      });
      continue;
    }

    seenIds.add(fileId);
    accepted.push(file);
  }

  return { accepted, rejected };
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ["KB", "MB", "GB"] as const;
  let value = bytes;
  let unitIndex = -1;

  do {
    value /= 1024;
    unitIndex += 1;
  } while (value >= 1024 && unitIndex < units.length - 1);

  const maximumFractionDigits = value >= 100 ? 0 : value >= 10 ? 1 : 2;

  return `${new Intl.NumberFormat("ko-KR", {
    maximumFractionDigits,
  }).format(value)} ${units[unitIndex]}`;
}
