import type { Metadata } from "next";
import Link from "next/link";

import { BrowserSupportSection } from "@/components/browser-support-section";
import { PageHero, PageLayout, PageSection } from "@/components/page-layout";
import { StructuredDataScript } from "@/components/structured-data-script";
import { ToolShell } from "@/components/tool-shell";
import { getGuidesForTool, getToolRoute } from "@/lib/site-content";
import { createPageMetadata, getPageMetadataEntry } from "@/lib/site-metadata";
import { createBreadcrumbListStructuredData } from "@/lib/structured-data";

const tool = getToolRoute("compress-image");
const relatedGuides = getGuidesForTool(tool.slug).slice(0, 2);
const workspaceId = "compress-image-workspace";
const breadcrumbs = [
  { href: "/", label: "홈" },
  { href: "/tools", label: "도구" },
  { label: tool.shortLabel },
] as const;
const breadcrumbStructuredData = createBreadcrumbListStructuredData({
  breadcrumbs,
  currentPath: tool.href,
});

export const metadata: Metadata = createPageMetadata(
  getPageMetadataEntry(tool.href),
);

export default function CompressImagePage() {
  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <StructuredDataScript data={breadcrumbStructuredData} />
      <PageHero eyebrow="이미지 압축 도구" title={tool.title}>
        <p>
          커뮤니티, 블로그, 쇼핑몰 업로드 전에 사진과 캡처 용량을 줄일 때 쓰는
          도구입니다. 여러 장을 한 번에 넣고 같은 품질 기준으로 다시 저장한 뒤
          결과를 파일별로 비교할 수 있습니다.
        </p>
        <p>
          블로그 업로드, 썸네일, 상품 이미지, 빠른 공유용 추천 시작점을 먼저
          고른 뒤 품질과 형식을 수동으로 미세 조정할 수 있고, 처리와 다운로드
          준비는 현재 브라우저 안에서만 이뤄집니다.
        </p>
        <div className="hero__actions">
          <a className="button-link" href={`#${workspaceId}`}>
            바로 파일 추가하기
          </a>
          <Link className="button-muted" href="/privacy">
            로컬 처리 원칙 보기
          </Link>
        </div>
      </PageHero>

      <ToolShell
        title={tool.title}
        description="여러 이미지를 브라우저 안에서 압축하고, 품질과 출력 형식을 조절한 뒤 결과를 개별 저장 또는 ZIP 다운로드합니다."
        primaryActionLabel="이미지 압축하기"
        sectionId={workspaceId}
        variant="compress"
      />

      <BrowserSupportSection />

      <PageSection
        title="이럴 때 쓰면 좋습니다"
        intro={
          <p>
            용량 제한이 있거나 전송 속도를 줄이고 싶을 때, 압축은 가장 먼저
            시도해 볼 수 있는 정리 방법이며 추천 시작점으로 빠르게 세팅을 맞출
            수 있습니다.
          </p>
        }
      >
        <div className="detail-grid">
          <div className="card">
            <h3>업로드 제한 맞추기</h3>
            <p>
              커뮤니티나 쇼핑몰처럼 파일 크기 제한이 있는 곳에 올리기 전에 여러
              장의 용량을 한 번에 줄일 수 있습니다.
            </p>
          </div>
          <div className="card">
            <h3>사진과 캡처 정리</h3>
            <p>
              사진은 더 가볍게, 캡처는 상황에 맞는 형식으로 다시 저장해 전송과
              업로드를 덜 부담스럽게 만들 수 있습니다.
            </p>
          </div>
          <div className="card">
            <h3>형식 선택 함께 조정</h3>
            <p>
              원본 유지, JPEG, WebP 중에서 출력 형식을 고를 수 있어 품질과
              용량 사이 균형을 직접 맞출 수 있습니다.
            </p>
          </div>
          <div className="card">
            <h3>브라우저 안에서 처리</h3>
            <p>
              업로드한 파일과 압축 결과는 현재 브라우저 탭 안에서만 처리되며,
              서버나 클라우드로 전송되지 않습니다.
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection title="작업 전에 확인할 점">
        <ul className="chip-list">
          <li>선택한 품질과 출력 형식은 업로드한 여러 파일에 같은 기준으로 적용됩니다.</li>
          <li>PNG는 무손실 형식이라 품질 슬라이더보다 출력 형식을 바꾸는 영향이 더 크게 보일 수 있습니다.</li>
          <li>파일별 성공과 실패를 나눠 보여 주며, 성공한 결과만 골라 저장할 수 있습니다.</li>
          <li>브라우저 재인코딩 과정에서 EXIF 같은 메타데이터는 유지되지 않을 수 있습니다.</li>
        </ul>
      </PageSection>

      <PageSection
        title="이 도구에서 바로 확인할 수 있는 것"
        intro={
          <p>
            작업 패널에서 실제 압축을 실행하고, 저장 전에 달라진 정보를 바로
            비교할 수 있습니다.
          </p>
        }
      >
        <div className="detail-grid">
          <div className="card">
            <h3>압축 전 정보</h3>
            <p>원본 파일명, 형식, 용량, 해상도를 먼저 확인합니다.</p>
          </div>
          <div className="card">
            <h3>압축 후 비교</h3>
            <p>결과 파일 크기와 절감량, 출력 형식을 파일별로 비교하고 저장 여부를 정할 수 있습니다.</p>
          </div>
          <div className="card">
            <h3>오류 처리</h3>
            <p>
              지원하지 않는 형식과 브라우저 인코딩 실패, 부분 실패 결과를 사용자
              메시지로 안내합니다.
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection
        title="같이 읽으면 좋은 가이드"
        intro={<p>압축 강도나 출력 형식 선택이 헷갈릴 때 바로 이어서 볼 수 있는 문서를 연결했습니다.</p>}
      >
        <div className="card-grid">
          {relatedGuides.map((guide) => (
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
