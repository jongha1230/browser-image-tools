import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero, PageLayout, PageSection } from "@/components/page-layout";
import { guideRoutes, getToolRoute } from "@/lib/site-content";
import { createPageMetadata } from "@/lib/site-metadata";

type GuideDetailPageProps = {
  params: Promise<{ slug: string }>;
};

function findGuideBySlug(slug: string) {
  return guideRoutes.find((guide) => guide.slug === slug);
}

export function generateStaticParams() {
  return guideRoutes.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata(
  props: GuideDetailPageProps,
): Promise<Metadata> {
  const { slug } = await props.params;
  const guide = findGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return createPageMetadata({
    path: guide.href,
    title: guide.title,
    description: guide.metadataDescription,
  });
}

export default async function GuideDetailPage(
  props: GuideDetailPageProps,
) {
  const { slug } = await props.params;
  const guide = findGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const relatedTools = guide.relatedTools.map((toolSlug) => getToolRoute(toolSlug));
  const siblingGuides = guideRoutes.filter((entry) => entry.slug !== guide.slug).slice(0, 2);

  return (
    <PageLayout
      breadcrumbs={[
        { href: "/", label: "홈" },
        { href: "/guides", label: "가이드" },
        { label: guide.title },
      ]}
    >
      <PageHero eyebrow="실전 가이드" title={guide.title}>
        <p>{guide.description}</p>
        <p>{guide.intro}</p>
        <p>예상 읽기 시간: {guide.readTime}</p>
        <div className="hero__actions">
          <Link className="button-link" href={relatedTools[0].href}>
            {relatedTools[0].title} 바로가기
          </Link>
          <Link className="button-muted" href="/guides">
            가이드 목록으로 돌아가기
          </Link>
        </div>
      </PageHero>

      <PageSection
        title="이 글의 핵심 포인트"
        intro={<p>먼저 확인하면 좋은 판단 기준만 앞에 모아 두었습니다.</p>}
      >
        <ul className="chip-list">
          {guide.focusPoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </PageSection>

      {guide.sections.map((section) => (
        <PageSection key={section.title} title={section.title}>
          <div className="page-stack">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets ? (
              <ul className="list-reset">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </PageSection>
      ))}

      <PageSection
        title="바로 이어서 써볼 수 있는 도구"
        intro={<p>읽은 기준을 바로 적용할 수 있도록 관련 도구를 함께 연결했습니다.</p>}
      >
        <div className="card-grid">
          {relatedTools.map((tool) => (
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

      <PageSection
        title="함께 읽으면 좋은 가이드"
        intro={<p>같은 흐름에서 자주 함께 보는 문서를 이어서 읽을 수 있습니다.</p>}
      >
        <div className="card-grid">
          {siblingGuides.map((entry) => (
            <article className="card" key={entry.slug}>
              <h3>{entry.title}</h3>
              <p>{entry.description}</p>
              <Link className="card__link" href={entry.href}>
                가이드 읽기
              </Link>
            </article>
          ))}
        </div>
      </PageSection>
    </PageLayout>
  );
}
