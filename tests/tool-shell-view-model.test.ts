import { describe, expect, it } from "vitest";

import {
  buildQueueSummaryRows,
  buildSelectedResultRows,
  buildToolStatusCopy,
  getWorkflowStatus,
} from "../components/tool-shell/view-model";

describe("tool shell view model", () => {
  it("builds queue summary rows for an empty queue", () => {
    expect(
      buildQueueSummaryRows({
        itemsLength: 0,
        hasItems: false,
        totalSize: 0,
        hasResults: false,
        successCount: 0,
        errorCount: 0,
      }),
    ).toEqual([
      { label: "준비 파일", value: "0개" },
      { label: "총 업로드 용량", value: "0 B" },
      { label: "성공 / 실패", value: "아직 없음" },
    ]);
  });

  it("derives workflow status tone from processing outcomes", () => {
    expect(
      getWorkflowStatus({
        isProcessing: true,
        hasResults: false,
        successCount: 0,
      }),
    ).toEqual({
      tone: "processing",
      label: "처리 중",
    });

    expect(
      getWorkflowStatus({
        isProcessing: false,
        hasResults: true,
        successCount: 0,
      }),
    ).toEqual({
      tone: "error",
      label: "실패",
    });
  });

  it("keeps resize validation guidance in the options step copy", () => {
    expect(
      buildToolStatusCopy({
        activeStep: "options",
        conversionOutputFormat: "image/webp",
        errorCount: 0,
        fileCountLabel: "1개 파일 준비됨",
        hasResults: false,
        isCompressTool: false,
        isConvertQualityEnabled: true,
        isConvertTool: false,
        isRemoveExifTool: false,
        isResizeTool: true,
        itemsLength: 1,
        keepAspectRatio: true,
        quality: 82,
        repeatActionMessage: null,
        resizeTargetDimensions: null,
        resizeValidationMessage: "가로와 세로 값을 모두 입력해 주세요.",
        successCount: 0,
        targetMimeType: null,
      }).currentStepMessage,
    ).toContain("가로와 세로 값을 모두 입력해 주세요.");
  });

  it("includes original format details for successful convert results", () => {
    const selectedItem = {
      id: "item-1",
      file: new File(["source"], "photo.png", { type: "image/png" }),
      previewUrl: "blob:preview",
      typeLabel: "PNG",
    };
    const rows = buildSelectedResultRows({
      selectedItem,
      selectedMimeType: "image/png",
      selectedResult: {
        blob: new Blob(["converted"], { type: "image/webp" }),
        fileName: "photo-converted.webp",
        mimeType: "image/webp",
        width: 1200,
        height: 800,
        originalWidth: 1200,
        originalHeight: 800,
        fillBackground: false,
      },
      toolVariant: "convert",
    });

    expect(rows).toContainEqual({
      label: "원본 형식",
      value: "PNG",
    });
    expect(rows).toContainEqual({
      label: "저장 이름",
      value: "photo-converted.webp",
    });
  });
});
