import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, PageLayout, PageSection } from "@/components/page-layout";
import { guideRoutes, primaryNav, toolRoutes } from "@/lib/site-content";
import { createPageMetadata, getPageMetadataEntry } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata(getPageMetadataEntry("/"));

export default function HomePage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Korean-First Image Utilities"
        title="업로드 전에 끝내는 로컬 이미지 작업 허브"
      >
        <p>
          이미지 압축, 크기 조절, 포맷 변환, EXIF 제거를 브라우저 안에서 처리하고
          결과를 개별 파일 또는 ZIP으로 내려받을 수 있는 한국어 중심 이미지
          유틸리티입니다.
        </p>
        <p>
          서버 업로드나 계정 없이 바로 작업할 수 있는 실제 도구 라우트와,
          작업 기준을 설명하는 가이드를 함께 제공합니다.
        </p>
        <div className="hero__actions">
          <Link className="button-link" href="/tools/compress-image">
            이미지 압축 시작하기
          </Link>
          <Link className="button-muted" href="/guides">
            가이드 읽기
          </Link>
        </div>
      </PageHero>

      <PageSection
        title="지금 바로 쓸 수 있는 도구"
        intro={
          <p>
            각 도구는 고유 메타데이터, 설명 본문, 로컬 배치 처리 UI를 갖춘 실제
            라우트로 제공됩니다.
          </p>
        }
      >
        <div className="card-grid">
          {toolRoutes.map((tool) => (
            <article className="card" key={tool.href}>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
              <p>{tool.intro}</p>
              <Link className="card__link" href={tool.href}>
                페이지 열기
              </Link>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection
        title="이 사이트가 실제로 하는 일"
        intro={
          <p>
            홈 화면에서도 제품 범위와 처리 방식이 바로 읽히도록 핵심 약속을
            요약했습니다.
          </p>
        }
      >
        <div className="detail-grid">
          <div className="card">
            <h3>브라우저 로컬 처리</h3>
            <p>업로드한 이미지는 현재 브라우저 탭 안에서만 처리되며 서버나 클라우드로 전송하지 않습니다.</p>
          </div>
          <div className="card">
            <h3>배치 작업과 ZIP 내보내기</h3>
            <p>여러 파일에 같은 옵션을 한 번에 적용하고 성공한 결과만 ZIP으로 묶어 저장할 수 있습니다.</p>
          </div>
          <div className="card">
            <h3>한국어 중심 설명</h3>
            <p>도구 화면 바깥에도 형식 선택, 압축 기준, EXIF 제거 이유를 읽을 수 있는 HTML 콘텐츠를 제공합니다.</p>
          </div>
          <div className="card">
            <h3>광고 준비 원칙</h3>
            <p>광고 기반 무료 운영을 염두에 두되, 실제 퍼블리셔 정보가 확정되기 전에는 가짜 ads.txt나 임의 식별자를 만들지 않습니다.</p>
          </div>
        </div>
      </PageSection>

      <PageSection
        title="작업 전에 읽어두면 좋은 가이드"
        intro={
          <p>
            검색 유입용 문서가 아니라 실제 작업 판단에 도움이 되는 짧은 가이드를
            먼저 연결했습니다.
          </p>
        }
      >
        <div className="card-grid">
          {guideRoutes.map((guide) => (
            <article className="card" key={guide.slug}>
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
              <Link className="card__link" href={guide.href}>
                가이드 읽기
              </Link>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection title="운영과 신뢰 정보">
        <div className="card-grid">
          {primaryNav.map((item) => (
            <article className="card" key={item.href}>
              <h3>{item.label}</h3>
              <p>
                {item.href === "/tools"
                  ? "도구 허브에서 각 작업 라우트와 현재 지원 범위를 한 번에 확인할 수 있습니다."
                  : item.href === "/guides"
                    ? "가이드 허브에서 압축, 포맷, 개인정보 보호, 배치 리사이즈 문서를 읽을 수 있습니다."
                    : item.href === "/about"
                      ? "서비스 목적, 지원 범위, 광고 준비 원칙을 소개합니다."
                      : item.href === "/privacy"
                        ? "로컬 처리 원칙과 광고·쿠키 고지 예정 사항을 설명합니다."
                        : "버그 제보, 운영 문의, 제휴 문의 시 필요한 정보를 안내합니다."}
              </p>
              <Link className="card__link" href={item.href}>
                이동하기
              </Link>
            </article>
          ))}
        </div>
      </PageSection>
    </PageLayout>
  );
}
