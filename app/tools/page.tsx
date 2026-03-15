import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, PageLayout, PageSection } from "@/components/page-layout";
import { guideRoutes, toolRoutes } from "@/lib/site-content";
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
        title="현재 제공 중인 도구"
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

      <PageSection title="운영 준비와 다음 단계">
        <ul className="list-reset">
          <li>배포 전 체크리스트와 검색 등록 절차를 기준으로 운영 점검 이어가기</li>
          <li>도구별 옵션 프리셋 세분화와 저장 규칙 보강</li>
          <li>광고 슬롯 배치와 성능 측정</li>
          <li>대용량 파일 대응을 위한 추가 워커 최적화</li>
        </ul>
      </PageSection>

      <PageSection
        title="도구 전에 읽어두면 좋은 가이드"
        intro={<p>각 도구에서 자주 묻는 판단 기준을 가이드 문서로 분리해 두었습니다.</p>}
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
    </PageLayout>
  );
}
