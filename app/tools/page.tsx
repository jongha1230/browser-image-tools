import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, PageLayout, PageSection } from "@/components/page-layout";
import { toolRoutes } from "@/lib/site-content";
import { createPageMetadata, getPageMetadataEntry } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata(
  getPageMetadataEntry("/tools"),
);

export default function ToolsPage() {
  return (
    <PageLayout breadcrumbs={[{ href: "/", label: "홈" }, { label: "도구" }]}>
      <PageHero eyebrow="Tools Hub" title="이미지 작업을 실제 라우트로 분리한 도구 허브">
        <p>
          각 도구는 고유 메타데이터와 초기 설명 콘텐츠를 가진 독립 페이지로
          구성했습니다. 현재는 각 라우트에서 로컬 업로드, 배치 처리, ZIP
          내보내기까지 바로 사용할 수 있습니다.
        </p>
      </PageHero>

      <PageSection
        title="현재 스캐폴드된 도구"
        intro={<p>도구 인덱스는 표준 링크만 사용해 검색 엔진과 사용자 모두가 바로 이동할 수 있게 유지합니다.</p>}
      >
        <div className="card-grid">
          {toolRoutes.map((tool) => (
            <article className="card" key={tool.slug}>
              <h3>{tool.title}</h3>
              <p>{tool.intro}</p>
              <Link className="card__link" href={tool.href}>
                {tool.shortLabel} 페이지 보기
              </Link>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection title="다음으로 붙일 기능">
        <ul className="list-reset">
          <li>가이드 콘텐츠와 각 도구 간 내부 링크 확장</li>
          <li>광고 슬롯 배치와 성능 측정</li>
          <li>대용량 파일 대응을 위한 추가 워커 최적화</li>
        </ul>
      </PageSection>
    </PageLayout>
  );
}
