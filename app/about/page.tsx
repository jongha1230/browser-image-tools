import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, PageLayout, PageSection } from "@/components/page-layout";
import { createPageMetadata, getPageMetadataEntry } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata(getPageMetadataEntry("/about"));

export default function AboutPage() {
  return (
    <PageLayout breadcrumbs={[{ href: "/", label: "홈" }, { label: "소개" }]}>
      <PageHero eyebrow="서비스 소개" title="자주 하는 이미지 정리를 더 가볍게">
        <p>
          브라우저 이미지 툴은 업로드 전 준비 작업을 빠르게 끝내고 싶은 사람을
          위한 한국어 이미지 유틸리티입니다. 압축, 크기 조절, 포맷 변환, EXIF
          제거를 각각 분리된 도구로 제공합니다.
        </p>
        <p>
          무거운 편집기 설치나 서버 업로드 없이 현재 브라우저 안에서 바로 처리하고
          내려받는 흐름을 기본값으로 삼습니다.
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
        title="누구를 위한 서비스인가"
        intro={<p>특별한 편집 기능보다 업로드 전 정리 작업이 더 자주 필요한 사용자를 먼저 생각했습니다.</p>}
      >
        <div className="detail-grid">
          <div className="card">
            <h3>커뮤니티와 블로그 업로드</h3>
            <p>용량 제한 때문에 업로드가 번거로운 사진과 캡처를 빠르게 정리할 수 있습니다.</p>
          </div>
          <div className="card">
            <h3>쇼핑몰과 문서 작업</h3>
            <p>썸네일 규격 맞추기, 형식 바꾸기, 파일 크기 줄이기 같은 반복 작업에 맞춰져 있습니다.</p>
          </div>
          <div className="card">
            <h3>개인정보가 신경 쓰이는 공유</h3>
            <p>사진을 올리기 전에 EXIF 정보를 정리하고 싶은 상황을 고려해 설명과 도구를 함께 제공합니다.</p>
          </div>
          <div className="card">
            <h3>여러 장을 한 번에 처리하는 흐름</h3>
            <p>같은 설정을 여러 파일에 적용하고 필요한 결과만 골라 저장하는 방식에 초점을 맞춥니다.</p>
          </div>
        </div>
      </PageSection>

      <PageSection title="서비스 원칙">
        <ul className="list-reset">
          <li>파일 처리 기능은 브라우저 안에서 끝나야 하며 원격 업로드를 전제로 하지 않습니다.</li>
          <li>각 도구와 가이드를 실제 URL로 제공해 검색과 공유가 자연스럽게 이어지도록 구성합니다.</li>
          <li>한국어 사용자가 먼저 이해할 수 있는 설명을 우선하고, UI와 본문 모두 실무적인 판단 기준을 담습니다.</li>
          <li>무료 운영을 위한 광고 도입은 검토하되, 실제 제공사가 정해지기 전에는 임의의 식별자나 정책 문구를 만들지 않습니다.</li>
        </ul>
      </PageSection>

      <PageSection title="현재 기준으로 지원하지 않는 것">
        <ul className="list-reset">
          <li>PDF, HEIC, RAW, 비디오 같은 비지원 형식 처리는 포함하지 않습니다.</li>
          <li>백엔드 업로드, 로그인, 작업 이력 저장, 클라우드 동기화는 현재 범위 밖입니다.</li>
          <li>이미지 생성이나 편집 보정 같은 AI 기능은 넣지 않습니다.</li>
          <li>도구 범위를 벗어나는 복잡한 편집 기능보다 업로드 전 정리에 집중합니다.</li>
        </ul>
      </PageSection>
    </PageLayout>
  );
}
