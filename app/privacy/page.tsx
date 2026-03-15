import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, PageLayout, PageSection } from "@/components/page-layout";
import { createPageMetadata, getPageMetadataEntry } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata(getPageMetadataEntry("/privacy"));

export default function PrivacyPage() {
  return (
    <PageLayout breadcrumbs={[{ href: "/", label: "홈" }, { label: "개인정보" }]}>
      <PageHero eyebrow="Privacy" title="파일은 브라우저 안에서만 처리하고, 광고 고지는 실제 연동 후에만 추가합니다">
        <p>
          현재 서비스 범위에서는 사용자가 올린 이미지 파일을 서버에 저장하거나
          별도 계정에 연결하지 않습니다. 압축, 리사이즈, 포맷 변환, EXIF 제거는
          현재 브라우저 탭 안에서만 처리됩니다.
        </p>
        <p>
          향후 광고와 기본 방문 통계를 연결하더라도 파일 내용 자체를 전송하는
          기능은 범위에 포함하지 않으며, 실제 도입 시 이 페이지에 고지 항목을
          구체적으로 업데이트합니다.
        </p>
        <div className="hero__actions">
          <Link className="button-link" href="/tools">
            도구 허브 보기
          </Link>
          <Link className="button-muted" href="/contact">
            문의 안내 보기
          </Link>
        </div>
      </PageHero>

      <PageSection
        title="현재 명시하는 처리 원칙"
        intro={<p>실제 기능 범위와 개인정보 기대치를 먼저 명확하게 적어 둡니다.</p>}
      >
        <ul className="list-reset">
          <li>이미지 파일은 원격 서버로 전송하지 않으며, 브라우저 로컬 처리 흐름을 기본값으로 유지합니다.</li>
          <li>로그인, 데이터베이스, 클라우드 업로드, 파일 보관 이력 기능은 현재 범위에 포함하지 않습니다.</li>
          <li>브라우저 재인코딩 과정에서 메타데이터가 제거될 수 있으며, 결과 파일은 사용자가 직접 저장할 때만 기기에 남습니다.</li>
          <li>문의나 버그 제보 시에도 원본 파일 전송을 요구하지 않는 방향을 우선합니다.</li>
        </ul>
      </PageSection>

      <PageSection
        title="광고와 쿠키 고지 예정 사항"
        intro={
          <p>
            광고 기반 무료 운영을 준비하고 있지만, 실제 퍼블리셔 정보가 없는
            상태에서 임의의 고지나 식별자를 만들지는 않습니다.
          </p>
        }
      >
        <div className="detail-grid">
          <div className="card">
            <h3>현재 상태</h3>
            <p>실제 광고 스크립트, 퍼블리셔 ID, 쿠키 제공사 목록은 아직 연결되지 않았습니다.</p>
          </div>
          <div className="card">
            <h3>추후 공개 항목</h3>
            <p>광고 네트워크명, 쿠키 목적, 보관 기간, 거부 방법, 정책 시행일을 실제 정보 기준으로 추가합니다.</p>
          </div>
          <div className="card">
            <h3>ads.txt 처리 기준</h3>
            <p>실제 퍼블리셔 ID가 발급되기 전에는 `ads.txt`를 게시하지 않습니다. 가짜 ID나 예시 데이터는 사용하지 않습니다.</p>
          </div>
          <div className="card">
            <h3>파일 내용과 광고</h3>
            <p>광고 도입 시에도 업로드한 이미지 자체를 원격 분석 대상으로 삼는 기능은 현재 계획 범위에 없습니다.</p>
          </div>
        </div>
      </PageSection>

      <PageSection title="사용자가 알아두면 좋은 점">
        <ul className="list-reset">
          <li>로컬 처리라도 브라우저 메모리와 다운로드 폴더에는 결과 파일이 남을 수 있으므로 공용 PC에서는 작업 후 파일 정리를 권장합니다.</li>
          <li>EXIF 제거는 메타데이터 정리에 도움이 되지만 사진 안에 직접 찍힌 주소, 얼굴, 번호판 같은 시각 정보까지 자동으로 숨기지는 않습니다.</li>
          <li>정책 변경이 생기면 홈과 개인정보 페이지, 기술 파일(`robots.txt`, `sitemap.xml`, `rss.xml`)을 함께 갱신합니다.</li>
        </ul>
      </PageSection>
    </PageLayout>
  );
}
