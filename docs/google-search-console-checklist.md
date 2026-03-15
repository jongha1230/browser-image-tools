# Google Search Console Checklist

Google Search Console 등록은 현재 Production `vercel.app`를 임시 public canonical host로 사용하는 운영 상태를 기준으로 합니다. 현재 제출 대상은 `https://browser-image-tools.vercel.app` 하나입니다.

## 제출 전 고정값

- 속성 유형: URL 접두사 속성 `https://browser-image-tools.vercel.app`
- 제출 sitemap: `https://browser-image-tools.vercel.app/sitemap.xml`
- 검수용 feed: `https://browser-image-tools.vercel.app/rss.xml`
- 제출 제외 대상: Preview URL, 아직 연결되지 않은 custom domain, 임시 테스트 호스트

## 제출 전 확인

- `https://browser-image-tools.vercel.app/robots.txt`에 `Allow: /`, `Host: browser-image-tools.vercel.app`, `Sitemap: https://browser-image-tools.vercel.app/sitemap.xml`이 함께 노출되는지 확인
- `https://browser-image-tools.vercel.app/sitemap.xml`이 `200`으로 열리고 URL이 비어 있지 않은지 확인
- `https://browser-image-tools.vercel.app/sitemap.xml`의 `<loc>`가 모두 `https://browser-image-tools.vercel.app/` 기준인지, `/app/guides/`를 포함하지 않는지 확인
- `https://browser-image-tools.vercel.app/rss.xml`이 `200`으로 열리고 채널 링크, `atom:link`, 가이드 항목 `link`와 `guid`가 모두 같은 host를 쓰는지 확인
- `https://browser-image-tools.vercel.app/rss.xml`에도 `/app/guides/`가 남아 있지 않은지 확인
- 아래 대표 URL의 HTML에 `index, follow` robots 메타와 자기 자신을 가리키는 canonical이 있는지 확인
- 대표 URL
- `https://browser-image-tools.vercel.app/`
- `https://browser-image-tools.vercel.app/tools`
- `https://browser-image-tools.vercel.app/tools/compress-image`
- `https://browser-image-tools.vercel.app/guides`
- `https://browser-image-tools.vercel.app/guides/resize-or-compress-first`
- `https://browser-image-tools.vercel.app/privacy`
- `https://browser-image-tools.vercel.app/contact`

## 제출 순서

1. URL 접두사 속성 `https://browser-image-tools.vercel.app`를 추가합니다.
2. 운영 환경에서 소유권 확인 수단을 적용하고 확인을 완료합니다.
3. `https://browser-image-tools.vercel.app/sitemap.xml`을 제출합니다.
4. 대표 URL부터 URL 검사로 확인하고 필요 시 색인 생성 요청을 보냅니다.

## 제출 후 점검

- 대표 URL 검사에서 실제 수집 URL이 `https://browser-image-tools.vercel.app/...`로 유지되는지 확인
- canonical 항목에서 사용자 선언 canonical과 Google이 선택한 canonical이 모두 같은 host인지 확인
- `robots.txt` 차단, `noindex`, soft 404, 중복 페이지 경고가 생기지 않는지 확인
- sitemap 처리 상태가 성공으로 유지되는지 확인
- 첫 색인 요청 우선순위는 홈, `/tools`, `/tools/compress-image`, `/guides`, `/guides/resize-or-compress-first` 순으로 잡습니다.
- 렌더링 HTML에 제목, 설명, 본문 구조가 실제로 보이는지 URL 검사 렌더링 미리보기에서 확인
- 나중에 custom domain으로 옮기면 새 canonical host 기준으로 속성, sitemap, canonical, URL 검사를 전부 다시 실행

## 운영 메모

- Search Console에는 `rss.xml`을 제출하지 않지만, canonical host와 가이드 경로 이상 여부를 확인하는 운영 체크 포인트로 함께 봅니다.
- 모바일 사용성, 페이지 경험, 핵심 웹 지표 경고는 등록 직후부터 모니터링합니다.
- 구조화 데이터는 실제 필요와 검증이 끝난 뒤에만 추가합니다.
