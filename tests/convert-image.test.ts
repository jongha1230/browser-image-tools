import { describe, expect, it } from "vitest";

import {
  createConvertedFileName,
  getConversionOutputDescription,
  getDefaultConversionMimeType,
} from "../lib/convert-image";

describe("convert image helpers", () => {
  it("builds converted filenames with the selected extension", () => {
    expect(createConvertedFileName("Banner.PNG", "image/jpeg")).toBe(
      "Banner-converted.jpg",
    );
    expect(createConvertedFileName("photo", "image/webp")).toBe(
      "photo-converted.webp",
    );
  });

  it("picks a sensible default target format for each source format", () => {
    expect(getDefaultConversionMimeType("image/jpeg")).toBe("image/webp");
    expect(getDefaultConversionMimeType("image/png")).toBe("image/webp");
    expect(getDefaultConversionMimeType("image/webp")).toBe("image/jpeg");
  });

  it("returns user-facing format guidance for the selected output", () => {
    expect(getConversionOutputDescription("image/png")).toContain("투명 배경");
    expect(getConversionOutputDescription("image/webp")).toContain("웹 배포용");
  });
});
