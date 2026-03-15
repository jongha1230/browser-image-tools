import { describe, expect, it } from "vitest";

import {
  calculateHeightFromWidth,
  calculateWidthFromHeight,
  createResizedFileName,
  fitWithinResizePreset,
  maxResizeDimension,
  validateResizeDimensions,
} from "../lib/resize-image";

describe("resize image helpers", () => {
  it("builds resized filenames with the original output extension", () => {
    expect(createResizedFileName("Banner.PNG", "image/png")).toBe(
      "Banner-resized.png",
    );
    expect(createResizedFileName("photo", "image/webp")).toBe(
      "photo-resized.webp",
    );
  });

  it("calculates aspect-ratio locked dimensions from width or height", () => {
    const original = { width: 1600, height: 900 };

    expect(calculateHeightFromWidth(400, original)).toBe(225);
    expect(calculateWidthFromHeight(300, original)).toBe(533);
  });

  it("fits preset boxes without breaking the original aspect ratio", () => {
    expect(
      fitWithinResizePreset(
        { width: 1600, height: 900 },
        { width: 1200, height: 1200 },
      ),
    ).toEqual({
      width: 1200,
      height: 675,
    });
  });

  it("validates missing, invalid, and acceptable resize dimensions", () => {
    expect(validateResizeDimensions("", "500")).toEqual({
      ok: false,
      message: "가로와 세로 값을 모두 입력해 주세요.",
    });
    expect(validateResizeDimensions("12.5", "500")).toEqual({
      ok: false,
      message: "가로와 세로 값은 숫자만 입력할 수 있습니다.",
    });
    expect(
      validateResizeDimensions(`${maxResizeDimension + 1}`, "500"),
    ).toEqual({
      ok: false,
      message: `가로와 세로 값은 1 이상 ${maxResizeDimension.toLocaleString("ko-KR")} 이하의 정수여야 합니다.`,
    });
    expect(validateResizeDimensions("640", "480")).toEqual({
      ok: true,
      width: 640,
      height: 480,
    });
  });
});
