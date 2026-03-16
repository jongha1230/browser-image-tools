import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, PageLayout, PageSection } from "@/components/page-layout";
import { StructuredDataScript } from "@/components/structured-data-script";
import { ToolShell } from "@/components/tool-shell";
import { getGuidesForTool, getToolRoute } from "@/lib/site-content";
import { createPageMetadata, getPageMetadataEntry } from "@/lib/site-metadata";
import { createBreadcrumbListStructuredData } from "@/lib/structured-data";

const tool = getToolRoute("remove-exif");
const relatedGuides = getGuidesForTool(tool.slug).slice(0, 2);
const workspaceId = "remove-exif-workspace";
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

export default function RemoveExifPage() {
  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <StructuredDataScript data={breadcrumbStructuredData} />
      <PageHero eyebrow="EXIF 제거 도구" title={tool.title}>
        <p>
          사진을 공유하거나 업로드하기 전에 위치, 기기, 촬영 시각 같은
          메타데이터를 정리하고 싶을 때 쓰는 도구입니다. 여러 장을 한 번에 같은
          형식으로 다시 저장해 공유 전에 점검할 수 있습니다.
        </p>
        <p>
          처리와 저장 준비는 현재 브라우저 안에서만 이뤄지며, 필요한 결과만 골라
          내려받을 수 있습니다.
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
        description="여러 이미지를 브라우저 안에서 같은 형식으로 다시 저장해 EXIF 메타데이터를 정리하고 결과를 개별 저장 또는 ZIP 다운로드합니다."
        primaryActionLabel="EXIF 제거하기"
        sectionId={workspaceId}
        variant="removeExif"
      />

      <PageSection
        title="공유 전에 EXIF를 확인하는 이유"
        intro={
          <p>
            사진 파일에는 픽셀 데이터 외에 촬영 환경을 설명하는 메타데이터가
            함께 들어갈 수 있습니다. 공유 전에 이 정보를 정리하면 불필요한
            개인정보 노출을 줄이는 데 도움이 됩니다.
          </p>
        }
      >
        <div className="detail-grid">
          <div className="card">
            <h3>위치 정보</h3>
            <p>
              일부 사진에는 GPS 좌표가 포함될 수 있어 촬영 장소나 이동 경로가
              드러날 수 있습니다.
            </p>
          </div>
          <div className="card">
            <h3>기기 정보</h3>
            <p>
              카메라 또는 스마트폰 모델, 렌즈, 촬영 설정 같은 정보가 함께 저장될
              수 있습니다.
            </p>
          </div>
          <div className="card">
            <h3>촬영 시각</h3>
            <p>
              촬영 날짜와 시간 정보가 남아 있으면 업로드 시점과 별개로 원본 촬영
              시점을 추정할 수 있습니다.
            </p>
          </div>
          <div className="card">
            <h3>브라우저 로컬 처리</h3>
            <p>
              업로드한 파일과 결과 파일은 현재 브라우저 탭 안에서만 다시
              인코딩되며 서버나 클라우드로 전송되지 않습니다.
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection
        title="이 도구가 메타데이터를 정리하는 방식"
        intro={
          <p>
            이 도구는 원본 파일의 픽셀을 브라우저 캔버스로 다시 그린 뒤 새
            이미지 파일로 저장합니다. 이 과정에서 위치, 기기, 촬영 정보 같은
            EXIF 메타데이터가 제거될 수 있습니다.
          </p>
        }
      >
        <ul className="chip-list">
          <li>입력과 출력은 JPEG, PNG, WebP만 지원합니다.</li>
          <li>결과 파일은 원본과 같은 형식으로 다시 저장해 확장자를 유지합니다.</li>
          <li>다운로드용 파일명에는 `-no-exif`가 붙어 원본과 구분됩니다.</li>
          <li>재인코딩 기반 처리이므로 일부 앱 전용 메타데이터도 함께 사라질 수 있습니다.</li>
          <li>브라우저가 특정 형식 재저장을 지원하지 않으면 명확한 오류 메시지를 표시합니다.</li>
        </ul>
      </PageSection>

      <PageSection title="작업 전에 확인할 점">
        <ul className="chip-list">
          <li>업로드한 여러 파일을 원본과 같은 형식으로 다시 저장해 메타데이터 정리 흐름을 일괄 적용합니다.</li>
          <li>원본 파일명, 형식, 용량, 해상도와 예상 저장 이름을 먼저 확인할 수 있습니다.</li>
          <li>위치, 기기, 촬영 시각처럼 민감할 수 있는 메타데이터를 줄이는 용도로 사용할 수 있습니다.</li>
          <li>파일별 성공과 실패를 구분해 보여 주고 성공한 결과만 저장할 수 있습니다.</li>
        </ul>
      </PageSection>

      <PageSection
        title="이 도구에서 바로 확인할 수 있는 것"
        intro={
          <p>
            작업 패널에서 실제 EXIF 제거용 재저장을 실행하고, 결과 미리보기와
            다운로드용 파일 정보를 같은 페이지에서 바로 확인할 수 있습니다.
          </p>
        }
      >
        <div className="detail-grid">
          <div className="card">
            <h3>원본 정보</h3>
            <p>원본 파일명, 형식, 용량, 해상도를 먼저 확인합니다.</p>
          </div>
          <div className="card">
            <h3>개인정보 안내</h3>
            <p>
              위치, 기기 모델, 촬영 시각 같은 정보가 정리 대상이 될 수 있다는 점을
              실행 전에 안내합니다.
            </p>
          </div>
          <div className="card">
            <h3>결과 정보</h3>
            <p>
              결과 파일명, 출력 형식, 파일 크기, 해상도를 확인한 뒤 필요한 결과만
              내려받을 수 있습니다.
            </p>
          </div>
          <div className="card">
            <h3>오류 처리</h3>
            <p>
              지원하지 않는 형식과 브라우저 재저장 실패, 부분 실패 결과를 사용자
              메시지로 안내합니다.
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection
        title="같이 읽으면 좋은 가이드"
        intro={<p>메타데이터가 왜 문제인지와 공유 전 체크 포인트를 정리한 문서를 함께 연결했습니다.</p>}
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
