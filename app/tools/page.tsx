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
      <PageHero eyebrow="이미지 도구 허브" title="업로드 전 이미지 정리 도구 모음">
        <p>
          블로그 업로드 전 점검, 썸네일/상품 이미지 준비, 공유 전 메타데이터
          정리처럼 실제 업로드 직전 업무를 기준으로 도구를 나눴습니다. 처리와
          저장 준비는 모두 현재 브라우저 안에서 끝낼 수 있습니다.
        </p>
      </PageHero>

      <PageSection
        title="현재 제공 중인 도구"
        intro={
          <p>
            필요한 정리 작업부터 고르면 됩니다. 여러 장을 한 번에 넣고 결과를
            비교한 뒤 개별 저장 또는 ZIP 다운로드로 바로 이어집니다.
          </p>
        }
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

      <PageSection title="이럴 때 바로 쓰면 좋습니다">
        <ul className="list-reset">
          <li>블로그 업로드 전 점검에서 본문 이미지 용량이 크면 이미지 압축으로 먼저 가볍게 만듭니다.</li>
          <li>썸네일/상품 이미지 준비에서 픽셀 규격을 맞춰야 하면 이미지 크기 조절을 사용합니다.</li>
          <li>업로드 형식, 투명 배경 유지, 호환성이 함께 걸리면 이미지 포맷 변환을 엽니다.</li>
          <li>공개 업로드 전 위치나 기기 정보 정리가 필요하면 EXIF 제거를 먼저 실행합니다.</li>
        </ul>
      </PageSection>

      <PageSection
        title="도구 전에 읽어두면 좋은 가이드"
        intro={
          <p>
            블로그 발행, 상품 이미지 업로드, 배치 정리 순서가 헷갈리면 가이드를
            먼저 보고 바로 도구로 넘어갈 수 있습니다.
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
    </PageLayout>
  );
}
