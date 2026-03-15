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
          구성했습니다. 이후 실제 브라우저 처리 로직을 각 라우트에 순차적으로
          연결할 수 있습니다.
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
          <li>도구별 실제 압축, 리사이즈, 변환, EXIF 제거 옵션 패널</li>
          <li>처리 결과 비교와 내보내기 전 검수 흐름</li>
          <li>배치 내보내기 다운로드 흐름</li>
        </ul>
      </PageSection>
    </PageLayout>
  );
}
