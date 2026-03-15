import { getCompressionOutputExtension } from "./compress-image";
import type { SupportedImageMimeType } from "./image-upload";

function stripFileExtension(fileName: string) {
  const trimmedName = fileName.trim();
  const extensionIndex = trimmedName.lastIndexOf(".");

  if (extensionIndex <= 0) {
    return trimmedName || "image";
  }

  return trimmedName.slice(0, extensionIndex);
}

export function createExifRemovedFileName(
  fileName: string,
  mimeType: SupportedImageMimeType,
) {
  return `${stripFileExtension(fileName)}-no-exif${getCompressionOutputExtension(mimeType)}`;
}
