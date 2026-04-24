import {
  getZipArchiveSizeLimitMessage,
  PROCESSING_LIMITS,
} from "./processing-limits";

export type ZipArchiveEntry = {
  data: Uint8Array;
  fileName: string;
  lastModified?: number;
};

export type StoredZipArchiveLayoutEntry = {
  dataLength: number;
  fileNameLength: number;
};

export class ZipArchiveLimitError extends Error {
  constructor(
    message: string,
    readonly code:
      | "too-many-entries"
      | "entry-too-large"
      | "central-directory-too-large"
      | "local-header-offset-too-large"
      | "archive-too-large",
  ) {
    super(message);
    this.name = "ZipArchiveLimitError";
  }
}

const crcTable = new Uint32Array(256).map((_, index) => {
  let value = index;

  for (let bit = 0; bit < 8; bit += 1) {
    value = (value & 1) === 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }

  return value >>> 0;
});

function calculateCrc32(data: Uint8Array) {
  let crc = 0xffffffff;

  for (const byte of data) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function getDosDateTime(timestamp: number) {
  const date = new Date(timestamp);
  const year = Math.max(1980, date.getFullYear());
  const dosTime =
    (date.getHours() << 11) |
    (date.getMinutes() << 5) |
    Math.floor(date.getSeconds() / 2);
  const dosDate =
    ((year - 1980) << 9) |
    ((date.getMonth() + 1) << 5) |
    date.getDate();

  return { dosDate, dosTime };
}

function writeUint16(
  view: DataView,
  offset: number,
  value: number,
) {
  view.setUint16(offset, value, true);
}

function writeUint32(
  view: DataView,
  offset: number,
  value: number,
) {
  view.setUint32(offset, value, true);
}

const ZIP_LOCAL_FILE_HEADER_SIZE = 30;
const ZIP_CENTRAL_DIRECTORY_HEADER_SIZE = 46;
const ZIP_END_RECORD_SIZE = 22;
const ZIP_CLASSIC_32BIT_MAX = 0xffffffff;

export function calculateStoredZipArchiveLayout(
  entries: readonly StoredZipArchiveLayoutEntry[],
) {
  if (entries.length > PROCESSING_LIMITS.maxZipEntries) {
    throw new ZipArchiveLimitError(
      `현재 ZIP 다운로드는 최대 ${PROCESSING_LIMITS.maxZipEntries.toLocaleString("ko-KR")}개 파일까지만 지원합니다.`,
      "too-many-entries",
    );
  }

  let fileSectionSize = 0;
  let centralDirectorySize = 0;

  for (const entry of entries) {
    if (entry.dataLength > PROCESSING_LIMITS.maxZipEntrySizeBytes) {
      throw new ZipArchiveLimitError(
        "ZIP에 담을 결과 파일이 너무 큽니다. 현재 브라우저 ZIP은 4GB보다 큰 개별 파일을 지원하지 않습니다.",
        "entry-too-large",
      );
    }

    if (fileSectionSize > ZIP_CLASSIC_32BIT_MAX) {
      throw new ZipArchiveLimitError(
        "ZIP 파일 오프셋이 classic ZIP 한계를 넘어 다운로드를 중단했습니다.",
        "local-header-offset-too-large",
      );
    }

    fileSectionSize +=
      ZIP_LOCAL_FILE_HEADER_SIZE + entry.fileNameLength + entry.dataLength;
    centralDirectorySize +=
      ZIP_CENTRAL_DIRECTORY_HEADER_SIZE + entry.fileNameLength;

    if (centralDirectorySize > ZIP_CLASSIC_32BIT_MAX) {
      throw new ZipArchiveLimitError(
        "ZIP 중앙 디렉터리 크기가 classic ZIP 한계를 넘어 다운로드를 중단했습니다.",
        "central-directory-too-large",
      );
    }
  }

  if (fileSectionSize > ZIP_CLASSIC_32BIT_MAX) {
    throw new ZipArchiveLimitError(
      "ZIP 파일 오프셋이 classic ZIP 한계를 넘어 다운로드를 중단했습니다.",
      "local-header-offset-too-large",
    );
  }

  const totalSize =
    fileSectionSize + centralDirectorySize + ZIP_END_RECORD_SIZE;

  if (totalSize > PROCESSING_LIMITS.maxZipArchiveSizeBytes) {
    throw new ZipArchiveLimitError(
      getZipArchiveSizeLimitMessage(),
      "archive-too-large",
    );
  }

  return {
    centralDirectoryOffset: fileSectionSize,
    centralDirectorySize,
    totalSize,
  };
}

export function createStoredZipArchive(entries: readonly ZipArchiveEntry[]) {
  const encoder = new TextEncoder();
  const centralDirectoryParts: Uint8Array[] = [];
  const fileParts: Uint8Array[] = [];
  const layoutEntries = entries.map((entry) => ({
    dataLength: entry.data.length,
    fileNameLength: encoder.encode(entry.fileName).length,
  }));
  const layout = calculateStoredZipArchiveLayout(layoutEntries);
  let currentOffset = 0;

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.fileName);
    const header = new Uint8Array(ZIP_LOCAL_FILE_HEADER_SIZE + nameBytes.length);
    const headerView = new DataView(
      header.buffer,
      header.byteOffset,
      header.byteLength,
    );
    const crc32 = calculateCrc32(entry.data);
    const { dosDate, dosTime } = getDosDateTime(
      entry.lastModified ?? Date.now(),
    );

    writeUint32(headerView, 0, 0x04034b50);
    writeUint16(headerView, 4, 20);
    writeUint16(headerView, 6, 0x0800);
    writeUint16(headerView, 8, 0);
    writeUint16(headerView, 10, dosTime);
    writeUint16(headerView, 12, dosDate);
    writeUint32(headerView, 14, crc32);
    writeUint32(headerView, 18, entry.data.length);
    writeUint32(headerView, 22, entry.data.length);
    writeUint16(headerView, 26, nameBytes.length);
    header.set(nameBytes, 30);

    fileParts.push(header, entry.data);

    const centralHeader = new Uint8Array(
      ZIP_CENTRAL_DIRECTORY_HEADER_SIZE + nameBytes.length,
    );
    const centralView = new DataView(
      centralHeader.buffer,
      centralHeader.byteOffset,
      centralHeader.byteLength,
    );

    writeUint32(centralView, 0, 0x02014b50);
    writeUint16(centralView, 4, 20);
    writeUint16(centralView, 6, 20);
    writeUint16(centralView, 8, 0x0800);
    writeUint16(centralView, 10, 0);
    writeUint16(centralView, 12, dosTime);
    writeUint16(centralView, 14, dosDate);
    writeUint32(centralView, 16, crc32);
    writeUint32(centralView, 20, entry.data.length);
    writeUint32(centralView, 24, entry.data.length);
    writeUint16(centralView, 28, nameBytes.length);
    writeUint32(centralView, 42, currentOffset);
    centralHeader.set(nameBytes, 46);

    centralDirectoryParts.push(centralHeader);
    currentOffset += header.length + entry.data.length;
  }

  const endRecord = new Uint8Array(ZIP_END_RECORD_SIZE);
  const endView = new DataView(
    endRecord.buffer,
    endRecord.byteOffset,
    endRecord.byteLength,
  );

  writeUint32(endView, 0, 0x06054b50);
  writeUint16(endView, 8, entries.length);
  writeUint16(endView, 10, entries.length);
  writeUint32(endView, 12, layout.centralDirectorySize);
  writeUint32(endView, 16, layout.centralDirectoryOffset);

  const archive = new Uint8Array(layout.totalSize);
  let cursor = 0;

  for (const part of [...fileParts, ...centralDirectoryParts, endRecord]) {
    archive.set(part, cursor);
    cursor += part.length;
  }

  return archive;
}
