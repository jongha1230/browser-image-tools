"use client";

type UploadErrorMessage = {
  id: string;
  message: string;
};

type ToolShellStatusMessagesProps = {
  clearErrors: () => void;
  errors: UploadErrorMessage[];
  processingError: string | null;
  processingErrorId: string;
  processingNote: string | null;
  processingNoteId: string;
  uploadMessagesId: string;
};

export function ToolShellStatusMessages({
  clearErrors,
  errors,
  processingError,
  processingErrorId,
  processingNote,
  processingNoteId,
  uploadMessagesId,
}: ToolShellStatusMessagesProps) {
  return (
    <>
      {errors.length > 0 ? (
        <div
          aria-atomic="true"
          aria-live="assertive"
          className="tool-shell__message"
          id={uploadMessagesId}
          role="alert"
        >
          <div className="tool-shell__message-header">
            <strong>확인할 업로드 메시지</strong>
            <button className="button-muted" onClick={clearErrors} type="button">
              업로드 메시지 지우기
            </button>
          </div>
          <ul className="list-reset tool-shell__message-list">
            {errors.map((error) => (
              <li key={error.id}>{error.message}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {processingError ? (
        <div
          aria-atomic="true"
          aria-live="assertive"
          className="tool-shell__message"
          id={processingErrorId}
          role="alert"
        >
          <strong>처리를 진행할 수 없습니다</strong>
          <p>{processingError}</p>
        </div>
      ) : null}

      {processingNote ? (
        <div
          aria-live="polite"
          className="tool-shell__message"
          id={processingNoteId}
          role="status"
        >
          <strong>처리 엔진 안내</strong>
          <p>{processingNote}</p>
        </div>
      ) : null}
    </>
  );
}
