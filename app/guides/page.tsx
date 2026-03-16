import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, PageLayout, PageSection } from "@/components/page-layout";
import { guideRoutes, getToolRoute, toolRoutes } from "@/lib/site-content";
import { isSiteIndexable } from "@/lib/site-config";
import { createPageMetadata, getPageMetadataEntry } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata(getPageMetadataEntry("/guides"));

export default function GuidesPage() {
  const uploadWorkflowGuides = guideRoutes.filter(
    (guide) => guide.cluster === "cluster-03",
  );
  const featuredGuides = guideRoutes.filter((guide) => guide.cluster === "cluster-02");
  const foundationGuides = guideRoutes.filter((guide) => guide.cluster === "cluster-01");

  return (
    <PageLayout breadcrumbs={[{ href: "/", label: "홈" }, { label: "가이드" }]}>
      <PageHero eyebrow="실전 가이드" title="이미지 작업 전에 필요한 판단 기준만 모았습니다">
        <p>
          압축 세기, 형식 선택, 작업 순서, 배치 전 점검처럼 실제로 자주
          막히는 지점을 한국어 기준으로 정리했습니다. 각 가이드는 관련 도구와
          이어져 있어 읽고 바로 작업할 수 있습니다.
        </p>
        <div className="hero__actions">
          <Link className="button-link" href="/tools">
            도구 허브 보기
          </Link>
          {isSiteIndexable ? (
            <Link className="button-muted" href="/rss.xml">
              RSS 피드 열기
            </Link>
          ) : null}
        </div>
      </PageHero>

      <PageSection
        title="새로 추가한 업로드 실무 가이드"
        intro={
          <p>
            블로그 발행 직전 점검, 상품 리스트 업로드, 상세 캡처 정리, 대량 상품
            등록 전 정리처럼 실제 업로드 동선에 가까운 문서를 먼저 묶었습니다.
          </p>
        }
      >
        <div className="card-grid">
          {uploadWorkflowGuides.map((guide) => (
            <article className="card" key={guide.slug}>
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
              <p>주제: {guide.categoryLabel}</p>
              <p>예상 읽기 시간: {guide.readTime}</p>
              <Link className="card__link" href={guide.href}>
                가이드 읽기
              </Link>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection
        title="기존 사용처 중심 가이드"
        intro={
          <p>
            블로그 업로드 준비, 상품 썸네일 기준, 반복 저장 화질 저하, PNG 선택
            실수처럼 바로 이어서 참고하기 좋은 실무 문서를 함께 볼 수 있습니다.
          </p>
        }
      >
        <div className="card-grid">
          {featuredGuides.map((guide) => (
            <article className="card" key={guide.slug}>
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
              <p>주제: {guide.categoryLabel}</p>
              <p>예상 읽기 시간: {guide.readTime}</p>
              <Link className="card__link" href={guide.href}>
                가이드 읽기
              </Link>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection
        title="기본 흐름 가이드"
        intro={
          <p>
            작업 순서, 투명 배경 변환, 배치 처리 전 점검처럼 먼저 기준을 잡아
            주는 문서도 별도로 모아 두었습니다.
          </p>
        }
      >
        <div className="card-grid">
          {foundationGuides.map((guide) => (
            <article className="card" key={guide.slug}>
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
              <p>주제: {guide.categoryLabel}</p>
              <p>예상 읽기 시간: {guide.readTime}</p>
              <Link className="card__link" href={guide.href}>
                가이드 읽기
              </Link>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection
        title="전체 가이드"
        intro={
          <p>
            짧게 읽고 바로 적용할 수 있는 문서만 모았습니다. 관련 도구와 예상
            읽기 시간을 함께 적어 두었습니다.
          </p>
        }
      >
        <div className="card-grid">
          {guideRoutes.map((guide) => (
            <article className="card" key={guide.slug}>
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
              <p>주제: {guide.categoryLabel}</p>
              <p>예상 읽기 시간: {guide.readTime}</p>
              <p>
                관련 도구:{" "}
                {guide.relatedTools
                  .map((toolSlug) => getToolRoute(toolSlug).title)
                  .join(", ")}
              </p>
              <Link className="card__link" href={guide.href}>
                가이드 읽기
              </Link>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection
        title="가이드에서 바로 이어지는 도구"
        intro={
          <p>
            읽고 끝나는 문서가 아니라, 바로 실행해 볼 수 있도록 관련 도구를 함께
            연결했습니다.
          </p>
        }
      >
        <div className="card-grid">
          {toolRoutes.map((tool) => (
            <article className="card" key={tool.slug}>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
              <Link className="card__link" href={tool.href}>
                {tool.shortLabel} 도구 열기
              </Link>
            </article>
          ))}
        </div>
      </PageSection>
    </PageLayout>
  );
}
