# Launch Checklist

배포 직전에 반복 확인할 항목만 남긴 체크리스트입니다. 실제 운영 정보가 없는 항목은 비워 두고, 가짜 퍼블리셔 ID나 임의 데이터는 추가하지 않습니다.

## 품질 게이트

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`
- 데스크톱 `1440x900`과 모바일 `390x844`에서 홈, 도구 허브, 핵심 도구 라우트 수동 확인
- 업로드, 옵션 변경, 배치 실행, 개별 다운로드, ZIP 다운로드 흐름 확인

## 배포 전 확인

- 공유용 링크가 Preview URL이 아니라 프로젝트의 안정적인 Production `vercel.app` 주소인지 확인
- 공개 데모가 필요한 경우 Vercel Authentication 또는 배포 보호가 Production에 걸려 있지 않은지 확인
- canonical public host 전략이 무엇인지 먼저 고정하기
- demo-first 운영이면 `SITE_URL`, `NEXT_PUBLIC_SITE_URL`, `ALLOW_VERCEL_APP_INDEXING`를 비워 두고 `noindex`와 크롤링 차단이 유지되는지 확인
- Production `vercel.app`를 임시 public canonical host로 쓰면 `SITE_URL`과 `NEXT_PUBLIC_SITE_URL`이 정확한 Production `https://<project>.vercel.app` 원본인지, `ALLOW_VERCEL_APP_INDEXING=true`가 Production에만 설정됐는지 확인
- custom domain 운영이면 `SITE_URL`과 `NEXT_PUBLIC_SITE_URL`이 최종 `https://` 도메인과 정확히 일치하는지 확인
- public canonical 모드에서는 `robots.txt`, `sitemap.xml`, `rss.xml`이 같은 canonical host 기준으로 노출되는지 확인
- 홈, 도구, 가이드, 소개, 개인정보, 문의 페이지 메타데이터와 canonical이 현재 public host 전략과 일치하는지 확인
- `icon.svg`와 Apple 터치 아이콘이 브라우저 탭과 홈 화면 저장 시 정상 노출되는지 확인

## 정책 및 운영

- 개인정보 페이지가 현재 기능 범위와 일치하는지 확인
- 광고 스크립트, 분석 스크립트, `ads.txt`를 실제 운영 정보 없이 추가하지 않았는지 확인
- 문의 페이지 링크와 공개 저장소 이슈 URL이 유효한지 확인
- 알려진 제한 사항과 다음 단계 문서가 최신 상태인지 확인

## 출시 직후 확인

- 배포 직후 홈과 각 도구 라우트가 정상 응답하는지 확인
- 첫 색인 요청 대상 URL 목록을 Google Search Console과 Naver Search Advisor에 등록
- 모바일에서 첫 화면 스크롤과 입력 반응이 과하게 무겁지 않은지 다시 확인
- 사용자 문의용 이슈 템플릿 또는 기본 응답 문구를 운영 채널에 준비
