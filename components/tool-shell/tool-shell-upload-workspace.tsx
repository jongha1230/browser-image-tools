"use client";

import type {
  ChangeEvent,
  DragEvent,
  KeyboardEvent,
  RefObject,
} from "react";

import { formatFileSize, supportedImageAccept } from "@/lib/image-upload";

import {
  getDropzoneCopy,
  getEngineLabel,
  getQueueStatusLabel,
  sourceLabels,
  stepLabels,
  type ProcessingEngine,
  type QueueItemState,
  type StepKey,
  type ToolShellVariant,
} from "./shared";

type ToolShellUploadWorkspaceProps = {
  activeStep: StepKey;
  clearItems: () => void;
  currentStepMessage: string;
  dropzoneDescriptionIds: string | undefined;
  dropzoneHint: string;
  dropzoneHintId: string;
  dropzoneRef: RefObject<HTMLDivElement | null>;
  dropzoneTitle: string;
  dropzoneTitleId: string;
  fileCountLabel: string;
  handleDragEnter: (event: DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  handleDragOver: (event: DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: DragEvent<HTMLDivElement>) => void;
  handleDropzoneKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  hasItems: boolean;
  hasResults: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  isDragging: boolean;
  isProcessing: boolean;
  keepAspectRatio: boolean;
  lastSource: keyof typeof sourceLabels | null;
  openFilePicker: () => void;
  selectedItemState: QueueItemState | null;
  shouldReplaceOnAdd: boolean;
  showClearQueueAction: boolean;
  skippedConvertCount: number;
  startChecklist: string[];
  stepStatusId: string;
  successCount: number;
  errorCount: number;
  processingEngine: ProcessingEngine;
  totalSize: number;
  uploadStepMessage: string;
  variant: ToolShellVariant;
};

export function ToolShellUploadWorkspace({
  activeStep,
  clearItems,
  currentStepMessage,
  dropzoneDescriptionIds,
  dropzoneHint,
  dropzoneHintId,
  dropzoneRef,
  dropzoneTitle,
  dropzoneTitleId,
  fileCountLabel,
  handleDragEnter,
  handleDragLeave,
  handleDragOver,
  handleDrop,
  handleDropzoneKeyDown,
  handleInputChange,
  hasItems,
  hasResults,
  inputRef,
  isDragging,
  isProcessing,
  keepAspectRatio,
  lastSource,
  openFilePicker,
  selectedItemState,
  shouldReplaceOnAdd,
  showClearQueueAction,
  skippedConvertCount,
  startChecklist,
  stepStatusId,
  successCount,
  errorCount,
  processingEngine,
  totalSize,
  uploadStepMessage,
  variant,
}: ToolShellUploadWorkspaceProps) {
  return (
    <div className="tool-shell__primary-grid">
      <div
        aria-describedby={dropzoneDescriptionIds}
        aria-labelledby={dropzoneTitleId}
        className="tool-shell__dropzone"
        data-dragging={isDragging}
        data-has-items={hasItems}
        data-ready-for-replacement={shouldReplaceOnAdd}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onKeyDown={handleDropzoneKeyDown}
        ref={dropzoneRef}
        role="group"
        tabIndex={isProcessing ? -1 : 0}
      >
        <input
          ref={inputRef}
          accept={supportedImageAccept}
          aria-describedby={dropzoneDescriptionIds}
          aria-label="이미지 파일 선택"
          className="visually-hidden"
          disabled={isProcessing}
          multiple
          onChange={handleInputChange}
          type="file"
        />
        <strong id={dropzoneTitleId}>{dropzoneTitle}</strong>
        <p id={dropzoneHintId}>
          {dropzoneHint}
          <span className="visually-hidden">
            키보드 사용 시 Ctrl + V, Enter, Space를 지원합니다.
          </span>
        </p>
        <div className="tool-shell__drop-actions">
          <button className="button-link" onClick={openFilePicker} type="button">
            파일 선택
          </button>
          {showClearQueueAction ? (
            <button
              className="button-muted"
              disabled={isProcessing}
              onClick={clearItems}
              type="button"
            >
              업로드 목록 비우기
            </button>
          ) : null}
        </div>
        <ul className="tool-shell__drop-highlights">
          <li>브라우저 안에서만 파일 보관 및 처리</li>
          <li>JPEG, PNG, WebP 파일만 허용</li>
          <li>
            {getDropzoneCopy(
              variant,
              keepAspectRatio,
              skippedConvertCount,
              shouldReplaceOnAdd,
            )}
          </li>
        </ul>
      </div>

      <aside className="card tool-shell__overview-card" data-has-items={hasItems}>
        <h3>{hasItems ? "현재 큐 요약" : "빠른 시작"}</h3>

        {hasItems ? (
          <>
            <div className="tool-shell__overview-head">
              <div>
                <strong>{fileCountLabel}</strong>
                <p>
                  {lastSource
                    ? `${sourceLabels[lastSource]}로 최근 파일을 추가했습니다.`
                    : "대표 파일과 옵션을 바로 이어서 확인하세요."}
                </p>
              </div>
              {selectedItemState ? (
                <span
                  className="tool-shell__queue-status"
                  data-status={selectedItemState.status}
                >
                  {getQueueStatusLabel(selectedItemState.status)}
                </span>
              ) : null}
            </div>
            <div
              aria-atomic="true"
              aria-live="polite"
              className="tool-shell__status"
              id={stepStatusId}
              role="status"
            >
              <strong>{stepLabels[activeStep]}</strong>
              <p>{currentStepMessage}</p>
            </div>
            <dl className="tool-shell__stat-list tool-shell__stat-list--compact">
              <div>
                <dt>총 업로드 용량</dt>
                <dd>{formatFileSize(totalSize)}</dd>
              </div>
              <div>
                <dt>성공 / 실패</dt>
                <dd>{hasResults ? `${successCount}개 / ${errorCount}개` : "실행 전"}</dd>
              </div>
              <div>
                <dt>처리 엔진</dt>
                <dd>{getEngineLabel(processingEngine)}</dd>
              </div>
            </dl>
          </>
        ) : (
          <>
            <ol className="tool-shell__start-list">
              {startChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            <div
              aria-atomic="true"
              aria-live="polite"
              className="tool-shell__status"
              id={stepStatusId}
              role="status"
            >
              <strong>{stepLabels.upload}</strong>
              <p>{uploadStepMessage}</p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
