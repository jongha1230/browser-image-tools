import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, PageLayout, PageSection } from "@/components/page-layout";
import { createPageMetadata, getPageMetadataEntry } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata(getPageMetadataEntry("/about"));

export default function AboutPage() {
  return (
    <PageLayout breadcrumbs={[{ href: "/", label: "홈" }, { label: "소개" }]}>
      <PageHero eyebrow="About" title="브라우저 안에서 끝내는 이미지 작업을 더 단순하게">
        <p>
          이 서비스는 이미지 압축, 크기 조절, 포맷 변환, EXIF 제거처럼 반복해서
          쓰는 작업을 한국어 UI와 설명 중심으로 빠르게 처리할 수 있게 만드는 것을
          목표로 합니다.
        </p>
        <p>
          무료 운영을 위해 광고 기반 수익 구조를 준비하되, 사용자 파일은 브라우저
          밖으로 보내지 않는 로컬 처리 원칙을 기본값으로 유지합니다.
        </p>
        <div className="hero__actions">
          <Link className="button-link" href="/tools">
            도구 허브 보기
          </Link>
          <Link className="button-muted" href="/privacy">
            개인정보 원칙 보기
          </Link>
        </div>
      </PageHero>

      <PageSection
        title="현재 제공 범위"
        intro={<p>홈과 도구 허브에서 바로 접근할 수 있는 MVP 범위는 다음과 같습니다.</p>}
      >
        <div className="detail-grid">
          <div className="card">
            <h3>핵심 도구</h3>
            <p>이미지 압축, 크기 조절, 포맷 변환, EXIF 제거 라우트와 배치 ZIP 내보내기를 제공합니다.</p>
          </div>
          <div className="card">
            <h3>브라우저 처리</h3>
            <p>파일 업로드, 로그인, 서버 저장 없이 현재 브라우저 메모리 안에서만 작업합니다.</p>
          </div>
          <div className="card">
            <h3>콘텐츠 허브</h3>
            <p>도구 선택 기준과 개인정보 보호 관점을 설명하는 가이드 문서를 함께 제공합니다.</p>
          </div>
          <div className="card">
            <h3>광고 준비</h3>
            <p>실제 광고 네트워크 연동 전 단계에서 정책 문구와 색인 구조를 먼저 정비하고 있습니다.</p>
          </div>
        </div>
      </PageSection>

      <PageSection title="서비스 원칙">
        <ul className="list-reset">
          <li>파일 처리 기능은 브라우저 안에서 끝나야 하며 원격 업로드를 전제로 하지 않습니다.</li>
          <li>해시 기반 가상 페이지 대신 각 도구와 가이드를 실제 URL로 제공해 검색과 공유를 쉽게 만듭니다.</li>
          <li>가짜 퍼블리셔 ID나 임시 광고 식별자를 만들지 않고, 실제 데이터가 생길 때만 정책과 기술 파일을 추가합니다.</li>
          <li>한국어 사용자가 먼저 이해할 수 있는 설명을 우선하고, UI와 본문 모두 실무적인 판단 기준을 제공합니다.</li>
        </ul>
      </PageSection>

      <PageSection title="다음 단계">
        <div className="card-grid">
          <article className="card">
            <h3>도구 세부 옵션 보강</h3>
            <p>현재 배치 처리 흐름 위에 도구별 프리셋과 안내 문구를 더 촘촘하게 붙일 예정입니다.</p>
          </article>
          <article className="card">
            <h3>광고·쿠키 고지 정식화</h3>
            <p>실제 광고 스크립트가 연결되면 개인정보 페이지와 광고 파일을 실데이터 기준으로 갱신합니다.</p>
          </article>
          <article className="card">
            <h3>가이드 확장</h3>
            <p>도구 사용법과 업로드 준비 체크리스트를 더 세분화해 검색 유입과 내부 링크를 넓힐 계획입니다.</p>
          </article>
        </div>
      </PageSection>
    </PageLayout>
  );
}
