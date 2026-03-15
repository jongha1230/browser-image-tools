# Naver Search Advisor Checklist

네이버 등록은 현재 public canonical host가 실제로 노출되는 배포 후 진행합니다.

## 사이트 등록

- Search Advisor에 현재 public canonical host 등록
- 웹마스터 확인 절차 완료
- 대표 도메인과 리다이렉트 정책을 먼저 정리

## 수집 준비

- `robots.txt`와 `sitemap.xml` 제출
- 홈, 도구 허브, 각 도구 상세 URL이 직접 접근 가능한지 확인
- 브라우저 렌더링 이후에도 핵심 설명 HTML이 본문에 남아 있는지 확인

## 우선 확인 URL

- `/`
- `/tools`
- `/tools/compress-image`
- `/tools/resize-image`
- `/tools/convert-image`
- `/tools/remove-exif`
- `/guides`
- `/privacy`

## 운영 체크

- 대표 제목과 설명이 중복되지 않는지 확인
- 한국어 본문이 너무 짧거나 중복되지 않는지 확인
- 문의, 개인정보, 소개 페이지 링크가 누락되지 않았는지 확인
- 네이버 수집 로그와 검색 노출 변화를 배포 후 초기에 자주 확인
- 나중에 custom domain으로 옮기면 canonical, `robots.txt`, `sitemap.xml`을 새 호스트 기준으로 다시 점검
