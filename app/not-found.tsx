import Link from "next/link";

import { PageHero, PageLayout, PageSection } from "@/components/page-layout";

export default function NotFound() {
  return (
    <PageLayout
      breadcrumbs={[
        { href: "/", label: "홈" },
        { label: "404" },
      ]}
    >
      <PageHero eyebrow="Page Not Found" title="요청한 페이지를 찾을 수 없습니다">
        <p>
          주소가 변경됐거나 잘못 입력됐을 수 있습니다. 현재 제공 중인 실제 도구
          라우트와 가이드 허브에서 필요한 작업 경로를 다시 찾을 수 있습니다.
        </p>
        <div className="hero__actions">
          <Link className="button-link" href="/">
            홈으로 이동
          </Link>
          <Link className="button-muted" href="/tools">
            도구 허브 보기
          </Link>
        </div>
      </PageHero>

      <PageSection
        title="다음으로 이동할 수 있는 페이지"
        intro={<p>실제 운영 중인 핵심 라우트만 바로 다시 연결했습니다.</p>}
      >
        <div className="card-grid">
          <article className="card">
            <h2>이미지 도구 허브</h2>
            <p>압축, 크기 조절, 포맷 변환, EXIF 제거 도구를 한 곳에서 확인합니다.</p>
            <Link className="card__link" href="/tools">
              도구 허브 열기
            </Link>
          </article>
          <article className="card">
            <h2>가이드 허브</h2>
            <p>압축 기준, 포맷 선택, 개인정보 보호, 배치 리사이즈 가이드를 읽을 수 있습니다.</p>
            <Link className="card__link" href="/guides">
              가이드 허브 열기
            </Link>
          </article>
          <article className="card">
            <h2>서비스 소개</h2>
            <p>지원 범위, 로컬 처리 원칙, 광고 준비 방향을 다시 확인할 수 있습니다.</p>
            <Link className="card__link" href="/about">
              소개 페이지 열기
            </Link>
          </article>
        </div>
      </PageSection>
    </PageLayout>
  );
}
