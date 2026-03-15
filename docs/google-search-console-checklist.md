# Google Search Console Checklist

Google Search Console 등록 전에 현재 public canonical host와 배포 결과가 준비돼 있어야 합니다.

## 속성 등록

- public canonical host가 custom domain이면 도메인 속성 또는 URL 접두사 속성을 그 도메인 기준으로 추가
- public canonical host가 Production `vercel.app`이면 정확한 `https://<project>.vercel.app` URL 접두사 속성을 추가
- 소유권 확인 수단을 운영 환경에서 적용
- HTTPS 최종 도메인 하나로 정규화돼 있는지 확인

## 색인 준비

- `sitemap.xml` 제출
- `robots.txt`가 핵심 라우트를 차단하지 않는지 확인
- 홈, 도구 허브, 각 도구 상세, 가이드 허브, 핵심 가이드 URL을 우선 점검
- canonical URL이 현재 public canonical host 기준으로 올바른지 확인

## 수동 점검 대상 URL

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

## 제출 후 점검

- URL 검사에서 렌더링 HTML에 본문 설명과 제목 구조가 보이는지 확인
- 모바일 사용성 경고가 생기면 우선 수정
- 페이지 경험과 핵심 웹 지표 알림을 모니터링
- 구조화 데이터는 실제 필요와 검증이 끝난 뒤에만 추가
- 나중에 custom domain으로 옮기면 새 canonical host 기준으로 속성, sitemap, canonical을 다시 검증
