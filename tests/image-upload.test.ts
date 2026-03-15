import { describe, expect, it } from "vitest";

import {
  createUploadFileId,
  formatFileSize,
  isSupportedImageFile,
  validateImageFiles,
} from "../lib/image-upload";

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
});
