import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, PageLayout, PageSection } from "@/components/page-layout";
import { primaryNav, toolRoutes } from "@/lib/site-content";
import { createPageMetadata, getPageMetadataEntry } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata(getPageMetadataEntry("/"));

export default function HomePage() {
  return (
    <PageLayout>
      <PageHero
        eyebrow="Korean-First Image Utilities"
        title="업로드 전에 끝내는 브라우저 이미지 작업"
      >
        <p>
          이 스캐폴드는 이미지 압축, 크기 조절, 포맷 변환, EXIF 제거를 모두
          브라우저에서 처리하는 한국어 중심 서비스의 시작점입니다.
        </p>
        <p>
          현재 단계에서는 각 도구의 고유 라우트, 메타데이터, 초기 설명 콘텐츠를
          우선 고정했습니다.
        </p>
        <div className="hero__actions">
          <Link className="button-link" href="/tools">
            도구 살펴보기
          </Link>
          <Link className="button-muted" href="/guides">
            가이드 읽기
          </Link>
        </div>
      </PageHero>

      <PageSection
        title="핵심 도구"
        intro={
          <p>현재 스캐폴드는 각 도구를 독립적인 랜딩 페이지와 공용 레이아웃 위에 올려둡니다.</p>
        }
      >
        <div className="card-grid">
          {toolRoutes.map((tool) => (
            <article className="card" key={tool.href}>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
              <Link className="card__link" href={tool.href}>
                페이지 열기
              </Link>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection title="브라우저 처리 원칙">
        <ul className="list-reset">
          <li>파일 업로드 없이 로컬 탭 안에서만 처리합니다.</li>
          <li>광고 기반 무료 서비스 구조를 염두에 두되, 현재는 정보 구조만 준비합니다.</li>
          <li>각 도구는 해시가 아닌 실제 라우트와 개별 메타데이터를 사용합니다.</li>
        </ul>
      </PageSection>

      <PageSection title="안내 페이지">
        <div className="card-grid">
          {primaryNav.map((item) => (
            <article className="card" key={item.href}>
              <h3>{item.label}</h3>
              <p>도구 소개, 운영 정책, 콘텐츠 가이드를 위한 기본 페이지입니다.</p>
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
