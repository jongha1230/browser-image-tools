# Processing limits

## Supported input formats

- JPEG
- PNG
- WebP

## Supported output formats

- Compress: original, JPEG, WebP
- Resize: original format 유지
- Convert: JPEG, PNG, WebP
- Remove EXIF: original format 재저장

## Current limits

- Max single file size: 20 MB
- Max batch file count: 20 files
- Max batch total size: 100 MB
- Max canvas dimension: 8,192 px on either side
- Max ZIP entries: 65,535
- Max ZIP entry size: 4 GiB minus 1 byte (classic ZIP limit)
- Max ZIP archive size: 512 MB browser-safe guard

## Why these limits exist

- 모든 처리가 현재 브라우저 메모리 안에서만 일어나기 때문에, 큰 파일과 긴 배치는 탭 멈춤이나 인코딩 실패로 이어질 수 있다.
- `Canvas`와 `OffscreenCanvas`는 브라우저마다 처리 가능한 해상도와 메모리 한계가 다르다.
- 현재 ZIP 구현은 classic store-only ZIP이며 ZIP64를 지원하지 않는다.

## User-facing behavior

- 지원하지 않는 형식은 업로드 단계에서 바로 거절한다.
- 파일당 20 MB, 최대 20개, 총 100 MB를 넘기면 Korean error message를 표시한다.
- 처리 중 캔버스 한계를 넘는 해상도는 “브라우저에서 안정적으로 처리하기 어렵다”는 메시지와 함께 중단한다.
- ZIP 한계를 넘기면 다운로드를 시작하지 않고 명확한 오류를 보여 준다.

## ZIP limitations

- Store-only ZIP
- ZIP64 not supported
- Entry count, entry size, central directory size, and local header offset are guarded for classic ZIP safety
- Archive size is further capped for browser memory safety

## Browser-specific notes

- Chromium 계열 브라우저를 우선 검증한다.
- Safari/Firefox는 미검증 API 차이로 인해 더 이른 실패가 발생할 수 있다.
- 모바일 브라우저는 데스크톱보다 메모리 한계에 먼저 도달할 수 있다.

## Practical advice

- 큰 배치는 먼저 대표 파일 1장으로 확인한 뒤 나눠서 처리한다.
- 긴 변이 큰 원본은 업로드 전에 한 번 더 줄이는 편이 안정적이다.
- ZIP이 필요한 경우에도 너무 큰 결과 묶음은 여러 번 나누는 편이 안전하다.
