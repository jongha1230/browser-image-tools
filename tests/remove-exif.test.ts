import { describe, expect, it } from "vitest";

import { createExifRemovedFileName } from "../lib/remove-exif";

describe("remove exif helpers", () => {
  it("builds EXIF-stripped filenames with the original extension", () => {
    expect(createExifRemovedFileName("travel-photo.JPG", "image/jpeg")).toBe(
      "travel-photo-no-exif.jpg",
    );
    expect(createExifRemovedFileName("share-ready", "image/webp")).toBe(
      "share-ready-no-exif.webp",
    );
  });
});
