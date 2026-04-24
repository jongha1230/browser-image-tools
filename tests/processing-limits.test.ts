import { describe, expect, it } from "vitest";

import {
  formatBytes,
  getBatchFileCountLimitMessage,
  getBatchTotalSizeLimitMessage,
  getCanvasDimensionLimitMessage,
  getFileSizeLimitMessage,
  PROCESSING_LIMITS,
  validateBatchLimits,
  validateCanvasDimensions,
  validateImageFileLimit,
} from "../lib/processing-limits";

describe("processing limits", () => {
  it("formats bytes for user-facing limit messages", () => {
    expect(formatBytes(987)).toBe("987 B");
    expect(formatBytes(1_024)).toBe("1 KB");
    expect(formatBytes(1_572_864)).toBe("1.5 MB");
  });

  it("validates single-file, batch, and canvas limits with Korean messages", () => {
    expect(
      validateImageFileLimit({
        size: PROCESSING_LIMITS.maxFileSizeBytes + 1,
      }),
    ).toEqual({
      ok: false,
      message: getFileSizeLimitMessage(),
    });

    expect(
      validateBatchLimits(
        Array.from({ length: PROCESSING_LIMITS.maxBatchFiles + 1 }, (_, index) => ({
          name: `image-${index}.png`,
          size: 1024,
        })),
      ),
    ).toEqual({
      ok: false,
      message: getBatchFileCountLimitMessage(),
    });

    expect(
      validateBatchLimits([
        {
          name: "first.png",
          size: PROCESSING_LIMITS.maxBatchTotalBytes,
        },
        {
          name: "second.png",
          size: 1,
        },
      ]),
    ).toEqual({
      ok: false,
      message: getBatchTotalSizeLimitMessage(),
    });

    expect(
      validateCanvasDimensions({
        width: PROCESSING_LIMITS.maxCanvasDimension + 1,
        height: PROCESSING_LIMITS.maxCanvasDimension,
      }),
    ).toEqual({
      ok: false,
      message: getCanvasDimensionLimitMessage(),
    });
  });

  it("accepts files that stay inside all configured limits", () => {
    expect(
      validateImageFileLimit({
        size: PROCESSING_LIMITS.maxFileSizeBytes,
      }),
    ).toEqual({ ok: true });

    expect(
      validateBatchLimits([
        {
          name: "first.png",
          size: PROCESSING_LIMITS.maxFileSizeBytes,
        },
        {
          name: "second.png",
          size: PROCESSING_LIMITS.maxFileSizeBytes,
        },
      ]),
    ).toEqual({ ok: true });

    expect(
      validateCanvasDimensions({
        width: PROCESSING_LIMITS.maxCanvasDimension,
        height: PROCESSING_LIMITS.maxCanvasDimension,
      }),
    ).toEqual({ ok: true });
  });
});
