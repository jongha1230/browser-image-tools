import { describe, expect, it } from "vitest";

import { PROCESSING_LIMITS } from "../lib/processing-limits";
import {
  calculateStoredZipArchiveLayout,
  createStoredZipArchive,
  ZipArchiveLimitError,
} from "../lib/zip-archive";

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

  it("rejects classic ZIP entry counts above 65,535", () => {
    expect(() =>
      calculateStoredZipArchiveLayout(
        Array.from({ length: PROCESSING_LIMITS.maxZipEntries + 1 }, () => ({
          fileNameLength: 8,
          dataLength: 1,
        })),
      ),
    ).toThrowError(ZipArchiveLimitError);
    expect(() =>
      calculateStoredZipArchiveLayout(
        Array.from({ length: PROCESSING_LIMITS.maxZipEntries + 1 }, () => ({
          fileNameLength: 8,
          dataLength: 1,
        })),
      ),
    ).toThrow(/최대 65,535개 파일/);
  });

  it("rejects classic ZIP entry sizes above 4GiB without allocating giant buffers", () => {
    expect(() =>
      calculateStoredZipArchiveLayout([
        {
          fileNameLength: 8,
          dataLength: PROCESSING_LIMITS.maxZipEntrySizeBytes + 1,
        },
      ]),
    ).toThrow(/4GB보다 큰 개별 파일/);
  });

  it("rejects archives whose total size would exceed the browser-safe ZIP limit", () => {
    expect(() =>
      calculateStoredZipArchiveLayout([
        {
          fileNameLength: 8,
          dataLength: PROCESSING_LIMITS.maxZipArchiveSizeBytes - 40,
        },
        {
          fileNameLength: 8,
          dataLength: 40,
        },
      ]),
    ).toThrow(/ZIP 파일이 너무 커질 수 있어 다운로드를 중단했습니다/);
  });

  it("rejects archives whose offsets would exceed classic ZIP limits", () => {
    expect(() =>
      calculateStoredZipArchiveLayout([
        {
          fileNameLength: 8,
          dataLength: 0xffffffff - 37,
        },
        {
          fileNameLength: 8,
          dataLength: 1,
        },
      ]),
    ).toThrow(/classic ZIP 한계를 넘어/);
  });
});
