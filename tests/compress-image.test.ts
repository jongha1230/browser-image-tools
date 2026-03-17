import { describe, expect, it } from "vitest";

import {
  compressionWorkflowPresetOptions,
  createCompressedFileName,
  getCompressionDeltaPercent,
  getCompressionMimeTypeLabel,
  isQualityAdjustableFormat,
  resolveCompressionMimeType,
} from "../lib/compress-image";

describe("compress image helpers", () => {
  it("keeps original MIME type when the output format is original", () => {
    expect(
      resolveCompressionMimeType(
        {
          name: "photo.png",
          size: 400_000,
          type: "",
          lastModified: 1,
        },
        "original",
      ),
    ).toBe("image/png");
  });

  it("switches to the requested lossy output format", () => {
    expect(
      resolveCompressionMimeType(
        {
          name: "hero.png",
          size: 512_000,
          type: "image/png",
          lastModified: 2,
        },
        "image/webp",
      ),
    ).toBe("image/webp");
  });

  it("builds compressed filenames with the correct extension", () => {
    expect(createCompressedFileName("Banner.JPG", "image/jpeg")).toBe(
      "Banner-compressed.jpg",
    );
    expect(createCompressedFileName("product", "image/webp")).toBe(
      "product-compressed.webp",
    );
  });

  it("marks which formats can use the quality slider", () => {
    expect(isQualityAdjustableFormat("image/jpeg")).toBe(true);
    expect(isQualityAdjustableFormat("image/webp")).toBe(true);
    expect(isQualityAdjustableFormat("image/png")).toBe(false);
  });

  it("reports delta percentages and readable labels", () => {
    expect(getCompressionDeltaPercent(1_000, 640)).toBe(36);
    expect(getCompressionMimeTypeLabel("image/webp")).toBe("WebP");
  });

  it("exposes upload workflow presets with practical starting settings", () => {
    expect(compressionWorkflowPresetOptions.map((preset) => preset.id)).toEqual([
      "blog-upload",
      "thumbnail-preview",
      "product-image-upload",
      "quick-share",
    ]);
    expect(compressionWorkflowPresetOptions[0]).toMatchObject({
      outputFormat: "image/webp",
      quality: 80,
    });
    expect(compressionWorkflowPresetOptions[2]).toMatchObject({
      outputFormat: "image/jpeg",
      quality: 88,
    });
  });
});
