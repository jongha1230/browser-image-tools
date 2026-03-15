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
        title="압축, 리사이즈, 포맷 변환, EXIF 제거를 한 곳에서"
      >
        <p>
          사진과 캡처를 올리기 전에 용량 압축, 픽셀 크기 조정, 형식 변환,
          EXIF 제거를 한 번에 처리할 수 있습니다. 파일은 서버 업로드 없이
          현재 브라우저 안에서만 다룹니다.
        </p>
        <p>
          여러 장을 한 번에 넣고, 필요한 결과만 개별 저장하거나 ZIP으로
          내려받을 수 있습니다.
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
            업로드 전에 자주 하는 작업만 먼저 모았습니다. 각 페이지는 설명
            본문과 실제 작업 패널을 함께 제공해 바로 시작할 수 있습니다.
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
        title="왜 이 사이트를 쓰는가"
        intro={
          <p>
            무거운 편집기 대신, 업로드 전에 필요한 이미지 정리 작업에만
            집중했습니다.
          </p>
        }
      >
        <div className="detail-grid">
          <div className="card">
            <h3>서버 업로드 없음</h3>
            <p>처리와 다운로드 준비가 모두 현재 브라우저 안에서 이뤄집니다. 계정이나 클라우드 보관 없이 바로 끝낼 수 있습니다.</p>
          </div>
          <div className="card">
            <h3>여러 장 한 번에</h3>
            <p>같은 설정을 여러 파일에 적용하고, 성공한 결과만 골라 개별 저장하거나 ZIP으로 묶어 받을 수 있습니다.</p>
          </div>
          <div className="card">
            <h3>작업 전에 읽는 설명</h3>
            <p>각 도구 페이지 상단에서 어떤 상황에 쓰는지, 무엇이 달라지는지 먼저 읽고 바로 작업으로 이어갈 수 있습니다.</p>
          </div>
          <div className="card">
            <h3>결과 비교 확인</h3>
            <p>원본과 결과의 용량, 해상도, 형식을 같은 화면에서 확인해 저장 전에 한 번 더 점검할 수 있습니다.</p>
          </div>
        </div>
      </PageSection>

      <PageSection
        title="작업 전에 읽어두면 좋은 가이드"
        intro={
          <p>
            막연한 팁보다, 업로드 전에 바로 판단할 수 있는 기준만 짧게 정리했습니다.
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
