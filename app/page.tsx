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
        eyebrow="브라우저 로컬 처리"
        title="업로드 전 이미지 정리, 블로그·썸네일·상품 이미지 준비를 한 번에"
      >
        <p>
          블로그 업로드 전 점검, 썸네일/상품 이미지 준비, 공개 공유 전
          메타데이터 정리처럼 업로드 직전에 반복되는 일을 한 흐름으로 묶었습니다.
          압축, 크기 조절, 형식 변환, EXIF 제거는 모두 서버 업로드 없이 현재
          브라우저 안에서만 처리합니다.
        </p>
        <p>
          여러 장을 한 번에 정리한 뒤 결과 용량, 해상도, 형식을 비교하고
          필요한 파일만 개별 저장하거나 ZIP으로 내려받을 수 있습니다.
        </p>
        <div className="hero__actions">
          <Link className="button-link" href="/tools/compress-image">
            이미지 압축 시작하기
          </Link>
          <Link className="button-muted" href="/tools">
            전체 도구 보기
          </Link>
        </div>
      </PageHero>

      <PageSection
        title="지금 바로 쓸 수 있는 도구"
        intro={
          <p>
            업로드 전 이미지 정리에 자주 쓰는 작업만 모았습니다. 블로그 본문,
            썸네일, 상품 이미지, 공유용 사진 정리에 맞는 페이지를 바로 열 수
            있습니다.
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
        title="업로드 직전에 필요한 흐름만 남겼습니다"
        intro={
          <p>
            무거운 편집기 대신, 실제 게시와 첨부 직전에 자주 반복하는 정리
            단계에만 집중했습니다.
          </p>
        }
      >
        <div className="detail-grid">
          <div className="card">
            <h3>업로드 전 점검 한 흐름</h3>
            <p>용량, 해상도, 형식, EXIF 정리 여부를 같은 흐름에서 확인해 업로드 직전 재작업을 줄입니다.</p>
          </div>
          <div className="card">
            <h3>여러 장 한 번에</h3>
            <p>같은 설정을 여러 파일에 적용하고, 성공한 결과만 골라 개별 저장하거나 ZIP으로 묶어 받을 수 있습니다.</p>
          </div>
          <div className="card">
            <h3>브라우저 로컬 처리</h3>
            <p>처리와 다운로드 준비가 모두 현재 브라우저 안에서 이뤄집니다. 계정이나 클라우드 보관 없이 바로 끝낼 수 있습니다.</p>
          </div>
          <div className="card">
            <h3>읽고 바로 작업</h3>
            <p>각 도구 페이지에서 어떤 상황에 쓰는지 먼저 확인하고, 바로 아래 작업 패널에서 결과를 비교하며 정리할 수 있습니다.</p>
          </div>
        </div>
      </PageSection>

      <PageSection
        title="작업 전에 읽어두면 좋은 가이드"
        intro={
          <p>
            블로그 업로드 전 점검, 썸네일/상품 이미지 준비, 배치 정리 순서처럼
            실제 작업에서 바로 쓰는 판단 기준만 짧게 정리했습니다.
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

      <PageSection title="더 알아보기">
        <div className="card-grid">
          {primaryNav.map((item) => (
            <article className="card" key={item.href}>
              <h3>{item.label}</h3>
              <p>
                {item.href === "/tools"
                  ? "작업별 도구를 한눈에 보고 필요한 페이지를 바로 열 수 있습니다."
                  : item.href === "/guides"
                    ? "압축 기준, 형식 선택, 개인정보 보호처럼 자주 헷갈리는 주제를 먼저 읽을 수 있습니다."
                    : item.href === "/about"
                      ? "누구를 위한 서비스인지와 현재 지원 범위를 짧게 정리해 두었습니다."
                      : item.href === "/privacy"
                        ? "이미지가 어떻게 처리되는지, 무엇을 기대해도 되는지 명확하게 설명합니다."
                        : "문제가 생겼을 때 어떤 정보를 함께 보내면 확인이 빨라지는지 안내합니다."}
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
