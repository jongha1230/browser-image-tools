# Naver Search Advisor Checklist

네이버 등록은 현재 Production `vercel.app`를 임시 public canonical host로 사용하는 운영 상태를 기준으로 진행합니다. 현재 제출 대상은 `https://browser-image-tools.vercel.app` 하나입니다.

## 제출 전 고정값

- 제출 사이트: `https://browser-image-tools.vercel.app`
- 제출 sitemap: `https://browser-image-tools.vercel.app/sitemap.xml`
- 확인용 robots: `https://browser-image-tools.vercel.app/robots.txt`
- 검수용 feed: `https://browser-image-tools.vercel.app/rss.xml`
- 제출 제외 대상: Preview URL, 아직 연결되지 않은 custom domain, 임시 테스트 호스트

## 제출 전 확인

- `https://browser-image-tools.vercel.app/robots.txt`가 `Allow: /`를 반환하고 sitemap 위치를 같은 host로 가리키는지 확인
- `https://browser-image-tools.vercel.app/sitemap.xml`이 비어 있지 않고 모든 URL이 `https://browser-image-tools.vercel.app/` 기준인지 확인
- `https://browser-image-tools.vercel.app/sitemap.xml`에 `/app/guides/`가 섞여 있지 않은지 확인
- `https://browser-image-tools.vercel.app/rss.xml`이 `200`으로 열리고 가이드 링크가 모두 `/guides/...` 공개 경로인지 확인
- 아래 대표 URL이 직접 접근 가능하고 HTML에 설명형 본문, `index, follow`, 자기 자신을 가리키는 canonical이 있는지 확인
- 대표 URL
- `https://browser-image-tools.vercel.app/`
- `https://browser-image-tools.vercel.app/tools`
- `https://browser-image-tools.vercel.app/tools/compress-image`
- `https://browser-image-tools.vercel.app/guides`
- `https://browser-image-tools.vercel.app/guides/resize-or-compress-first`
- `https://browser-image-tools.vercel.app/privacy`

## 제출 순서

1. Search Advisor에 `https://browser-image-tools.vercel.app` 사이트를 등록합니다.
2. 웹마스터 확인 절차를 완료합니다.
3. `robots.txt`와 `sitemap.xml`을 같은 host 기준으로 등록합니다.
4. 홈, 도구 허브, 대표 도구, 가이드 허브, 대표 가이드 URL부터 수집 확인을 진행합니다.

## 제출 후 점검

- 수집 결과에 표시되는 URL host가 계속 `browser-image-tools.vercel.app`인지 확인
- sitemap 처리 결과와 수집 로그에 `/app/guides/`가 나타나지 않는지 확인
- robots 차단, noindex, 연결 실패, 중복 페이지 같은 경고가 없는지 확인
- 우선 확인 순서는 홈, `/tools`, `/tools/compress-image`, `/guides`, `/guides/resize-or-compress-first`로 잡습니다.
- 제목과 설명이 중복 없이 노출되는지, 한국어 본문이 너무 짧지 않은지 확인
- 첫 수집 이후에도 `robots.txt`, `sitemap.xml`, `rss.xml`을 다시 열어 host와 경로가 바뀌지 않았는지 확인
- 나중에 custom domain으로 옮기면 canonical, `robots.txt`, `sitemap.xml`, Search Advisor 등록을 새 호스트 기준으로 다시 점검

## 운영 메모

- 문의, 개인정보, 소개 페이지 링크가 누락되지 않았는지 계속 확인합니다.
- 네이버 수집 로그와 검색 노출 변화는 배포 후 초기에 자주 확인합니다.
- `rss.xml`은 제출 대상은 아니지만 가이드 경로 이상 여부를 빨리 확인하는 운영 체크 포인트로 유지합니다.
