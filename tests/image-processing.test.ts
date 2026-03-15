import { describe, expect, it } from "vitest";

import {
  createBatchZipFileName,
  createProcessingSignature,
  getMimeMismatchMessage,
  getUnsupportedSourceMessage,
  resolveImageProcessingPlan,
} from "../lib/image-processing";

describe("image processing plans", () => {
  const original = {
    width: 2400,
    height: 1200,
  };

  it("keeps the original MIME type when compress output format is original", () => {
    const plan = resolveImageProcessingPlan(
      {
        name: "banner.png",
        size: 600_000,
        type: "image/png",
        lastModified: 1,
      },
      original,
      {
        variant: "compress",
        outputFormat: "original",
        quality: 80,
      },
    );

    expect(plan.mimeType).toBe("image/png");
    expect(plan.fileName).toBe("banner-compressed.png");
    expect(plan.encodeQuality).toBeUndefined();
  });

  it("fits each resize target inside the requested box when aspect ratio is locked", () => {
    const plan = resolveImageProcessingPlan(
      {
        name: "hero.jpg",
        size: 800_000,
        type: "image/jpeg",
        lastModified: 2,
      },
      original,
      {
        variant: "resize",
        width: 1000,
        height: 1000,
        keepAspectRatio: true,
      },
    );

    expect(plan.width).toBe(1000);
    expect(plan.height).toBe(500);
    expect(plan.fileName).toBe("hero-resized.jpg");
  });

  it("keeps the requested resize dimensions when aspect ratio is unlocked", () => {
    const plan = resolveImageProcessingPlan(
      {
        name: "hero.jpg",
        size: 800_000,
        type: "image/jpeg",
        lastModified: 2,
      },
      original,
      {
        variant: "resize",
        width: 1000,
        height: 1000,
        keepAspectRatio: false,
      },
    );

    expect(plan.width).toBe(1000);
    expect(plan.height).toBe(1000);
    expect(plan.fillBackground).toBe(true);
  });

  it("rejects format conversions when the source is already in the target format", () => {
    expect(() =>
      resolveImageProcessingPlan(
        {
          name: "already.webp",
          size: 120_000,
          type: "image/webp",
          lastModified: 3,
        },
        original,
        {
          variant: "convert",
          targetMimeType: "image/webp",
          quality: 75,
        },
      ),
    ).toThrow("원본과 같은 형식의 파일은 변환 대상에서 자동 제외됩니다.");
  });

  it("prepares EXIF removal as a same-format re-encode", () => {
    const plan = resolveImageProcessingPlan(
      {
        name: "travel-photo.JPG",
        size: 540_000,
        type: "image/jpeg",
        lastModified: 4,
      },
      original,
      {
        variant: "removeExif",
      },
    );

    expect(plan.fileName).toBe("travel-photo-no-exif.jpg");
    expect(plan.mimeType).toBe("image/jpeg");
    expect(plan.encodeQuality).toBe(0.92);
  });

  it("uses the requested background and quality rules for format conversions", () => {
    const plan = resolveImageProcessingPlan(
      {
        name: "logo.png",
        size: 240_000,
        type: "image/png",
        lastModified: 5,
      },
      original,
      {
        variant: "convert",
        targetMimeType: "image/jpeg",
        quality: 74,
      },
    );

    expect(plan.fileName).toBe("logo-converted.jpg");
    expect(plan.fillBackground).toBe(true);
    expect(plan.encodeQuality).toBe(0.74);
  });

  it("returns stable signatures and ZIP names for each processing variant", () => {
    expect(createProcessingSignature(null)).toBe("default");
    expect(
      createProcessingSignature({
        variant: "compress",
        outputFormat: "image/webp",
        quality: 80,
      }),
    ).toBe('{"variant":"compress","outputFormat":"image/webp","quality":80}');
    expect(createBatchZipFileName("compress")).toBe("compressed-images.zip");
    expect(createBatchZipFileName("resize")).toBe("resized-images.zip");
    expect(createBatchZipFileName("convert")).toBe("converted-images.zip");
    expect(createBatchZipFileName("removeExif")).toBe("exif-cleaned-images.zip");
  });

  it("keeps user-facing fallback messages specific to the selected tool", () => {
    expect(getUnsupportedSourceMessage("removeExif")).toContain("EXIF 제거");
    expect(
      getMimeMismatchMessage(
        {
          variant: "convert",
          targetMimeType: "image/webp",
          quality: 82,
        },
        "image/webp",
      ),
    ).toContain("WebP 변환");
  });
});
