export type ZipArchiveEntry = {
  data: Uint8Array;
  fileName: string;
  lastModified?: number;
};

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

export function createStoredZipArchive(entries: readonly ZipArchiveEntry[]) {
  const encoder = new TextEncoder();
  const centralDirectoryParts: Uint8Array[] = [];
  const fileParts: Uint8Array[] = [];
  let currentOffset = 0;

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.fileName);
    const header = new Uint8Array(30 + nameBytes.length);
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

    const centralHeader = new Uint8Array(46 + nameBytes.length);
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

  const centralDirectorySize = centralDirectoryParts.reduce(
    (sum, part) => sum + part.length,
    0,
  );
  const endRecord = new Uint8Array(22);
  const endView = new DataView(
    endRecord.buffer,
    endRecord.byteOffset,
    endRecord.byteLength,
  );

  writeUint32(endView, 0, 0x06054b50);
  writeUint16(endView, 8, entries.length);
  writeUint16(endView, 10, entries.length);
  writeUint32(endView, 12, centralDirectorySize);
  writeUint32(endView, 16, currentOffset);

  const totalSize =
    currentOffset + centralDirectorySize + endRecord.length;
  const archive = new Uint8Array(totalSize);
  let cursor = 0;

  for (const part of [...fileParts, ...centralDirectoryParts, endRecord]) {
    archive.set(part, cursor);
    cursor += part.length;
  }

  return archive;
}
