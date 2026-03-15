import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, PageLayout, PageSection } from "@/components/page-layout";
import { ToolShell } from "@/components/tool-shell";
import { getToolRoute } from "@/lib/site-content";
import { createPageMetadata, getPageMetadataEntry } from "@/lib/site-metadata";

const tool = getToolRoute("compress-image");

export const metadata: Metadata = createPageMetadata(
  getPageMetadataEntry(tool.href),
);

export default function CompressImagePage() {
  return (
    <PageLayout
      breadcrumbs={[
        { href: "/", label: "홈" },
        { href: "/tools", label: "도구" },
        { label: tool.shortLabel },
      ]}
    >
      <PageHero eyebrow="Compress Image" title={tool.title}>
        <p>{tool.description}</p>
        <p>{tool.intro}</p>
        <p>
          이 페이지에서는 여러 이미지를 브라우저 안에서 다시 인코딩해 용량을
          줄이고, 파일별 압축 결과를 확인한 뒤 성공한 파일만 ZIP으로 한 번에
          다운로드할 수 있습니다.
        </p>
        <div className="hero__actions">
          <Link className="button-link" href="/tools">
            도구 허브로 돌아가기
          </Link>
          <Link className="button-muted" href="/privacy">
            로컬 처리 원칙 보기
          </Link>
        </div>
      </PageHero>

      <PageSection
        title="이미지 압축이 하는 일"
        intro={
          <p>
            압축은 사진의 시각 품질과 파일 크기 사이 균형을 조절해 업로드 속도,
            저장 공간, 페이지 로딩 성능을 개선하는 작업입니다.
          </p>
        }
      >
        <div className="detail-grid">
          <div className="card">
            <h3>품질과 용량 조절</h3>
            <p>
              품질 슬라이더로 JPEG 또는 WebP 재인코딩 강도를 조절해 더 작은
              파일을 만들 수 있습니다.
            </p>
          </div>
          <div className="card">
            <h3>지원 형식</h3>
            <p>
              입력은 JPEG, PNG, WebP를 지원합니다. 출력은 원본 형식 유지,
              JPEG, WebP 중에서 선택할 수 있습니다.
            </p>
          </div>
          <div className="card">
            <h3>브라우저 로컬 처리</h3>
            <p>
              업로드한 파일과 압축 결과는 현재 브라우저 탭 안에서만 처리되며,
              서버나 클라우드로 전송되지 않습니다.
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection title="현재 범위와 안내">
        <ul className="chip-list">
          <li>동일한 출력 형식과 품질 설정을 업로드한 여러 파일에 한 번에 적용합니다.</li>
          <li>파일별 성공과 실패를 분리해 보여 주고 성공한 파일만 ZIP으로 묶어 저장합니다.</li>
          <li>PNG는 무손실 형식이라 품질 슬라이더보다 출력 형식 선택의 영향이 큽니다.</li>
          <li>브라우저 재인코딩 과정에서 EXIF 같은 메타데이터는 유지되지 않을 수 있습니다.</li>
        </ul>
      </PageSection>

      <PageSection
        title="이 도구에서 바로 확인할 수 있는 것"
        intro={
          <p>
            클라이언트 전용 작업 패널 아래에서 실제 압축을 실행하고, 실패한 경우
            이유를 메시지로 확인할 수 있습니다.
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
            <p>결과 파일 크기와 절감량, 출력 형식, ZIP 포함 여부를 파일별로 비교합니다.</p>
          </div>
          <div className="card">
            <h3>오류 처리</h3>
            <p>
              지원하지 않는 형식과 브라우저 인코딩 실패, 부분 실패 결과를 모두
              사용자 메시지로 안내합니다.
            </p>
          </div>
        </div>
      </PageSection>

      <ToolShell
        title={tool.title}
        description="여러 이미지를 로컬에서 압축하고, 품질과 출력 형식을 조절한 뒤 성공한 결과를 개별 또는 ZIP으로 다운로드합니다."
        primaryActionLabel="이미지 압축하기"
        variant="compress"
      />
    </PageLayout>
  );
}
