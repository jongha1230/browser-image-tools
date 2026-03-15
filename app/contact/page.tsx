import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, PageLayout, PageSection } from "@/components/page-layout";
import { repositoryIssuesUrl } from "@/lib/site-content";
import { createPageMetadata, getPageMetadataEntry } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata(getPageMetadataEntry("/contact"));

export default function ContactPage() {
  return (
    <PageLayout breadcrumbs={[{ href: "/", label: "홈" }, { label: "문의" }]}>
      <PageHero eyebrow="문의 안내" title="문제가 생겼을 때 빠르게 확인할 수 있는 문의 안내">
        <p>
          현재는 별도 문의 폼 없이 GitHub 이슈를 기본 연락 창구로 사용합니다.
          버그 제보나 지원 범위 문의를 남기면 확인 가능한 정보부터 검토합니다.
        </p>
        <p>
          민감한 원본 파일을 보내기보다는 브라우저 버전, 재현 단계, 오류 메시지
          같은 정보를 먼저 정리해 주는 편이 훨씬 도움이 됩니다.
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
        title="어떤 문의에 적합한가"
        intro={<p>원본 파일 공유 없이도 대부분의 문제는 아래 정보만으로 먼저 확인할 수 있습니다.</p>}
      >
        <div className="detail-grid">
          <div className="card">
            <h3>버그 제보</h3>
            <p>특정 브라우저에서 파일 업로드, 미리보기, 처리, ZIP 다운로드가 실패하는 경우를 받습니다.</p>
          </div>
          <div className="card">
            <h3>지원 범위 문의</h3>
            <p>지원 형식, 로컬 처리 방식, 개인정보 안내처럼 현재 서비스 범위에 대한 문의를 받습니다.</p>
          </div>
          <div className="card">
            <h3>제휴 및 운영 문의</h3>
            <p>정식 채널이 준비되기 전까지는 공개 저장소를 통해 확인 가능한 범위에서 먼저 답변합니다.</p>
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

      <PageSection title="현재 연락 방식">
        <ul className="list-reset">
          <li>정식 지원 메일이나 폼이 준비되면 이 페이지에 우선 공개합니다.</li>
          <li>문의 과정에서 원본 업로드를 기본 절차로 요구하지 않습니다.</li>
          <li>광고나 제휴 관련 정보도 실제로 확정된 내용만 안내합니다.</li>
          <li>지원 범위가 바뀌면 소개, 개인정보, 가이드 페이지와 함께 이 페이지도 갱신합니다.</li>
        </ul>
      </PageSection>
    </PageLayout>
  );
}
