import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, PageLayout, PageSection } from "@/components/page-layout";
import { guideRoutes, getToolRoute, toolRoutes } from "@/lib/site-content";
import { createPageMetadata, getPageMetadataEntry } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata(getPageMetadataEntry("/guides"));

export default function GuidesPage() {
  return (
    <PageLayout breadcrumbs={[{ href: "/", label: "홈" }, { label: "가이드" }]}>
      <PageHero eyebrow="실전 가이드" title="이미지 작업 전에 필요한 판단 기준만 모았습니다">
        <p>
          압축 세기, 형식 선택, EXIF 정리, 여러 장 리사이즈처럼 헷갈리기 쉬운
          지점을 짧게 정리했습니다. 각 가이드는 관련 도구와 이어져 있어 읽고
          바로 작업할 수 있습니다.
        </p>
        <div className="hero__actions">
          <Link className="button-link" href="/tools">
            도구 허브 보기
          </Link>
          <Link className="button-muted" href="/rss.xml">
            RSS 피드 열기
          </Link>
        </div>
      </PageHero>

      <PageSection
        title="가이드 목록"
        intro={
          <p>
            짧게 읽고 바로 적용할 수 있는 문서만 모았습니다. 예상 읽기 시간도
            함께 적어 두었습니다.
          </p>
        }
      >
        <div className="card-grid">
          {guideRoutes.map((guide) => (
            <article className="card" key={guide.slug}>
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
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
