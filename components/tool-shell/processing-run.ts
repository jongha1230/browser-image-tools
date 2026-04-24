import type { QueueItemState } from "./shared";

export function resetQueueStateAfterCancellation(
  queueState: Record<string, QueueItemState>,
) {
  return Object.fromEntries(
    Object.entries(queueState).map(([itemId, state]) => [
      itemId,
      state.status === "processing"
        ? ({ status: "queued" } satisfies QueueItemState)
        : state,
    ]),
  );
}

export function getProcessingCancellationMessage(successCount: number) {
  if (successCount > 0) {
    return `현재 배치 처리를 취소했습니다. 이미 완료된 ${successCount.toLocaleString("ko-KR")}개 결과는 그대로 두고, 남은 파일은 다시 실행할 수 있습니다.`;
  }

  return "현재 배치 처리를 취소했습니다. 파일이나 옵션을 바꾼 뒤 다시 시작할 수 있습니다.";
}
