# browser-image-tools

한국어 중심, 광고 기반 이미지 유틸리티 사이트의 초기 Next.js App Router 스캐폴드입니다.

## 원칙

- 이미지 파일 처리는 브라우저 안에서만 수행합니다.
- 백엔드, 인증, 데이터베이스, 클라우드 업로드를 두지 않습니다.
- 메인 도구는 실제 라우트와 개별 메타데이터를 가집니다.

## 포함된 라우트

- `/`
- `/tools`
- `/tools/compress-image`
- `/tools/resize-image`
- `/tools/convert-image`
- `/tools/remove-exif`
- `/guides`
- `/about`
- `/privacy`
- `/contact`

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 열면 됩니다.

## 스크립트

- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션 빌드
- `npm run start`: 프로덕션 서버 실행
- `npm run lint`: ESLint 실행
- `npm run typecheck`: TypeScript 검사
- `npm run test`: Vitest 실행

## 문서

- [제품 범위](./docs/product-scope.md)
- [라우트 맵](./docs/route-map.md)

