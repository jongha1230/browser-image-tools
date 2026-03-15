import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, PageLayout, PageSection } from "@/components/page-layout";
import { ToolShell } from "@/components/tool-shell";
import { getGuidesForTool, getToolRoute } from "@/lib/site-content";
import { createPageMetadata, getPageMetadataEntry } from "@/lib/site-metadata";

const tool = getToolRoute("resize-image");
const relatedGuides = getGuidesForTool(tool.slug).slice(0, 2);
const workspaceId = "resize-image-workspace";

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
      <PageHero eyebrow="이미지 크기 조절 도구" title={tool.title}>
        <p>
          썸네일 규격, 상품 이미지, 문서 첨부 크기를 맞출 때 쓰는 도구입니다.
          여러 장을 한 번에 넣고 같은 기준으로 크기를 조절한 뒤 원본과 결과
          해상도를 파일별로 비교할 수 있습니다.
        </p>
        <p>
          비율 유지 여부와 프리셋을 조합해 빠르게 맞출 수 있고, 결과는 현재
          브라우저 안에서만 처리됩니다.
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
        description="여러 이미지의 해상도를 브라우저 안에서 조정하고, 결과를 개별 저장 또는 ZIP 다운로드합니다."
        primaryActionLabel="이미지 크기 조절하기"
        sectionId={workspaceId}
        variant="resize"
      />

      <PageSection
        title="이럴 때 쓰면 좋습니다"
        intro={
          <p>
            리사이즈는 파일 형식을 바꾸지 않고 픽셀 해상도를 다시 계산해 필요한
            규격에 맞추는 작업입니다.
          </p>
        }
      >
        <div className="detail-grid">
          <div className="card">
            <h3>썸네일 규격 맞추기</h3>
            <p>
              블로그 목록, 커머스 썸네일, 프로필 이미지처럼 규격이 정해진 곳에
              맞춰 여러 장을 한 번에 정리할 수 있습니다.
            </p>
          </div>
          <div className="card">
            <h3>문서 첨부 크기 정리</h3>
            <p>
              문서나 메신저에 첨부하기 전에 너무 큰 이미지를 필요한 크기로 줄여
              보기 편하게 맞출 수 있습니다.
            </p>
          </div>
          <div className="card">
            <h3>비율 유지 선택</h3>
            <p>
              비율 유지를 켜면 왜곡을 줄일 수 있고, 끄면 모든 파일을 같은
              해상도로 맞출 수 있습니다.
            </p>
          </div>
          <div className="card">
            <h3>브라우저 안에서 처리</h3>
            <p>
              업로드한 파일과 리사이즈 결과는 현재 브라우저 탭 안에서만 처리되며
              서버나 클라우드로 전송되지 않습니다.
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection
        title="비율 유지와 프리셋을 이렇게 쓰면 편합니다"
        intro={
          <p>
            비율 유지는 왜곡을 줄이는 기본값이고, 프리셋은 자주 쓰는 규격으로
            빠르게 시작할 때 유용합니다.
          </p>
        }
      >
        <ul className="chip-list">
          <li>비율 유지를 켜면 한쪽 값만 바꿔도 다른 쪽이 원본 비율에 맞춰 자동 계산됩니다.</li>
          <li>프리셋을 누르면 자주 쓰는 박스 크기를 바로 불러올 수 있습니다.</li>
          <li>비율 유지를 끄면 모든 파일을 같은 가로·세로 값으로 저장할 수 있습니다.</li>
          <li>결과 파일명에는 `-resized`가 붙어 원본과 쉽게 구분됩니다.</li>
        </ul>
      </PageSection>

      <PageSection title="작업 전에 확인할 점">
        <ul className="chip-list">
          <li>입력한 가로·세로 값은 업로드한 여러 파일에 같은 기준으로 적용됩니다.</li>
          <li>비율 유지를 켜면 실제 결과 해상도는 파일마다 조금씩 달라질 수 있습니다.</li>
          <li>잘못된 크기 입력이나 브라우저 인코딩 실패는 파일별 상태와 메시지로 안내합니다.</li>
          <li>브라우저 캔버스를 다시 거치므로 EXIF 같은 메타데이터는 유지되지 않을 수 있습니다.</li>
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
            <p>예상 출력 크기, 저장 파일명, 결과 해상도와 파일 크기를 파일별로 비교합니다.</p>
          </div>
          <div className="card">
            <h3>오류 처리</h3>
            <p>
              잘못된 픽셀 값과 브라우저 처리 실패, 부분 실패 결과를 사용자
              메시지로 안내합니다.
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection
        title="같이 읽으면 좋은 가이드"
        intro={<p>여러 장을 같은 규격으로 맞출 때 헷갈리는 판단 기준을 이어서 읽을 수 있습니다.</p>}
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
