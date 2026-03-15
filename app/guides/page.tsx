import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, PageLayout, PageSection } from "@/components/page-layout";
import { guideRoutes, getToolRoute, toolRoutes } from "@/lib/site-content";
import { createPageMetadata, getPageMetadataEntry } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata(getPageMetadataEntry("/guides"));

export default function GuidesPage() {
  return (
    <PageLayout breadcrumbs={[{ href: "/", label: "홈" }, { label: "가이드" }]}>
      <PageHero eyebrow="Guides" title="이미지 작업 전에 읽어두면 좋은 실전 가이드">
        <p>
          압축, 포맷 변환, EXIF 제거, 배치 리사이즈처럼 자주 헷갈리는 주제를
          짧고 실무적으로 정리했습니다. 각 문서는 실제 도구 라우트와 서로
          연결돼 있어 읽은 뒤 바로 작업을 이어갈 수 있습니다.
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
            모든 가이드는 서버 렌더링된 HTML 본문을 포함하며, 카드와 본문 링크는
            모두 일반 링크로 연결됩니다.
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
            글을 먼저 읽고 바로 실행해 볼 수 있도록 각 가이드는 아래 도구와
            연결됩니다.
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
