import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, PageLayout, PageSection } from "@/components/page-layout";
import { contactEmail, contactEmailHref } from "@/lib/site-content";
import { createPageMetadata, getPageMetadataEntry } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata(getPageMetadataEntry("/privacy"));

export default function PrivacyPage() {
  return (
    <PageLayout breadcrumbs={[{ href: "/", label: "홈" }, { label: "개인정보" }]}>
      <PageHero eyebrow="개인정보와 처리 방식" title="이미지는 서버로 보내지 않고 브라우저 안에서만 처리합니다">
        <p>
          현재 서비스 범위에서는 사용자가 올린 이미지 파일을 서버에 저장하거나
          별도 계정에 연결하지 않습니다. 압축, 크기 조절, 포맷 변환, EXIF 제거는
          현재 브라우저 탭 안에서만 처리됩니다.
        </p>
        <p>
          다운로드 버튼을 누르기 전까지 결과 파일은 브라우저 메모리에만 머무르며,
          계정이나 클라우드 보관 기능과 연결하지 않습니다.
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
        intro={<p>도구 기능 기준으로 무엇을 기대해도 되는지 먼저 분명하게 적어 둡니다.</p>}
      >
        <ul className="list-reset">
          <li>이미지 파일은 도구 기능을 위해 원격 서버로 전송하지 않으며, 브라우저 안에서만 처리합니다.</li>
          <li>로그인, 데이터베이스, 클라우드 업로드, 파일 보관 이력 기능은 현재 범위에 포함하지 않습니다.</li>
          <li>브라우저 재인코딩 과정에서 메타데이터가 정리될 수 있으며, 결과 파일은 사용자가 직접 저장할 때만 기기에 남습니다.</li>
          <li>
            문의는{" "}
            <a href={contactEmailHref}>{contactEmail}</a>
            로 받지만, 재현 확인 전에는 민감한 원본 파일 첨부를 기본 절차로 요구하지 않습니다.
          </li>
          <li>문의나 버그 제보 시에도 원본 파일 업로드를 기본 절차로 요구하지 않는 방향을 우선합니다.</li>
        </ul>
      </PageSection>

      <PageSection
        title="광고와 쿠키에 대한 현재 상태"
        intro={
          <p>
            무료 운영을 위한 광고 도입은 검토하고 있지만, 실제 제공사가 연결되기
            전에는 임의의 고지나 식별자를 만들지 않습니다.
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
          <li>브라우저 안에서 처리하더라도 다운로드한 결과 파일은 기기에 남으므로 공용 PC에서는 작업 후 파일 정리를 권장합니다.</li>
          <li>EXIF 제거는 메타데이터 정리에 도움이 되지만 사진 안에 직접 찍힌 주소, 얼굴, 번호판 같은 시각 정보까지 자동으로 숨기지는 않습니다.</li>
          <li>문의가 필요하면 원본 첨부보다 브라우저 버전, 사용한 도구 URL, 오류 메시지, 스크린샷을 먼저 보내는 편이 안전합니다.</li>
          <li>정책 변경이 생기면 이 페이지와 관련 안내 페이지를 실제 정보 기준으로 함께 갱신합니다.</li>
        </ul>
      </PageSection>
    </PageLayout>
  );
}
