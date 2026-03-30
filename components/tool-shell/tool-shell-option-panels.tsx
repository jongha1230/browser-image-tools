"use client";

import type { ChangeEvent, RefObject } from "react";

import {
  compressionOutputOptions,
  compressionWorkflowPresetOptions,
  getCompressionMimeTypeLabel,
  type CompressionOutputFormat,
} from "@/lib/compress-image";
import {
  conversionOutputOptions,
  conversionWorkflowPresetOptions,
  getConversionOutputDescription,
  resolveConversionWorkflowMimeType,
} from "@/lib/convert-image";
import type { SupportedImageMimeType } from "@/lib/image-upload";
import {
  fitWithinResizePreset,
  resizePresetOptions,
  resizeWorkflowPresetOptions,
} from "@/lib/resize-image";

import type { UploadedImage } from "@/components/image-upload-provider";

import {
  formatDimensions,
  getQueueStatusLabel,
  type QueueItemState,
  type SummaryRow,
  type ToolShellVariant,
  type WorkflowPresetId,
} from "./shared";

type ToolShellWorkflowSidebarProps = {
  canDownloadZip: boolean;
  canProcess: boolean;
  completedCount: number;
  currentStepMessage: string;
  errorCount: number;
  handleDownloadResult: (itemId: string) => void;
  handleDownloadZip: () => void;
  handleProcessAll: () => void;
  hasResults: boolean;
  isPreparingZip: boolean;
  isProcessing: boolean;
  itemsLength: number;
  primaryActionLabel: string;
  processingCount: number;
  progressHintId: string;
  progressLabelId: string;
  progressPercent: number;
  progressValueText: string;
  queueSummaryRows: SummaryRow[];
  repeatActionMessage: string | null;
  selectedCompressionGrowthMessage: string | null;
  selectedItem: UploadedImage;
  selectedItemState: QueueItemState;
  selectedResult: QueueItemState["result"] | null;
  selectedResultRows: SummaryRow[];
  selectedSummaryRows: SummaryRow[];
  shouldPrioritizeZipDownload: boolean;
  showProgress: boolean;
  successCount: number;
  toolVariant: ToolShellVariant | null;
  workflowStatusLabel: string;
  workflowStatusTone: QueueItemState["status"];
  workflowSummaryRef: RefObject<HTMLDivElement | null>;
};

type ToolShellOptionPanelsProps = {
  canDownloadZip: boolean;
  canProcess: boolean;
  completedCount: number;
  compressionFormatSideEffectMessage: string;
  compressionOptionDescription: string;
  conversionOutputFormat: SupportedImageMimeType;
  conversionWorkflowPresetNote: string;
  currentStepMessage: string;
  errorCount: number;
  handleCompressOutputChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleConversionOutputChange: (
    event: ChangeEvent<HTMLSelectElement>,
  ) => void;
  handleDownloadResult: (itemId: string) => void;
  handleDownloadZip: () => void;
  handleKeepAspectRatioChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  handleProcessAll: () => void;
  handleQualityChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleResizeHeightChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleResizeWidthChange: (event: ChangeEvent<HTMLInputElement>) => void;
  hasResults: boolean;
  isConvertQualityEnabled: boolean;
  isCompressTool: boolean;
  isConvertTool: boolean;
  isPreparingZip: boolean;
  isProcessing: boolean;
  isQualityEnabled: boolean;
  isRemoveExifTool: boolean;
  isResizeTool: boolean;
  itemsLength: number;
  keepAspectRatio: boolean;
  optionPanelRef: RefObject<HTMLElement | null>;
  outputFormat: CompressionOutputFormat;
  primaryActionLabel: string;
  processingCount: number;
  progressHintId: string;
  progressLabelId: string;
  progressPercent: number;
  progressValueText: string;
  quality: number;
  queueSummaryRows: SummaryRow[];
  referenceDimensions: { width: number; height: number } | null;
  repeatActionMessage: string | null;
  resizeHeightValue: string;
  resizeValidationId: string;
  resizeValidationMessage: string | null;
  resizeWidthValue: string;
  selectedCompressionGrowthMessage: string | null;
  selectedCompressionWorkflowPreset: { id: WorkflowPresetId } | null;
  selectedConversionWorkflowPreset: { id: WorkflowPresetId } | null;
  selectedItem: UploadedImage | null;
  selectedItemState: QueueItemState | null;
  selectedMimeType: SupportedImageMimeType | null;
  selectedResizeWorkflowPreset: { id: WorkflowPresetId } | null;
  selectedResult: QueueItemState["result"] | null;
  selectedResultRows: SummaryRow[];
  selectedSummaryRows: SummaryRow[];
  shouldPrioritizeZipDownload: boolean;
  showProgress: boolean;
  skippedConvertCount: number;
  successCount: number;
  toolVariant: ToolShellVariant | null;
  workflowPresetNotice: string;
  workflowStatusLabel: string;
  workflowStatusTone: QueueItemState["status"];
  workflowSummaryRef: RefObject<HTMLDivElement | null>;
  applyCompressionWorkflowPreset: (
    preset: (typeof compressionWorkflowPresetOptions)[number],
  ) => void;
  applyConversionWorkflowPreset: (
    preset: (typeof conversionWorkflowPresetOptions)[number],
  ) => void;
  applyResizePreset: (preset: (typeof resizePresetOptions)[number]) => void;
  applyResizeWorkflowPreset: (
    preset: (typeof resizeWorkflowPresetOptions)[number],
  ) => void;
};

