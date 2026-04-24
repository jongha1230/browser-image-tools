import { describe, expect, it } from "vitest";

import {
  getProcessingCancellationMessage,
  resetQueueStateAfterCancellation,
} from "../components/tool-shell/processing-run";

describe("tool shell processing cancellation helpers", () => {
  it("keeps completed rows and resets in-flight rows back to queued", () => {
    expect(
      resetQueueStateAfterCancellation({
        first: { status: "processing" },
        second: { status: "success", result: { fileName: "done.webp" } as never },
        third: { status: "error", errorMessage: "failed" },
        fourth: { status: "queued" },
      }),
    ).toEqual({
      first: { status: "queued" },
      second: { status: "success", result: { fileName: "done.webp" } },
      third: { status: "error", errorMessage: "failed" },
      fourth: { status: "queued" },
    });
  });

  it("returns user-facing cancellation messages for empty and partial completions", () => {
    expect(getProcessingCancellationMessage(0)).toContain("현재 배치 처리를 취소했습니다");
    expect(getProcessingCancellationMessage(2)).toContain("이미 완료된 2개 결과");
  });
});
