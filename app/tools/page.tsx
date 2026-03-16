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
      <PageHero eyebrow="이미지 도구 허브" title="업로드 전 이미지 압축, 리사이즈, 변환, EXIF 제거 도구">
        <p>
          이미지 압축, 크기 조절, 포맷 변환, EXIF 제거를 작업 목적별로 나눠
          필요한 도구만 바로 열 수 있습니다. 블로그 발행, 쇼핑몰 등록, 문서
          첨부 전에 모든 처리와 저장 준비를 현재 브라우저 안에서 끝낼 수
          있습니다.
        </p>
      </PageHero>

      <PageSection
        title="현재 제공 중인 도구"
        intro={<p>업로드 전에 필요한 작업을 먼저 고르고, 각 페이지에서 바로 실행하면 됩니다.</p>}
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
          <li>업로드 용량이 부담되면 이미지 압축으로 파일 크기를 먼저 줄입니다.</li>
          <li>썸네일이나 문서 규격을 맞춰야 하면 이미지 크기 조절을 사용합니다.</li>
          <li>서비스 호환성이나 투명 배경 유지가 중요하면 이미지 포맷 변환을 엽니다.</li>
          <li>공유 전 위치나 기기 정보가 신경 쓰이면 EXIF 제거를 먼저 실행합니다.</li>
        </ul>
      </PageSection>

      <PageSection
        title="도구 전에 읽어두면 좋은 가이드"
        intro={<p>헷갈리는 경우에는 관련 가이드를 먼저 보고 바로 도구로 넘어갈 수 있습니다.</p>}
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
