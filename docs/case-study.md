# browser-image-tools case study

## Problem

업로드 직전 이미지를 압축하거나 크기를 맞추고 EXIF를 정리하는 작업은 자주 반복되지만, 많은 도구가 서버 업로드를 전제로 하거나 한 번에 한 장만 다루는 흐름에 머뭅니다.

## Goal

브라우저만으로 여러 장의 이미지를 안전하게 정리하고, 결과를 비교한 뒤 필요한 파일만 다운로드할 수 있는 한국어 중심 도구를 만든다. 포트폴리오 관점에서는 "브라우저 API를 현실적인 제약 안에서 다룰 줄 아는 프론트엔드 엔지니어"라는 신호를 보여 주는 것이 핵심이다.

## Architecture

- Next.js App Router로 각 도구를 독립 라우트로 구성했다.
- 설명형 HTML은 서버 렌더링으로 먼저 노출하고, 실제 처리 UI는 공통 `ToolShell` 클라이언트 컴포넌트가 담당한다.
- 파일 업로드 검증, 이미지 처리 계획 수립, Canvas 기반 재인코딩, ZIP 생성은 `lib/`의 순수 로직으로 분리했다.
- 처리 경로는 Web Worker 우선, 메인 스레드 폴백 구조다.

## Why local-only processing

- 이미지 원본을 서버에 보내지 않아도 되므로 프라이버시 약속이 명확하다.
- 로그인, 업로드 대기, 임시 저장소가 필요 없어 사용 흐름이 짧다.
- 포트폴리오 관점에서도 브라우저 제약을 직접 다룬 설계 판단을 설명하기 좋다.

## Why Canvas and Web Worker

- Canvas는 브라우저 안에서 압축, 포맷 변환, 크기 조절, EXIF 제거용 재저장을 공통 처리하기 좋은 기본 도구다.
- Web Worker는 긴 배치 작업에서 메인 스레드 점유를 줄이는 실용적인 선택이다.
- 다만 모든 브라우저가 `OffscreenCanvas`나 `convertToBlob`를 동일하게 지원하지 않으므로 메인 스레드 폴백을 유지했다.

## Key technical decisions

- 업로드 단계에서 파일 크기, 배치 개수, 총 용량을 미리 검증한다.
- 처리 단계에서 캔버스 해상도 제한을 다시 확인해 브라우저 메모리 실패를 줄인다.
- ZIP은 classic store-only 구조로 유지하고, ZIP64를 지원하지 않는 한계를 코드와 문서에 명시한다.
- `runId` 기반 stale-result 방어와 취소 동작으로 오래된 비동기 결과가 현재 UI를 덮지 못하게 했다.

## Trade-offs

- 지원 포맷은 JPEG, PNG, WebP로 제한했다.
- 대용량 원본과 긴 배치는 명시적으로 제한한다. 더 공격적인 자동 최적화보다 예측 가능한 실패가 중요했다.
- ZIP 압축률보다는 브라우저 내부 안정성과 단순성을 우선해 store-only 구현을 유지했다.

## Edge cases handled

- 잘못된 형식, 중복 파일, 개별 파일 상한, 총 배치 용량 초과
- 캔버스 해상도 한계 초과
- ZIP entry count / 4GiB entry / archive size / classic ZIP offset 경계
- Worker 미지원 환경의 메인 스레드 폴백
- 처리 중 취소 이후 늦게 도착한 결과 무시

## Testing strategy

- Vitest로 limits, 업로드 검증, ZIP layout, 리사이즈/처리 helper를 검증한다.
- Playwright로 압축, 리사이즈, 포맷 변환, EXIF 제거, 배치 ZIP, 잘못된 입력, limit violation을 브라우저에서 확인한다.
- E2E는 테스트 내부에서 생성한 작은 파일 버퍼를 사용해 fixture 의존성을 줄였다.

## Known limitations

- Chromium 계열 브라우저가 공개 검증 기준이다.
- Safari/Firefox는 필요한 API가 모두 동작하면 사용할 수 있지만 폭넓은 수동 검증을 약속하지 않는다.
- ZIP64를 지원하지 않는다.
- 브라우저 메모리 한계 때문에 매우 큰 이미지나 긴 배치는 의도적으로 제한한다.

## What I learned

- 브라우저 파일 처리 제품은 "기능 추가"보다 "어디서 멈추게 할지"를 먼저 설계해야 안정적이다.
- Web Worker를 쓴다고 끝이 아니라, 지원 여부와 폴백 UX까지 함께 다뤄야 실사용 흐름이 매끄럽다.
- 로컬 전용 제품일수록 한계를 숨기지 않고 문서화하는 편이 오히려 신뢰를 높인다.

## Interview talking points

- 서버 업로드 없이도 이미지 처리 UX를 완성하기 위해 Canvas, Blob, Worker, ZIP 생성 흐름을 어떻게 조합했는지 설명할 수 있다.
- browser memory limit와 classic ZIP 한계를 코드로 어떻게 방어했는지 설명할 수 있다.
- worker-first / main-thread fallback 구조와 그 이유를 설명할 수 있다.
- E2E를 “보여주기용”이 아니라 실제 주요 사용자 흐름 증명 용도로 어떻게 설계했는지 설명할 수 있다.
- 지원 범위와 한계를 과장하지 않고 문서화한 이유를 설명할 수 있다.
