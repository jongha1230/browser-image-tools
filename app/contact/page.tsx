import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, PageLayout, PageSection } from "@/components/page-layout";
import {
  contactEmail,
  contactEmailHref,
  repositoryIssuesUrl,
} from "@/lib/site-content";
import { createPageMetadata, getPageMetadataEntry } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata(getPageMetadataEntry("/contact"));

export default function ContactPage() {
  return (
    <PageLayout breadcrumbs={[{ href: "/", label: "홈" }, { label: "문의" }]}>
      <PageHero eyebrow="문의 안내" title="프로젝트 연락처와 지원 경로를 한눈에 확인할 수 있는 문의 안내">
        <p>
          프로젝트 관련 문의는{" "}
          <a href={contactEmailHref}>{contactEmail}</a>
          로 받고 있습니다. 공개 데모 운영 단계이므로 제품 범위, 사용 문의,
          운영 연락을 같은 주소에서 함께 확인합니다.
        </p>
        <p>
          재현 가능한 버그나 공개 추적이 더 적합한 경우에는 GitHub Issues도
          계속 보조 채널로 사용합니다. 민감한 원본 파일 대신 브라우저 버전,
          재현 단계, 오류 메시지를 먼저 보내 주는 편이 훨씬 도움이 됩니다.
        </p>
        <div className="hero__actions">
          <a className="button-link" href={contactEmailHref}>
            프로젝트 이메일 보내기
          </a>
          <a
            className="button-muted"
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
        title="현재 연락 채널"
        intro={<p>이메일을 기본 창구로 두고, 공개 이슈 추적이 필요한 경우에만 GitHub Issues를 함께 사용합니다.</p>}
      >
        <div className="detail-grid">
          <div className="card">
            <h3>프로젝트 이메일</h3>
            <p>일반 문의, 운영 연락, 현재 지원 범위 확인은 프로젝트 이메일 한 곳에서 먼저 받습니다.</p>
            <a className="card__link" href={contactEmailHref}>
              {contactEmail}
            </a>
          </div>
          <div className="card">
            <h3>GitHub Issues</h3>
            <p>특정 브라우저에서 업로드, 미리보기, 처리, ZIP 다운로드가 실패하는 버그는 공개 이슈가 더 적합할 수 있습니다.</p>
            <a
              className="card__link"
              href={repositoryIssuesUrl}
              rel="noreferrer"
              target="_blank"
            >
              이슈 페이지 열기
            </a>
          </div>
          <div className="card">
            <h3>민감한 파일은 먼저 보내지 않기</h3>
            <p>이 사이트는 파일을 브라우저 안에서 처리하므로, 문의에서도 원본 첨부보다 재현 정보와 스크린샷을 우선 권장합니다.</p>
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
          <li>현재 기본 문의 채널은 프로젝트 이메일이며, 공개 추적이 필요한 버그는 GitHub Issues를 보조 채널로 둡니다.</li>
          <li>별도 문의 폼이나 백엔드 메일 전송 기능은 두지 않고, 확인 가능한 공개 연락처만 운영합니다.</li>
          <li>문의 과정에서 원본 업로드를 기본 절차로 요구하지 않습니다.</li>
          <li>광고나 제휴 관련 정보도 실제로 확정된 내용만 안내합니다.</li>
          <li>지원 범위가 바뀌면 소개, 개인정보, 가이드 페이지와 함께 이 페이지도 갱신합니다.</li>
        </ul>
      </PageSection>
    </PageLayout>
  );
}
