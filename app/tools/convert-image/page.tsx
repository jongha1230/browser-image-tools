import type { Metadata } from "next";
import Link from "next/link";

import { BrowserSupportSection } from "@/components/browser-support-section";
import { PageHero, PageLayout, PageSection } from "@/components/page-layout";
import { StructuredDataScript } from "@/components/structured-data-script";
import { ToolShell } from "@/components/tool-shell";
import { getGuidesForTool, getToolRoute } from "@/lib/site-content";
import { createPageMetadata, getPageMetadataEntry } from "@/lib/site-metadata";
import { createBreadcrumbListStructuredData } from "@/lib/structured-data";

const tool = getToolRoute("convert-image");
const relatedGuides = getGuidesForTool(tool.slug).slice(0, 2);
const workspaceId = "convert-image-workspace";
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

export default function ConvertImagePage() {
  return (
    <PageLayout breadcrumbs={breadcrumbs}>
      <StructuredDataScript data={breadcrumbStructuredData} />
      <PageHero eyebrow="이미지 포맷 변환 도구" title={tool.title}>
        <p>
          업로드 호환성을 맞추거나 파일 형식을 정리할 때 쓰는 도구입니다. 여러
          장을 한 번에 JPEG, PNG, WebP 가운데 다른 형식으로 바꾸고 원본과 결과
          정보를 나란히 비교할 수 있습니다.
        </p>
        <p>
          투명 배경 유지 여부와 품질 차이를 확인하면서 필요한 결과만 골라 저장할
          수 있습니다.
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
        description="여러 이미지의 형식을 브라우저 안에서 JPEG, PNG, WebP 중 다른 형식으로 바꾸고 결과를 개별 저장 또는 ZIP 다운로드합니다."
        primaryActionLabel="이미지 포맷 변환하기"
        sectionId={workspaceId}
        variant="convert"
      />

      <BrowserSupportSection />

      <PageSection
        title="이럴 때 쓰면 좋습니다"
        intro={
          <p>
            포맷 변환은 같은 이미지를 다른 저장 방식으로 다시 만들어 호환성,
            투명 배경 유지, 파일 크기 기준을 맞추는 작업입니다.
          </p>
        }
      >
        <div className="detail-grid">
          <div className="card">
            <h3>업로드 형식 맞추기</h3>
            <p>
              특정 서비스가 JPEG나 PNG만 받는 경우, 여러 파일의 형식을 한 번에
              맞춰 올리기 쉽게 정리할 수 있습니다.
            </p>
          </div>
          <div className="card">
            <h3>용량과 호환성 조절</h3>
            <p>
              JPEG와 WebP는 품질 조절이 가능하고, PNG는 무손실 저장으로 다시
              생성됩니다.
            </p>
          </div>
          <div className="card">
            <h3>투명 배경 확인</h3>
            <p>
              PNG와 WebP는 투명 영역을 유지할 수 있지만, JPEG는 투명도를
              지원하지 않아 변환 시 흰색 배경으로 채워집니다.
            </p>
          </div>
          <div className="card">
            <h3>브라우저 안에서 처리</h3>
            <p>
              업로드한 파일과 변환 결과는 현재 브라우저 메모리에만 존재하며,
              다운로드하지 않으면 서버나 클라우드로 전송되지 않습니다.
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection
        title="형식별로 이렇게 고르면 편합니다"
        intro={
          <p>
            어떤 형식이 맞는지는 이미지 종류와 배포 목적에 따라 달라집니다.
            아래 기준을 보고 바로 변환해 보세요.
          </p>
        }
      >
        <div className="detail-grid">
          <div className="card">
            <h3>JPEG</h3>
            <p>
              사진, 배너, 일반 콘텐츠 이미지처럼 넓은 호환성이 중요한 경우에
              적합합니다. 대신 투명 배경은 저장할 수 없습니다.
            </p>
          </div>
          <div className="card">
            <h3>PNG</h3>
            <p>
              로고, UI 캡처, 투명 배경이 필요한 이미지처럼 선명한 가장자리와
              무손실 저장이 중요한 경우에 적합합니다.
            </p>
          </div>
          <div className="card">
            <h3>WebP</h3>
            <p>
              웹 페이지용 이미지처럼 파일 크기를 줄이면서 JPEG와 PNG보다 효율적인
              배포를 노릴 때 적합합니다. 최신 브라우저 호환성이 좋습니다.
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection title="작업 전에 확인할 점">
        <ul className="chip-list">
          <li>출력 형식은 업로드한 여러 파일에 공통으로 적용되는 JPEG, PNG, WebP 중 하나를 선택합니다.</li>
          <li>원본과 같은 형식을 선택한 파일은 개별 실패로 표시하고 나머지 파일은 계속 처리합니다.</li>
          <li>JPEG로 변환하면 투명 영역이 흰색으로 채워질 수 있습니다.</li>
          <li>결과 파일명에는 `-converted`가 붙고 확장자는 선택한 형식에 맞춰 바뀝니다.</li>
          <li>브라우저 캔버스를 다시 거치므로 EXIF 같은 메타데이터는 유지되지 않을 수 있습니다.</li>
        </ul>
      </PageSection>

      <PageSection
        title="이 도구에서 바로 확인할 수 있는 것"
        intro={
          <p>
            작업 패널에서 실제 변환을 실행하고, 저장 전에 바뀌는 정보를 바로
            확인할 수 있습니다.
          </p>
        }
      >
        <div className="detail-grid">
          <div className="card">
            <h3>원본 정보</h3>
            <p>원본 파일명, 형식, 용량, 해상도를 먼저 확인합니다.</p>
          </div>
          <div className="card">
            <h3>예상 출력</h3>
            <p>출력 형식, 품질 설정, 저장 파일명을 변환 전에 확인합니다.</p>
          </div>
          <div className="card">
            <h3>변환 결과 비교</h3>
            <p>원본과 결과 형식, 파일 크기, 해상도를 파일별로 비교하고 저장 여부를 정할 수 있습니다.</p>
          </div>
          <div className="card">
            <h3>오류 처리</h3>
            <p>
              지원하지 않는 형식과 브라우저 인코딩 실패, 원본과 같은 형식 선택에
              따른 부분 실패를 사용자 메시지로 안내합니다.
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection
        title="같이 읽으면 좋은 가이드"
        intro={<p>출력 형식 선택과 압축 기준을 더 자세히 비교한 문서를 함께 연결했습니다.</p>}
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
