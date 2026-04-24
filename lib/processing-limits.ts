export const PROCESSING_LIMITS = {
  maxFileSizeBytes: 20 * 1024 * 1024,
  maxBatchFiles: 20,
  maxBatchTotalBytes: 100 * 1024 * 1024,
  maxCanvasDimension: 8192,
  maxZipEntries: 65_535,
  maxZipEntrySizeBytes: 0xffffffff,
  maxZipArchiveSizeBytes: 512 * 1024 * 1024,
} as const;

type SizedFileLike = {
  name: string;
  size: number;
};

type LimitValidationResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      message: string;
    };

export function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ["KB", "MB", "GB"] as const;
  let value = bytes;
  let unitIndex = -1;

  do {
    value /= 1024;
    unitIndex += 1;
  } while (value >= 1024 && unitIndex < units.length - 1);

  const maximumFractionDigits = value >= 100 ? 0 : value >= 10 ? 1 : 2;

  return `${new Intl.NumberFormat("ko-KR", {
    maximumFractionDigits,
  }).format(value)} ${units[unitIndex]}`;
}

export function getFileSizeLimitMessage(
  limit = PROCESSING_LIMITS.maxFileSizeBytes,
) {
  return `파일 크기가 너무 큽니다. ${formatBytes(limit)} 이하의 이미지를 선택해 주세요.`;
}

export function getBatchFileCountLimitMessage(
  limit = PROCESSING_LIMITS.maxBatchFiles,
) {
  return `한 번에 처리할 수 있는 이미지는 최대 ${limit.toLocaleString("ko-KR")}개입니다.`;
}

export function getBatchTotalSizeLimitMessage(
  limit = PROCESSING_LIMITS.maxBatchTotalBytes,
) {
  return `선택한 이미지의 전체 용량이 너무 큽니다. 총 ${formatBytes(limit)} 이하로 줄여 주세요.`;
}

export function getCanvasDimensionLimitMessage(
  limit = PROCESSING_LIMITS.maxCanvasDimension,
) {
  return `이미지 해상도가 너무 커서 브라우저에서 안정적으로 처리하기 어렵습니다. 긴 변이 ${limit.toLocaleString("ko-KR")}px 이하인 이미지를 사용해 주세요.`;
}

export function getZipArchiveSizeLimitMessage(
  limit = PROCESSING_LIMITS.maxZipArchiveSizeBytes,
) {
  return `ZIP 파일이 너무 커질 수 있어 다운로드를 중단했습니다. 총 ${formatBytes(limit)} 이하로 줄여 다시 시도해 주세요.`;
}

export function prefixFileLimitMessage(fileName: string, message: string) {
  return `${fileName}: ${message}`;
}

export function validateImageFileLimit(
  file: Pick<SizedFileLike, "size">,
): LimitValidationResult {
  if (file.size > PROCESSING_LIMITS.maxFileSizeBytes) {
    return {
      ok: false,
      message: getFileSizeLimitMessage(),
    };
  }

  return { ok: true };
}

export function validateBatchLimits(
  files: readonly SizedFileLike[],
): LimitValidationResult {
  if (files.length > PROCESSING_LIMITS.maxBatchFiles) {
    return {
      ok: false,
      message: getBatchFileCountLimitMessage(),
    };
  }

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);

  if (totalBytes > PROCESSING_LIMITS.maxBatchTotalBytes) {
    return {
      ok: false,
      message: getBatchTotalSizeLimitMessage(),
    };
  }

  return { ok: true };
}

export function validateCanvasDimensions(dimensions: {
  width: number;
  height: number;
}): LimitValidationResult {
  if (
    dimensions.width > PROCESSING_LIMITS.maxCanvasDimension ||
    dimensions.height > PROCESSING_LIMITS.maxCanvasDimension
  ) {
    return {
      ok: false,
      message: getCanvasDimensionLimitMessage(),
    };
  }

  return { ok: true };
}