function ToolShellWorkflowSidebar({
  canDownloadZip,
  canProcess,
  completedCount,
  currentStepMessage,
  errorCount,
  handleDownloadResult,
  handleDownloadZip,
  handleProcessAll,
  hasResults,
  isPreparingZip,
  isProcessing,
  itemsLength,
  primaryActionLabel,
  processingCount,
  progressHintId,
  progressLabelId,
  progressPercent,
  progressValueText,
  queueSummaryRows,
  repeatActionMessage,
  selectedCompressionGrowthMessage,
  selectedItem,
  selectedItemState,
  selectedResult,
  selectedResultRows,
  selectedSummaryRows,
  shouldPrioritizeZipDownload,
  showProgress,
  successCount,
  toolVariant,
  workflowStatusLabel,
  workflowStatusTone,
  workflowSummaryRef,
}: ToolShellWorkflowSidebarProps) {
  const sidebarRows =
    selectedResultRows.length > 0 ? selectedResultRows : queueSummaryRows;

  return (
    <section className="card tool-shell__workflow-sidebar">
      <div className="tool-shell__workflow-section">
        <div className="tool-shell__workflow-heading">
          <h3>선택한 파일</h3>
          <span
            className="tool-shell__queue-status"
            data-status={selectedItemState.status}
          >
            {getQueueStatusLabel(selectedItemState.status)}
          </span>
        </div>
        <dl className="tool-shell__stat-list tool-shell__stat-list--compact">
          {selectedSummaryRows.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div
        aria-atomic="true"
        aria-live="polite"
        className="tool-shell__workflow-section tool-shell__workflow-section--accent"
        ref={workflowSummaryRef}
        role="status"
        tabIndex={-1}
      >
        <div className="tool-shell__workflow-heading">
          <h3>{hasResults ? "결과와 저장" : "실행 준비"}</h3>
          <span
            className="tool-shell__queue-status"
            data-status={workflowStatusTone}
          >
            {workflowStatusLabel}
          </span>
        </div>

        <p className="tool-shell__helper">
          {hasResults
            ? `총 ${itemsLength}개 중 ${successCount}개 성공, ${errorCount}개 실패입니다.`
            : isProcessing
              ? `${itemsLength}개 파일을 순서대로 처리하고 있습니다.`
              : currentStepMessage}
        </p>

        <div className="tool-shell__actions tool-shell__actions--stack">
          {toolVariant ? (
            <>
              <button
                className={hasResults ? "button-muted" : "button-link"}
                disabled={!canProcess}
                onClick={handleProcessAll}
                type="button"
              >
                {isProcessing ? "배치 처리 중..." : primaryActionLabel}
              </button>
              <button
                className={
                  shouldPrioritizeZipDownload || (hasResults && !selectedResult)
                    ? "button-link"
                    : "button-muted"
                }
                disabled={!canDownloadZip}
                onClick={handleDownloadZip}
                type="button"
              >
                {isPreparingZip ? "ZIP 준비 중..." : "성공 파일 ZIP 다운로드"}
              </button>
              {selectedResult && !shouldPrioritizeZipDownload ? (
                <button
                  className="button-link"
                  onClick={() => handleDownloadResult(selectedItem.id)}
                  type="button"
                >
                  대표 결과 다운로드
                </button>
              ) : null}
            </>
          ) : (
            <>
              <button className="button-link" disabled type="button">
                {primaryActionLabel}
              </button>
              <button className="button-muted" disabled type="button">
                배치 내보내기 연결 예정
              </button>
            </>
          )}
        </div>

        {repeatActionMessage ? (
          <p className="tool-shell__helper tool-shell__helper--next-action">
            {repeatActionMessage}
          </p>
        ) : null}

        {showProgress ? (
          <div className="tool-shell__progress tool-shell__progress--compact">
            <div className="tool-shell__progress-header">
              <strong id={progressLabelId}>배치 진행률</strong>
              <span>{`${completedCount}/${itemsLength} 완료`}</span>
            </div>
            <div
              aria-describedby={progressHintId}
              aria-labelledby={progressLabelId}
              aria-valuemax={Math.max(itemsLength, 1)}
              aria-valuemin={0}
              aria-valuenow={completedCount}
              aria-valuetext={progressValueText}
              className="tool-shell__progress-bar"
              role="progressbar"
            >
              <span style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="tool-shell__helper" id={progressHintId}>
              {processingCount > 0
                ? `${processingCount}개 파일을 현재 처리 중입니다.`
                : shouldPrioritizeZipDownload
                  ? "성공한 결과가 여러 개면 ZIP으로 한 번에 받고, 개별 파일은 아래 카드의 결과 다운로드 버튼으로 받을 수 있습니다."
                  : "성공한 결과는 바로 개별 다운로드하거나 ZIP으로 한 번에 받을 수 있습니다."}
            </p>
          </div>
        ) : null}

        {selectedItemState.status === "processing" ? (
          <p className="tool-shell__helper">
            대표 파일을 처리하고 있습니다. 완료되면 이 영역에 결과 요약과 다운로드
            버튼이 먼저 표시됩니다.
          </p>
        ) : null}

        {selectedItemState.status === "error" ? (
          <p className="tool-shell__helper tool-shell__helper--error">
            {selectedItemState.errorMessage}
          </p>
        ) : null}

        {selectedCompressionGrowthMessage ? (
          <p className="tool-shell__helper">
            {selectedCompressionGrowthMessage}
          </p>
        ) : null}

        <dl className="tool-shell__stat-list tool-shell__stat-list--compact">
          {sidebarRows.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function ToolShellOptionPanels({
  canDownloadZip,
  canProcess,
  completedCount,
  compressionFormatSideEffectMessage,
  compressionOptionDescription,
  conversionOutputFormat,
  conversionWorkflowPresetNote,
  currentStepMessage,
  errorCount,
  handleCompressOutputChange,
  handleConversionOutputChange,
  handleDownloadResult,
  handleDownloadZip,
  handleKeepAspectRatioChange,
  handleProcessAll,
  handleQualityChange,
  handleResizeHeightChange,
  handleResizeWidthChange,
  hasResults,
  isConvertQualityEnabled,
  isCompressTool,
  isConvertTool,
  isPreparingZip,
  isProcessing,
  isQualityEnabled,
  isRemoveExifTool,
  isResizeTool,
  itemsLength,
  keepAspectRatio,
  optionPanelRef,
  outputFormat,
  primaryActionLabel,
  processingCount,
  progressHintId,
  progressLabelId,
  progressPercent,
  progressValueText,
  quality,
  queueSummaryRows,
  referenceDimensions,
  repeatActionMessage,
  resizeHeightValue,
  resizeValidationId,
  resizeValidationMessage,
  resizeWidthValue,
  selectedCompressionGrowthMessage,
  selectedCompressionWorkflowPreset,
  selectedConversionWorkflowPreset,
  selectedItem,
  selectedItemState,
  selectedMimeType,
  selectedResizeWorkflowPreset,
  selectedResult,
  selectedResultRows,
  selectedSummaryRows,
  shouldPrioritizeZipDownload,
  showProgress,
  skippedConvertCount,
  successCount,
  toolVariant,
  workflowPresetNotice,
  workflowStatusLabel,
  workflowStatusTone,
  workflowSummaryRef,
  applyCompressionWorkflowPreset,
  applyConversionWorkflowPreset,
  applyResizePreset,
  applyResizeWorkflowPreset,
}: ToolShellOptionPanelsProps) {
  if (!selectedItem || !selectedItemState) {
    return null;
  }

  const workflowSidebar = (
    <ToolShellWorkflowSidebar
      canDownloadZip={canDownloadZip}
      canProcess={canProcess}
      completedCount={completedCount}
      currentStepMessage={currentStepMessage}
      errorCount={errorCount}
      handleDownloadResult={handleDownloadResult}
      handleDownloadZip={handleDownloadZip}
      handleProcessAll={handleProcessAll}
      hasResults={hasResults}
      isPreparingZip={isPreparingZip}
      isProcessing={isProcessing}
      itemsLength={itemsLength}
      primaryActionLabel={primaryActionLabel}
      processingCount={processingCount}
      progressHintId={progressHintId}
      progressLabelId={progressLabelId}
      progressPercent={progressPercent}
      progressValueText={progressValueText}
      queueSummaryRows={queueSummaryRows}
      repeatActionMessage={repeatActionMessage}
      selectedCompressionGrowthMessage={selectedCompressionGrowthMessage}
      selectedItem={selectedItem}
      selectedItemState={selectedItemState}
      selectedResult={selectedResult}
      selectedResultRows={selectedResultRows}
      selectedSummaryRows={selectedSummaryRows}
      shouldPrioritizeZipDownload={shouldPrioritizeZipDownload}
      showProgress={showProgress}
      successCount={successCount}
      toolVariant={toolVariant}
      workflowStatusLabel={workflowStatusLabel}
      workflowStatusTone={workflowStatusTone}
      workflowSummaryRef={workflowSummaryRef}
    />
  );

  return (
    <>
      {isCompressTool ? (
        <div className="detail-grid tool-shell__comparison-grid">
          <section
            className="card tool-shell__option-card"
            ref={optionPanelRef}
            tabIndex={-1}
          >
            <h3>압축 옵션</h3>

            <div className="tool-shell__field">
              <div className="tool-shell__field-heading">
                <span>업로드 워크플로 프리셋</span>
                <small>추천 시작점</small>
              </div>
              <div className="tool-shell__preset-list tool-shell__preset-list--workflow">
                {compressionWorkflowPresetOptions.map((preset) => (
                  <button
                    aria-pressed={selectedCompressionWorkflowPreset?.id === preset.id}
                    className="tool-shell__preset"
                    data-active={selectedCompressionWorkflowPreset?.id === preset.id}
                    disabled={isProcessing}
                    key={preset.id}
                    onClick={() => applyCompressionWorkflowPreset(preset)}
                    type="button"
                  >
                    <small>{preset.summary}</small>
                    <strong>{preset.label}</strong>
                    <span className="tool-shell__preset-description">
                      {preset.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <p className="tool-shell__helper">{workflowPresetNotice}</p>

            <label className="tool-shell__field" htmlFor="compress-output-format">
              <span>출력 형식</span>
              <select
                className="tool-shell__select"
                disabled={isProcessing}
                id="compress-output-format"
                onChange={handleCompressOutputChange}
                value={outputFormat}
              >
                {compressionOutputOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.value === "original" && selectedMimeType
                      ? `${option.label} (${getCompressionMimeTypeLabel(
                          selectedMimeType,
                        )})`
                      : option.label}
                  </option>
                ))}
              </select>
            </label>

            <p className="tool-shell__helper">{compressionOptionDescription}</p>

            <label className="tool-shell__field" htmlFor="compress-quality">
              <span>품질</span>
              <div className="tool-shell__range-row">
                <input
                  disabled={!isQualityEnabled || isProcessing}
                  id="compress-quality"
                  max="100"
                  min="40"
                  onChange={handleQualityChange}
                  step="1"
                  type="range"
                  value={quality}
                />
                <strong>{isQualityEnabled ? `${quality}%` : "무손실"}</strong>
              </div>
            </label>

            <p className="tool-shell__helper">
              {compressionFormatSideEffectMessage}
            </p>

            <p className="tool-shell__helper">
              선택한 품질과 출력 형식이 모든 파일에 동일하게 적용됩니다. 결과는 개별
              저장하거나 ZIP으로 묶어 받을 수 있습니다.
            </p>
          </section>

          {workflowSidebar}
        </div>
      ) : null}

      {isResizeTool ? (
        <div className="detail-grid tool-shell__comparison-grid">
          <section
            className="card tool-shell__option-card"
            ref={optionPanelRef}
            tabIndex={-1}
          >
            <h3>크기 조절 옵션</h3>

            <div className="tool-shell__field">
              <div className="tool-shell__field-heading">
                <span>업로드 워크플로 프리셋</span>
                <small>추천 시작점</small>
              </div>
              <div className="tool-shell__preset-list tool-shell__preset-list--workflow">
                {resizeWorkflowPresetOptions.map((preset) => (
                  <button
                    aria-pressed={selectedResizeWorkflowPreset?.id === preset.id}
                    className="tool-shell__preset"
                    data-active={selectedResizeWorkflowPreset?.id === preset.id}
                    disabled={isProcessing}
                    key={preset.id}
                    onClick={() => applyResizeWorkflowPreset(preset)}
                    type="button"
                  >
                    <small>{preset.summary}</small>
                    <strong>{preset.label}</strong>
                    <span className="tool-shell__preset-description">
                      {preset.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <p className="tool-shell__helper">{workflowPresetNotice}</p>

            <div className="tool-shell__dimension-grid">
              <label className="tool-shell__field" htmlFor="resize-width">
                <span>가로 (px)</span>
                <input
                  aria-describedby={resizeValidationMessage ? resizeValidationId : undefined}
                  aria-invalid={resizeValidationMessage ? true : undefined}
                  className="tool-shell__input"
                  disabled={isProcessing}
                  id="resize-width"
                  inputMode="numeric"
                  min="1"
                  onChange={handleResizeWidthChange}
                  type="number"
                  value={resizeWidthValue}
                />
              </label>

              <label className="tool-shell__field" htmlFor="resize-height">
                <span>세로 (px)</span>
                <input
                  aria-describedby={resizeValidationMessage ? resizeValidationId : undefined}
                  aria-invalid={resizeValidationMessage ? true : undefined}
                  className="tool-shell__input"
                  disabled={isProcessing}
                  id="resize-height"
                  inputMode="numeric"
                  min="1"
                  onChange={handleResizeHeightChange}
                  type="number"
                  value={resizeHeightValue}
                />
              </label>
            </div>

            <label className="tool-shell__toggle" htmlFor="resize-keep-aspect-ratio">
              <input
                checked={keepAspectRatio}
                disabled={isProcessing}
                id="resize-keep-aspect-ratio"
                onChange={handleKeepAspectRatioChange}
                type="checkbox"
              />
              <span>
                <strong>비율 유지</strong>
                <small>
                  켜져 있으면 각 파일이 지정한 가로·세로 박스 안에 맞게 개별 비율을
                  유지합니다.
                </small>
              </span>
            </label>

            <div className="tool-shell__field">
              <div className="tool-shell__field-heading">
                <span>자주 쓰는 크기 박스</span>
                <small>직접 규격 선택</small>
              </div>
              <div className="tool-shell__preset-list">
                {resizePresetOptions.map((preset) => {
                  const nextDimensions =
                    keepAspectRatio && referenceDimensions
                      ? fitWithinResizePreset(referenceDimensions, preset)
                      : preset;

                  return (
                    <button
                      className="tool-shell__preset"
                      disabled={isProcessing}
                      key={preset.label}
                      onClick={() => applyResizePreset(preset)}
                      type="button"
                    >
                      <strong>{preset.label}</strong>
                      <span>{formatDimensions(nextDimensions)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="tool-shell__helper">
              입력한 크기는 모든 파일에 공통으로 적용됩니다. 비율 유지를 켜면 실제
              저장 크기는 파일마다 조금씩 달라질 수 있습니다.
            </p>

            {resizeValidationMessage ? (
              <p
                className="tool-shell__helper tool-shell__helper--error"
                id={resizeValidationId}
              >
                {resizeValidationMessage}
              </p>
            ) : null}
          </section>

          {workflowSidebar}
        </div>
      ) : null}

      {isConvertTool ? (
        <div className="detail-grid tool-shell__comparison-grid">
          <section
            className="card tool-shell__option-card"
            ref={optionPanelRef}
            tabIndex={-1}
          >
            <h3>포맷 변환 옵션</h3>

            <div className="tool-shell__field">
              <div className="tool-shell__field-heading">
                <span>업로드 워크플로 프리셋</span>
                <small>추천 시작점</small>
              </div>
              <div className="tool-shell__preset-list tool-shell__preset-list--workflow">
                {conversionWorkflowPresetOptions.map((preset) => {
                  const resolvedTargetMimeType =
                    resolveConversionWorkflowMimeType(selectedMimeType, preset);

                  return (
                    <button
                      aria-pressed={selectedConversionWorkflowPreset?.id === preset.id}
                      className="tool-shell__preset"
                      data-active={selectedConversionWorkflowPreset?.id === preset.id}
                      disabled={isProcessing}
                      key={preset.id}
                      onClick={() => applyConversionWorkflowPreset(preset)}
                      type="button"
                    >
                      <small>
                        {`${getCompressionMimeTypeLabel(
                          resolvedTargetMimeType,
                        )} · 품질 ${preset.quality}%`}
                      </small>
                      <strong>{preset.label}</strong>
                      <span className="tool-shell__preset-description">
                        {preset.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="tool-shell__helper">{workflowPresetNotice}</p>
            <p className="tool-shell__helper">{conversionWorkflowPresetNote}</p>

            <label className="tool-shell__field" htmlFor="convert-output-format">
              <span>출력 형식</span>
              <select
                className="tool-shell__select"
                disabled={isProcessing}
                id="convert-output-format"
                onChange={handleConversionOutputChange}
                value={conversionOutputFormat}
              >
                {conversionOutputOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <p className="tool-shell__helper">
              {getConversionOutputDescription(conversionOutputFormat)}
            </p>

            <label className="tool-shell__field" htmlFor="convert-quality">
              <span>품질</span>
              <div className="tool-shell__range-row">
                <input
                  disabled={!isConvertQualityEnabled || isProcessing}
                  id="convert-quality"
                  max="100"
                  min="40"
                  onChange={handleQualityChange}
                  step="1"
                  type="range"
                  value={quality}
                />
                <strong>{isConvertQualityEnabled ? `${quality}%` : "무손실"}</strong>
              </div>
            </label>

            <p className="tool-shell__helper">
              {conversionOutputFormat === "image/jpeg" &&
              selectedMimeType !== "image/jpeg"
                ? "JPEG는 투명 배경을 저장하지 못하므로 투명 영역이 있다면 흰색으로 채워집니다."
                : isConvertQualityEnabled
                  ? "JPEG와 WebP는 품질 값을 낮출수록 파일이 더 작아질 수 있지만 세부 묘사가 줄어들 수 있습니다."
                  : "PNG는 무손실 저장으로 다시 생성됩니다."}
            </p>

            {skippedConvertCount > 0 ? (
              <p className="tool-shell__helper">
                현재 큐에서 {skippedConvertCount}개 파일은 원본과 같은 출력 형식을
                선택해 변환 시 실패로 표시될 예정입니다.
              </p>
            ) : null}
          </section>

          {workflowSidebar}
        </div>
      ) : null}

      {isRemoveExifTool ? (
        <div className="detail-grid tool-shell__comparison-grid">
          <section
            className="card tool-shell__option-card"
            ref={optionPanelRef}
            tabIndex={-1}
          >
            <h3>메타데이터 제거 안내</h3>
            <p>
              업로드한 이미지를 원본 형식으로 다시 저장해 공유 전에 위치, 기기,
              촬영 시각 같은 EXIF 정보를 정리하는 방식입니다.
            </p>
            <ul className="chip-list">
              <li>GPS 위치 정보 정리 가능</li>
              <li>기기 모델 및 촬영 설정 정리 가능</li>
              <li>필요한 결과만 골라 저장 가능</li>
            </ul>
            <p className="tool-shell__helper">
              처리 방식은 재인코딩 기반이므로 일부 앱 전용 메타데이터도 함께 사라질 수
              있습니다.
            </p>
          </section>

          {workflowSidebar}
        </div>
      ) : null}
    </>
  );
}
