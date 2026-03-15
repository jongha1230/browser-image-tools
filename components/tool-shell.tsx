"use client";

import Image from "next/image";
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";

import { useImageUploads } from "@/components/image-upload-provider";
import {
  formatFileSize,
  supportedImageAccept,
  supportedImageTypesText,
} from "@/lib/image-upload";

type StepKey = "upload" | "options" | "export";

const stepLabels: Record<StepKey, string> = {
  upload: "파일 준비",
  options: "옵션 선택",
  export: "결과 저장",
};

const sourceLabels = {
  drop: "드래그 앤 드롭",
  input: "파일 선택",
  paste: "클립보드 붙여넣기",
} as const;

type ToolShellProps = {
  title: string;
  description: string;
  primaryActionLabel: string;
};

function getClipboardFiles(dataTransfer: DataTransfer | null) {
  if (!dataTransfer) {
    return [];
  }

  const files = Array.from(dataTransfer.files);

  if (files.length > 0) {
    return files;
  }

  return Array.from(dataTransfer.items)
    .filter((item) => item.kind === "file")
    .map((item) => item.getAsFile())
    .filter((file): file is File => file !== null);
}

export function ToolShell({
  title,
  description,
  primaryActionLabel,
}: ToolShellProps) {
  const [activeStep, setActiveStep] = useState<StepKey>("upload");
  const [isDragging, setIsDragging] = useState(false);
  const dragDepthRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addFiles, clearErrors, clearItems, errors, items, lastSource, removeItem } =
    useImageUploads();
  const totalSize = items.reduce((sum, item) => sum + item.file.size, 0);
  const fileCountLabel = items.length > 0 ? `${items.length}개 파일 준비됨` : "아직 업로드된 파일이 없음";

  const statusByStep: Record<StepKey, string> = {
    upload:
      items.length > 0
        ? `${fileCountLabel}. 선택한 이미지는 현재 브라우저 탭 안에서만 유지되며, 이후 도구 페이지에서도 같은 업로드 상태를 재사용할 수 있습니다.`
        : `JPEG, PNG, WebP 이미지를 업로드하면 이 단계에서 바로 미리보기와 오류 상태를 확인할 수 있습니다.`,
    options:
      items.length > 0
        ? `${items.length}개 파일이 준비되어 있어 다음 단계에서는 도구별 옵션 UI만 추가하면 됩니다.`
        : "먼저 파일을 올리면 압축 품질, 크기, 출력 포맷, 메타데이터 제거 여부 같은 옵션 패널을 이 단계에 연결할 수 있습니다.",
    export:
      items.length > 0
        ? `현재 업로드 상태와 미리보기가 준비되어 있어 이후 단계에서 결과 비교, 개별 다운로드, 배치 내보내기를 붙일 수 있습니다.`
        : "업로드가 준비되면 처리 결과 미리보기와 개별 다운로드, 배치 내보내기 흐름이 이 단계에 이어집니다.",
  };

  const handleWindowPaste = useEffectEvent((event: ClipboardEvent) => {
    const target = event.target;

    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      (target instanceof HTMLElement && target.isContentEditable)
    ) {
      return;
    }

    addFiles(getClipboardFiles(event.clipboardData), "paste");
  });

  useEffect(() => {
    function onPaste(event: ClipboardEvent) {
      handleWindowPaste(event);
    }

    window.addEventListener("paste", onPaste);

    return () => {
      window.removeEventListener("paste", onPaste);
    };
  }, []);

  function openFilePicker() {
    inputRef.current?.click();
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    addFiles(event.currentTarget.files, "input");
    event.currentTarget.value = "";
  }

  function handleDragEnter(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    dragDepthRef.current += 1;
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);

    if (dragDepthRef.current === 0) {
      setIsDragging(false);
    }
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    dragDepthRef.current = 0;
    setIsDragging(false);
    addFiles(event.dataTransfer.files, "drop");
  }

  return (
    <section className="tool-shell" aria-labelledby="tool-shell-title">
      <div className="tool-shell__header">
        <div>
          <h2 id="tool-shell-title">{title} 작업 패널</h2>
          <p>{description}</p>
        </div>
        <span className="tool-shell__badge">브라우저 로컬 업로드 활성화</span>
      </div>

      <div className="tool-shell__workspace">
        <div
          className="tool-shell__dropzone"
          data-dragging={isDragging}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            accept={supportedImageAccept}
            aria-label="이미지 파일 선택"
            className="visually-hidden"
            multiple
            onChange={handleInputChange}
            type="file"
          />
          <strong>이미지를 끌어 놓거나 파일 선택으로 추가하세요</strong>
          <p>
            지원 형식은 {supportedImageTypesText}입니다. 붙여넣기 이미지는 이
            페이지에서 <kbd>Ctrl</kbd> + <kbd>V</kbd> 로 바로 추가할 수
            있습니다.
          </p>
          <div className="tool-shell__drop-actions">
            <button className="button-link" onClick={openFilePicker} type="button">
              파일 선택
            </button>
            <button
              className="button-muted"
              onClick={clearItems}
              type="button"
              disabled={items.length === 0}
            >
              업로드 초기화
            </button>
          </div>
          <ul className="chip-list">
            <li>브라우저 안에서만 파일 보관 및 미리보기</li>
            <li>JPEG, PNG, WebP 파일만 허용</li>
            <li>이후 도구 페이지에서도 같은 업로드 상태 재사용 가능</li>
          </ul>
        </div>

        {errors.length > 0 ? (
          <div className="tool-shell__message" role="alert">
            <div className="tool-shell__message-header">
              <strong>확인할 업로드 메시지</strong>
              <button className="button-muted" onClick={clearErrors} type="button">
                메시지 지우기
              </button>
            </div>
            <ul className="list-reset tool-shell__message-list">
              {errors.map((error) => (
                <li key={error.id}>{error.message}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="detail-grid tool-shell__summary-grid">
          <div className="card">
            <h3>현재 상태</h3>
            <p>{fileCountLabel}</p>
          </div>
          <div className="card">
            <h3>총 업로드 용량</h3>
            <p>{items.length > 0 ? formatFileSize(totalSize) : "0 B"}</p>
          </div>
          <div className="card">
            <h3>최근 추가 방법</h3>
            <p>{lastSource ? sourceLabels[lastSource] : "아직 없음"}</p>
          </div>
        </div>

        {items.length > 0 ? (
          <div className="detail-grid tool-shell__preview-grid">
            {items.map((item) => (
              <article className="card tool-shell__preview-card" key={item.id}>
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
                  <h3>{item.file.name}</h3>
                  <p>{item.typeLabel}</p>
                  <p>{formatFileSize(item.file.size)}</p>
                </div>
                <div className="tool-shell__preview-actions">
                  <button
                    className="button-muted"
                    onClick={() => removeItem(item.id)}
                    type="button"
                  >
                    목록에서 제거
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="tool-shell__empty">
            <strong>미리보기는 업로드 후 여기에 표시됩니다.</strong>
            <p>
              아직 파일이 없습니다. {supportedImageTypesText} 이미지를 추가하면
              각 파일 카드에서 형식과 용량을 바로 확인할 수 있습니다.
            </p>
          </div>
        )}
      </div>

      <div className="tool-shell__step-list" aria-label="작업 흐름">
        {Object.entries(stepLabels).map(([key, label]) => {
          const stepKey = key as StepKey;

          return (
            <button
              key={stepKey}
              className="tool-shell__step"
              data-active={activeStep === stepKey}
              onClick={() => setActiveStep(stepKey)}
              type="button"
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="tool-shell__status" role="status" aria-live="polite">
        <strong>{stepLabels[activeStep]}</strong>
        <p>{statusByStep[activeStep]}</p>
      </div>

      <div className="tool-shell__actions">
        <button className="button-link" type="button" disabled>
          {primaryActionLabel}
        </button>
        <button className="button-muted" type="button" disabled>
          배치 내보내기 연결 예정
        </button>
      </div>
    </section>
  );
}
