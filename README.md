# 브라우저 이미지 툴

[![CI](https://github.com/jongha1230/browser-image-tools/actions/workflows/ci.yml/badge.svg)](https://github.com/jongha1230/browser-image-tools/actions/workflows/ci.yml)

브라우저 안에서 이미지 압축, 크기 조절, 포맷 변환, EXIF 정리, 배치 내보내기를 끝내는 한국어 중심 이미지 유틸리티 사이트입니다. 이 저장소는 실제 제품 형태를 염두에 둔 프론트엔드 포트폴리오 프로젝트이며, 파일 처리와 다운로드 준비를 모두 브라우저 안에서 끝내는 흐름을 구현합니다.

## 공개 데모

- Production demo: [https://browser-image-tools.vercel.app](https://browser-image-tools.vercel.app)
- Proof assets package: [docs/proof-assets.md](./docs/proof-assets.md)
- 캡처 기준일: 2026년 3월 15일, Vercel production alias 기준
- 현재 배포는 Production `vercel.app`를 임시 public canonical host로 사용하는 공개 제출 모드입니다.
- 이후 custom domain을 연결하면 Search Console, Search Advisor, canonical, sitemap 검증을 새 host 기준으로 다시 수행해야 합니다.

## 현재 구현된 기능

- 이미지 압축: JPEG, PNG, WebP를 다시 인코딩해 용량을 줄이거나 결과 변화를 비교합니다.
- 이미지 크기 조절: 가로·세로 입력, 비율 유지, 프리셋으로 여러 장의 해상도를 맞춥니다.
- 이미지 포맷 변환: JPEG, PNG, WebP 사이를 상호 변환합니다.
- EXIF 제거: 원본 형식으로 다시 저장해 메타데이터를 정리합니다.
- 배치 내보내기: 성공한 결과만 골라 개별 저장하거나 ZIP으로 내려받습니다.
- 가이드 콘텐츠: 압축 기준, 포맷 선택, 프라이버시, 배치 리사이즈 판단 기준을 설명합니다.

## 스크린샷

아래 이미지는 2026년 3월 15일에 production demo를 Playwright CLI로 다시 캡처했습니다. 데스크톱은 `1440x900`, 모바일은 `390x844` 뷰포트를 사용했습니다.

| 홈 | 압축 워크플로 |
| --- | --- |
| ![홈 화면](./docs/screenshots/home-desktop.png) | ![압축 도구 워크플로](./docs/screenshots/compress-workflow.png) |
| 처리 결과 | 모바일 홈 |
| ![압축 결과 상태](./docs/screenshots/compress-result.png) | ![모바일 홈 화면](./docs/screenshots/home-mobile.png) |

압축 결과 캡처는 PNG 무손실 재저장 예시라 결과 파일이 더 커진 실제 케이스를 그대로 보여 줍니다. 더 좋아 보이는 숫자를 만들기보다, UI가 불리한 결과도 그대로 드러내는지 확인하는 데 초점을 맞췄습니다.

## 왜 브라우저 로컬 처리가 중요한가

- 업로드한 이미지가 서버로 전송되지 않아 민감한 파일을 다룰 때 부담이 적습니다.
- 로그인, 파일 보관, 클라우드 저장 없이 바로 작업하고 끝낼 수 있습니다.
- 처리 결과를 확인한 뒤 필요한 파일만 직접 저장하므로 흐름이 단순합니다.
- 무료 광고 기반 운영을 검토하더라도 파일 내용 처리 자체는 브라우저 안에 남기는 방향을 유지할 수 있습니다.

## 기술 구성과 접근 방식

- Next.js App Router
- TypeScript
- React 19
- 서버 렌더링된 설명형 페이지 + 클라이언트 전용 도구 셸
- 브라우저 Canvas 기반 이미지 처리
- Web Worker 우선, 메인 스레드 폴백 처리
- 브라우저 메모리 내 배치 ZIP 생성
- Vitest 기반 유틸리티 테스트

도구 페이지는 초기 응답에서 설명 콘텐츠를 먼저 렌더링하고, 실제 파일 처리 UI는 클라이언트에서 이어 붙입니다. 각 도구가 검색 가능한 독립 페이지로 동작하면서도, 파일 처리는 끝까지 브라우저 안에 머무를 수 있습니다. 처리 경로 다이어그램과 캡처 근거는 [docs/proof-assets.md](./docs/proof-assets.md)에 정리했습니다.

## 브라우저 지원 / 알려진 제한

- 2026년 3월 15일 기준 manual smoke check 범위는 production demo의 Chromium 캡처 흐름입니다.
- 현재 구현은 Canvas, Blob, `URL.createObjectURL`, Web Worker, 다운로드 링크를 지원하는 최신 브라우저를 전제로 합니다.
- Web Worker 초기화가 불가능하거나 실패하면 메인 스레드 폴백 경로로 같은 처리 파이프라인을 실행합니다.
- 매우 큰 파일이나 대량 배치는 브라우저 메모리와 기기 성능에 직접 영향을 받습니다.
- 지원 형식은 JPEG, PNG, WebP에 한정됩니다.
- 백엔드 업로드, 계정, 데이터베이스, 클라우드 동기화, PDF, HEIC, RAW, 비디오, 엔드유저 AI 기능은 포함하지 않습니다.

자세한 제한 사항은 [docs/known-limitations.md](./docs/known-limitations.md)를 확인하면 됩니다.

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열면 됩니다.

### 주요 명령어

- `npm run dev`: 개발 서버 실행
- `npm run lint`: ESLint 실행
- `npm run typecheck`: TypeScript 검사
- `npm run test`: Vitest 실행
- `npm run build`: 프로덕션 빌드
- `npm run start`: 프로덕션 서버 실행

## Vercel 배포 메모

- 공개 데모 단계에서는 Vercel Production 배포를 안정적인 공유용 `vercel.app` 주소로 사용합니다.
- 현재 운영 기준은 Production `vercel.app`를 임시 public canonical host로 두고, Production 환경 변수 `SITE_URL`과 `NEXT_PUBLIC_SITE_URL`을 정확한 `https://browser-image-tools.vercel.app` 원본으로 맞추고 `ALLOW_VERCEL_APP_INDEXING=true`를 함께 두는 방식입니다.
- 이 모드에서는 canonical, `robots.txt`, `sitemap.xml`, `rss.xml`, Open Graph URL이 모두 Production `vercel.app` 기준으로 열리고, Preview는 계속 비색인으로 유지해야 합니다.
- demo-first 운영으로 되돌리려면 `SITE_URL`, `NEXT_PUBLIC_SITE_URL`, `ALLOW_VERCEL_APP_INDEXING`를 모두 비워 두고 `noindex`, 전체 차단 `robots.txt`, 빈 `sitemap.xml`, `404` `rss.xml`이 복구되는지 다시 확인합니다.
- 최종 도메인을 연결한 뒤에는 Production 환경 변수 `SITE_URL`과 `NEXT_PUBLIC_SITE_URL`을 같은 `https://` 커스텀 원본으로 바꾸고, `ALLOW_VERCEL_APP_INDEXING`는 비우거나 `false`로 돌리는 편이 명확합니다.
- 자세한 운영 절차는 [docs/vercel-launch.md](./docs/vercel-launch.md)를 확인하면 됩니다.

## 문서

- [Proof assets package](./docs/proof-assets.md)
- [브라우저 지원 / known limitations](./docs/known-limitations.md)
- [제품 범위](./docs/product-scope.md)
- [라우트 맵](./docs/route-map.md)
- [Vercel launch guide](./docs/vercel-launch.md)
