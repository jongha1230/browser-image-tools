import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, PageLayout, PageSection } from "@/components/page-layout";
import { ToolShell } from "@/components/tool-shell";
import { getToolRoute } from "@/lib/site-content";
import { createPageMetadata, getPageMetadataEntry } from "@/lib/site-metadata";

const tool = getToolRoute("resize-image");

export const metadata: Metadata = createPageMetadata(
  getPageMetadataEntry(tool.href),
);

export default function ResizeImagePage() {
  return (
    <PageLayout
      breadcrumbs={[
        { href: "/", label: "홈" },
        { href: "/tools", label: "도구" },
        { label: tool.shortLabel },
      ]}
    >
      <PageHero eyebrow="Resize Image" title={tool.title}>
        <p>{tool.description}</p>
        <p>{tool.intro}</p>
        <p>
          이 페이지에서는 이미지 1개의 가로와 세로 픽셀 크기를 브라우저 안에서
          다시 조정하고, 원본과 결과 해상도를 비교한 뒤 바로 다운로드할 수
          있습니다.
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
        title="이미지 크기 조절이 하는 일"
        intro={
          <p>
            리사이즈는 파일 형식을 바꾸지 않고 픽셀 해상도를 다시 계산해 썸네일,
            상세 이미지, 문서 첨부용 크기에 맞추는 작업입니다.
          </p>
        }
      >
        <div className="detail-grid">
          <div className="card">
            <h3>직접 입력</h3>
            <p>
              가로와 세로 값을 직접 입력해 원하는 출력 크기를 지정할 수
              있습니다.
            </p>
          </div>
          <div className="card">
            <h3>비율 유지</h3>
            <p>
              비율 잠금을 켜면 한쪽 값을 바꿀 때 다른 쪽 값이 원본 비율에 맞춰
              자동으로 계산됩니다.
            </p>
          </div>
          <div className="card">
            <h3>지원 형식</h3>
            <p>
              입력과 출력은 JPEG, PNG, WebP를 지원합니다. 결과 파일은 현재
              브라우저에서 다시 인코딩되어 같은 형식으로 저장됩니다.
            </p>
          </div>
          <div className="card">
            <h3>브라우저 로컬 처리</h3>
            <p>
              업로드한 파일과 리사이즈 결과는 현재 브라우저 탭 안에서만 처리되며
              서버나 클라우드로 전송되지 않습니다.
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection
        title="비율 잠금과 프리셋 사용 방식"
        intro={
          <p>
            비율 잠금이 켜져 있으면 원본 비율을 유지한 채 크기를 조정하고,
            프리셋은 빠르게 자주 쓰는 출력 크기에 맞추는 출발점으로 사용합니다.
          </p>
        }
      >
        <ul className="chip-list">
          <li>비율 잠금 켜짐: 가로 또는 세로 한쪽을 바꾸면 다른 쪽이 자동 계산됩니다.</li>
          <li>비율 잠금 켜짐 + 프리셋: 프리셋 박스 안에 맞도록 원본 비율을 유지합니다.</li>
          <li>비율 잠금 꺼짐: 가로와 세로를 각각 입력해 원하는 해상도로 저장합니다.</li>
          <li>출력 확장자는 원본 형식에 맞춰 유지되며 파일명에는 `-resized`가 붙습니다.</li>
        </ul>
      </PageSection>

      <PageSection title="현재 범위와 안내">
        <ul className="chip-list">
          <li>현재 티켓에서는 단일 파일 리사이즈만 지원합니다.</li>
          <li>잘못된 크기 입력이나 브라우저 인코딩 실패는 메시지로 바로 안내합니다.</li>
          <li>브라우저 캔버스를 다시 거치므로 EXIF 같은 메타데이터는 유지되지 않을 수 있습니다.</li>
          <li>배치 리사이즈와 일괄 내보내기는 이번 티켓 범위에 포함하지 않습니다.</li>
        </ul>
      </PageSection>

      <PageSection
        title="이 도구에서 바로 확인할 수 있는 것"
        intro={
          <p>
            아래 작업 패널에서 실제 리사이즈를 실행하고, 결과 미리보기와 파일
            정보를 같은 페이지에서 바로 비교할 수 있습니다.
          </p>
        }
      >
        <div className="detail-grid">
          <div className="card">
            <h3>원본 정보</h3>
            <p>원본 파일명, 형식, 용량, 해상도를 먼저 확인합니다.</p>
          </div>
          <div className="card">
            <h3>출력 정보</h3>
            <p>예상 출력 크기, 저장 파일명, 결과 파일 크기와 해상도를 비교합니다.</p>
          </div>
          <div className="card">
            <h3>오류 처리</h3>
            <p>
              잘못된 픽셀 값, 단일 파일 제한, 브라우저 처리 실패를 모두 사용자
              메시지로 안내합니다.
            </p>
          </div>
        </div>
      </PageSection>

      <ToolShell
        title={tool.title}
        description="이미지 1개의 해상도를 로컬에서 조정하고, 원본과 결과 크기를 비교한 뒤 바로 다운로드합니다."
        primaryActionLabel="이미지 크기 조절하기"
        variant="resize"
      />
    </PageLayout>
  );
}
