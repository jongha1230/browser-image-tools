import { describe, expect, it } from "vitest";

import { resolveImageProcessingPlan } from "../lib/image-processing";

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
});
