"use client";

import { useState } from "react";

type StepKey = "upload" | "options" | "export";

const stepLabels: Record<StepKey, string> = {
  upload: "파일 준비",
  options: "옵션 선택",
  export: "결과 저장",
};

type ToolShellProps = {
  title: string;
  description: string;
  primaryActionLabel: string;
};

export function ToolShell({
  title,
  description,
  primaryActionLabel,
}: ToolShellProps) {
  const [activeStep, setActiveStep] = useState<StepKey>("upload");

  const statusByStep: Record<StepKey, string> = {
    upload:
      "이 자리에는 로컬 파일 선택기와 드래그 앤 드롭 영역이 들어갑니다. 선택한 이미지는 브라우저 탭 안에서만 유지됩니다.",
    options:
      "압축 품질, 크기, 출력 포맷, 메타데이터 제거 여부 같은 옵션 패널이 이 단계에 연결됩니다.",
    export:
      "처리 결과 미리보기와 개별 다운로드, 배치 ZIP 내보내기 흐름이 이 단계에서 마무리됩니다.",
  };

  return (
    <section className="tool-shell" aria-labelledby="tool-shell-title">
      <div className="tool-shell__header">
        <div>
          <h2 id="tool-shell-title">{title} 작업 패널</h2>
          <p>{description}</p>
        </div>
        <span className="tool-shell__badge">브라우저 로컬 처리 예정</span>
      </div>

      <div className="tool-shell__step-list" role="tablist" aria-label="작업 흐름">
        {Object.entries(stepLabels).map(([key, label]) => {
          const stepKey = key as StepKey;

          return (
            <button
              key={stepKey}
              className="tool-shell__step"
              data-active={activeStep === stepKey}
              onClick={() => setActiveStep(stepKey)}
              role="tab"
              aria-selected={activeStep === stepKey}
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

