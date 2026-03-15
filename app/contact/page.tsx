import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, PageLayout, PageSection } from "@/components/page-layout";
import { repositoryIssuesUrl } from "@/lib/site-content";
import { createPageMetadata, getPageMetadataEntry } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata(getPageMetadataEntry("/contact"));

export default function ContactPage() {
  return (
    <PageLayout breadcrumbs={[{ href: "/", label: "홈" }, { label: "문의" }]}>
      <PageHero eyebrow="Contact" title="버그 제보, 운영 문의, 광고 제휴 문의 전 확인할 안내">
        <p>
          현재는 별도 문의 폼이나 백엔드 없이 운영되므로, 정식 채널이 확정되기
          전까지는 공개 저장소 이슈와 정책 페이지를 기준으로 문의 흐름을
          안내합니다.
        </p>
        <p>
          원본 파일 업로드를 요구하지 않는 방향을 우선하며, 재현 가능한 정보와
          환경 설명을 함께 보내 주면 검토가 훨씬 빨라집니다.
        </p>
        <div className="hero__actions">
          <a
            className="button-link"
            href={repositoryIssuesUrl}
            rel="noreferrer"
            target="_blank"
          >
            GitHub 이슈 열기
          </a>
          <Link className="button-muted" href="/privacy">
            개인정보 원칙 보기
          </Link>
        </div>
      </PageHero>

      <PageSection
        title="어떤 문의를 받는가"
        intro={<p>현재 페이지는 최소한의 연락 지점이 아니라, 문의 유형과 준비 항목을 먼저 설명하는 역할을 합니다.</p>}
      >
        <div className="detail-grid">
          <div className="card">
            <h3>버그 제보</h3>
            <p>특정 브라우저에서 파일 업로드, 미리보기, 처리, ZIP 다운로드가 실패하는 경우를 받습니다.</p>
          </div>
          <div className="card">
            <h3>운영 문의</h3>
            <p>지원 형식, 로컬 처리 방식, 정책 문구, 배포 계획처럼 서비스 범위에 대한 문의를 받습니다.</p>
          </div>
          <div className="card">
            <h3>광고·제휴 문의</h3>
            <p>광고 슬롯 운영, 정책 고지, 제휴 가능성처럼 실제 운영 준비와 관련된 문의를 구분해 확인합니다.</p>
          </div>
        </div>
      </PageSection>

      <PageSection title="문의 시 함께 보내면 좋은 정보">
        <ul className="list-reset">
          <li>사용한 브라우저 이름과 버전, 운영체제, 문제가 생긴 도구 URL</li>
          <li>입력 파일 형식(JPEG, PNG, WebP)과 대략적인 파일 크기, 장수</li>
          <li>선택한 옵션과 기대한 결과, 실제로 나타난 메시지 또는 증상</li>
          <li>민감한 파일은 첨부하지 말고, 가능하면 재현 가능한 샘플만 별도로 준비하기</li>
        </ul>
      </PageSection>

      <PageSection title="현재 운영 원칙">
        <ul className="list-reset">
          <li>정식 지원 메일과 폼이 준비되면 이 페이지에 우선 공개합니다.</li>
          <li>문의 과정에서 원본 업로드를 기본 절차로 요구하지 않습니다.</li>
          <li>광고 관련 문의도 실제 퍼블리셔 정보가 준비되기 전에는 임시 식별자나 가상 자료를 제공하지 않습니다.</li>
          <li>정책과 지원 범위가 바뀌면 소개, 개인정보, 가이드 페이지와 함께 이 페이지도 갱신합니다.</li>
        </ul>
      </PageSection>
    </PageLayout>
  );
}
