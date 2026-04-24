import { describe, expect, it } from "vitest";

import {
  createUploadFileId,
  formatFileSize,
  getSupportedImageMimeType,
  isSupportedImageFile,
  shouldReplaceUploadQueue,
  validateImageFiles,
} from "../lib/image-upload";
import { PROCESSING_LIMITS } from "../lib/processing-limits";

describe("image upload helpers", () => {
  it("accepts supported browser image formats", () => {
    expect(
      isSupportedImageFile({
        name: "sample.jpg",
        size: 128_000,
        type: "image/jpeg",
        lastModified: 1,
      }),
    ).toBe(true);
    expect(
      isSupportedImageFile({
        name: "sample.png",
        size: 256_000,
        type: "image/png",
        lastModified: 2,
      }),
    ).toBe(true);
    expect(
      isSupportedImageFile({
        name: "sample.webp",
        size: 64_000,
        type: "image/webp",
        lastModified: 3,
      }),
    ).toBe(true);
  });

  it("falls back to the file extension when the MIME type is missing", () => {
    expect(
      isSupportedImageFile({
        name: "clipboard-image.webp",
        size: 640,
        type: "",
        lastModified: 4,
      }),
    ).toBe(true);
    expect(
      getSupportedImageMimeType({
        name: "clipboard-image.webp",
        size: 640,
        type: "",
        lastModified: 4,
      }),
    ).toBe("image/webp");
  });

  it("rejects unsupported formats and duplicates with clear buckets", () => {
    const existingFile = {
      name: "hero.jpg",
      size: 1024,
      type: "image/jpeg",
      lastModified: 100,
    };
    const duplicateFile = {
      ...existingFile,
    };
    const invalidFile = {
      name: "document.gif",
      size: 2048,
      type: "image/gif",
      lastModified: 101,
    };

    const result = validateImageFiles([duplicateFile, invalidFile], [existingFile]);

    expect(result.accepted).toEqual([]);
    expect(result.rejected.map((issue) => issue.code)).toEqual([
      "duplicate",
      "unsupported-type",
    ]);
    expect(result.rejected.map((issue) => issue.fileName)).toEqual([
      "hero.jpg",
      "document.gif",
    ]);
  });

  it("rejects files that exceed the single-file upload limit", () => {
    const result = validateImageFiles([
      {
        name: "huge-photo.jpg",
        size: PROCESSING_LIMITS.maxFileSizeBytes + 1,
        type: "image/jpeg",
        lastModified: 7,
      },
    ]);

    expect(result.accepted).toEqual([]);
    expect(result.rejected).toMatchObject([
      {
        code: "file-too-large",
        fileName: "huge-photo.jpg",
      },
    ]);
    expect(result.rejected[0]?.message).toContain("20 MB");
  });

  it("accepts files up to the batch count limit and rejects overflow files", () => {
    const files = Array.from(
      { length: PROCESSING_LIMITS.maxBatchFiles + 1 },
      (_, index) => ({
        name: `photo-${index}.jpg`,
        size: 1024,
        type: "image/jpeg",
        lastModified: index,
      }),
    );

    const result = validateImageFiles(files);

    expect(result.accepted).toHaveLength(PROCESSING_LIMITS.maxBatchFiles);
    expect(result.rejected).toHaveLength(1);
    expect(result.rejected[0]).toMatchObject({
      code: "too-many-files",
      fileName: `photo-${PROCESSING_LIMITS.maxBatchFiles}.jpg`,
    });
  });

  it("rejects files that would push the batch total size over the limit", () => {
    const existingFiles = Array.from({ length: 5 }, (_, index) => ({
      name: `existing-${index}.jpg`,
      size: PROCESSING_LIMITS.maxFileSizeBytes,
      type: "image/jpeg",
      lastModified: index,
    }));
    const result = validateImageFiles(
      [
        {
          name: "second.jpg",
          size: 1,
          type: "image/jpeg",
          lastModified: 9,
        },
      ],
      existingFiles,
    );

    expect(result.accepted).toHaveLength(0);
    expect(result.rejected).toMatchObject([
      {
        code: "batch-too-large",
        fileName: "second.jpg",
      },
    ]);
    expect(result.rejected[0]?.message).toContain("100 MB");
  });

  it("creates stable file identifiers for reusable shared state", () => {
    const file = {
      name: "Banner.JPG",
      size: 3000,
      type: "image/jpeg",
      lastModified: 55,
    };

    expect(createUploadFileId(file)).toBe("banner.jpg:3000:55:image/jpeg");
  });

  it("formats file sizes for the preview UI", () => {
    expect(formatFileSize(987)).toBe("987 B");
    expect(formatFileSize(1_024)).toBe("1 KB");
    expect(formatFileSize(1_572_864)).toBe("1.5 MB");
  });

  it("enables automatic replacement only for repeat-ready single sessions", () => {
    expect(
      shouldReplaceUploadQueue({
        existingItemCount: 1,
        existingStatus: "success",
        isProcessing: false,
        readyForReplacement: true,
      }),
    ).toBe(true);

    expect(
      shouldReplaceUploadQueue({
        existingItemCount: 1,
        existingStatus: "success",
        isProcessing: false,
        readyForReplacement: false,
      }),
    ).toBe(false);

    expect(
      shouldReplaceUploadQueue({
        existingItemCount: 1,
        existingStatus: "error",
        isProcessing: false,
        readyForReplacement: false,
      }),
    ).toBe(true);

    expect(
      shouldReplaceUploadQueue({
        existingItemCount: 2,
        existingStatus: "success",
        isProcessing: false,
        readyForReplacement: true,
      }),
    ).toBe(false);
  });
});
