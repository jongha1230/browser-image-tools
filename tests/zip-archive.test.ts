import { describe, expect, it } from "vitest";

import { createStoredZipArchive } from "../lib/zip-archive";

describe("stored zip archive", () => {
  it("writes local headers, central directory records, and an end record", () => {
    const archive = createStoredZipArchive([
      {
        fileName: "first.txt",
        data: new TextEncoder().encode("alpha"),
      },
      {
        fileName: "second.txt",
        data: new TextEncoder().encode("beta"),
      },
    ]);
    const decoder = new TextDecoder();
    const view = new DataView(archive.buffer, archive.byteOffset, archive.byteLength);

    expect(view.getUint32(0, true)).toBe(0x04034b50);
    expect(decoder.decode(archive)).toContain("first.txt");
    expect(decoder.decode(archive)).toContain("second.txt");
    expect(view.getUint32(archive.length - 22, true)).toBe(0x06054b50);
    expect(view.getUint16(archive.length - 14, true)).toBe(2);
  });
});
