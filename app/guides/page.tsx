import type { Metadata } from "next";

import { PageHero, PageLayout, PageSection } from "@/components/page-layout";
import { guideTopics } from "@/lib/site-content";
import { createPageMetadata, getPageMetadataEntry } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata(getPageMetadataEntry("/guides"));

export default function GuidesPage() {
  return (
    <PageLayout breadcrumbs={[{ href: "/", label: "홈" }, { label: "가이드" }]}>
      <PageHero eyebrow="Guides" title="도구 사용 전후 맥락을 설명하는 가이드 허브">
        <p>
          검색 유입과 도구 페이지 연결을 고려해, 실제 기능 구현 전에도 읽을 수
          있는 설명성 콘텐츠를 배치했습니다.
        </p>
      </PageHero>

      <PageSection title="준비된 주제">
        <div className="card-grid">
          {guideTopics.map((topic) => (
            <article className="card" key={topic}>
              <h3>{topic}</h3>
              <p>상세 본문은 다음 작업에서 개별 가이드 라우트로 확장할 수 있습니다.</p>
            </article>
          ))}
        </div>
      </PageSection>
    </PageLayout>
  );
}
