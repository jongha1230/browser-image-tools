"use client";

import Image from "next/image";

import type { UploadedImage } from "@/components/image-upload-provider";
import { getCompressionMimeTypeLabel } from "@/lib/compress-image";
import { formatFileSize, getSupportedImageMimeType } from "@/lib/image-upload";

import {
  formatCompressionSummary,
  formatDimensions,
  formatResizeScaleSummary,
  getQueueStatusLabel,
  type QueueItemState,
  type ToolShellVariant,
} from "./shared";

type ToolShellPreviewGridProps = {
  handleDownloadResult: (itemId: string) => void;
  isProcessing: boolean;
  items: UploadedImage[];
  queueState: Record<string, QueueItemState>;
  removeItem: (id: string) => void;
  selectedItemId: string | null;
  toolVariant: ToolShellVariant | null;
};

export function ToolShellPreviewGrid({
  handleDownloadResult,
  isProcessing,
  items,
  queueState,
  removeItem,
  selectedItemId,
  toolVariant,
}: ToolShellPreviewGridProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="detail-grid tool-shell__preview-grid">
      {items.map((item) => {
        const itemState = queueState[item.id] ?? { status: "queued" };
        const itemMimeType = getSupportedImageMimeType(item.file) ?? "image/jpeg";

        return (
          <article
            className="card tool-shell__preview-card"
            data-primary={item.id === selectedItemId}
            key={item.id}
          >
            <div className="tool-shell__preview-media">
              <Image
                alt={`${item.file.name} 미리보기`}
                fill
                sizes="(min-width: 900px) 30vw, (min-width: 640px) 45vw, 100vw"
                src={item.previewUrl}
                unoptimized
              />
            </div>
            <div className="tool-shell__preview-meta">
              <div className="tool-shell__preview-heading">
                <h3>{item.file.name}</h3>
                <span
                  className="tool-shell__queue-status"
                  data-status={itemState.status}
                >
                  {getQueueStatusLabel(itemState.status)}
                </span>
              </div>
              <p>{`${item.typeLabel} · ${formatFileSize(item.file.size)}`}</p>
              {item.id === selectedItemId ? (
                <p className="tool-shell__preview-badge">현재 기준 파일</p>
              ) : null}
            </div>

            {itemState.status === "processing" ? (
              <p className="tool-shell__helper">
                현재 파일을 처리하고 있습니다. 이 단계가 끝나면 성공 또는 실패 상태가
                바로 업데이트됩니다.
              </p>
            ) : null}

            {itemState.status === "error" ? (
              <p className="tool-shell__helper tool-shell__helper--error">
                {itemState.errorMessage}
              </p>
            ) : null}

            {itemState.status === "success" && itemState.result ? (
              <dl className="tool-shell__stat-list tool-shell__stat-list--compact tool-shell__queue-result">
                <div>
                  <dt>저장 이름</dt>
                  <dd>{itemState.result.fileName}</dd>
                </div>
                <div>
                  <dt>출력 형식</dt>
                  <dd>{getCompressionMimeTypeLabel(itemState.result.mimeType)}</dd>
                </div>
                <div>
                  <dt>결과 크기</dt>
                  <dd>{formatFileSize(itemState.result.blob.size)}</dd>
                </div>
                <div>
                  <dt>해상도</dt>
                  <dd>{formatDimensions(itemState.result)}</dd>
                </div>
                {toolVariant === "resize" ? (
                  <div>
                    <dt>크기 비율</dt>
                    <dd>
                      {formatResizeScaleSummary(
                        {
                          width: itemState.result.originalWidth,
                          height: itemState.result.originalHeight,
                        },
                        itemState.result,
                      )}
                    </dd>
                  </div>
                ) : (
                  <div>
                    <dt>용량 변화</dt>
                    <dd>
                      {formatCompressionSummary(
                        item.file.size,
                        itemState.result.blob.size,
                      )}
                    </dd>
                  </div>
                )}
                {toolVariant === "removeExif" ? (
                  <div>
                    <dt>메타데이터</dt>
                    <dd>EXIF 제거용 재저장</dd>
                  </div>
                ) : null}
                {toolVariant === "convert" ? (
                  <div>
                    <dt>원본 형식</dt>
                    <dd>{getCompressionMimeTypeLabel(itemMimeType)}</dd>
                  </div>
                ) : null}
              </dl>
            ) : null}

            <div className="tool-shell__preview-actions">
              <button
                className="button-muted"
                disabled={isProcessing}
                onClick={() => removeItem(item.id)}
                type="button"
              >
                목록에서 제거
              </button>
              {itemState.status === "success" ? (
                <button
                  className="button-link"
                  onClick={() => handleDownloadResult(item.id)}
                  type="button"
                >
                  결과 다운로드
                </button>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
