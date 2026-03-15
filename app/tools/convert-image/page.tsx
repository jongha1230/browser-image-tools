import type { Metadata } from "next";
import Link from "next/link";

import { PageHero, PageLayout, PageSection } from "@/components/page-layout";
import { ToolShell } from "@/components/tool-shell";
import { getToolRoute } from "@/lib/site-content";
import { createPageMetadata, getPageMetadataEntry } from "@/lib/site-metadata";

const tool = getToolRoute("convert-image");

export const metadata: Metadata = createPageMetadata(
  getPageMetadataEntry(tool.href),
);

export default function ConvertImagePage() {
  return (
    <PageLayout
      breadcrumbs={[
        { href: "/", label: "홈" },
        { href: "/tools", label: "도구" },
        { label: tool.shortLabel },
      ]}
    >
      <PageHero eyebrow="Convert Image" title={tool.title}>
        <p>{tool.description}</p>
        <p>{tool.intro}</p>
        <p>
          이 페이지에서는 이미지 1개를 브라우저 안에서 JPEG, PNG, WebP 가운데
          다른 형식으로 다시 저장하고, 원본과 결과 정보를 비교한 뒤 바로
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
        title="이미지 포맷 변환이 하는 일"
        intro={
          <p>
            포맷 변환은 같은 이미지를 다른 저장 방식으로 다시 인코딩해 호환성,
            투명도 유지, 파일 크기 최적화 목적에 맞는 결과 파일을 만드는
            작업입니다.
          </p>
        }
      >
        <div className="detail-grid">
          <div className="card">
            <h3>지원 형식</h3>
            <p>
              입력과 출력은 JPEG, PNG, WebP만 지원합니다. 변환은 현재 브라우저
              탭 안에서만 이뤄지며 서버 업로드가 없습니다.
            </p>
          </div>
          <div className="card">
            <h3>품질 조절</h3>
            <p>
              JPEG와 WebP는 품질 슬라이더를 조절할 수 있고, PNG는 무손실 저장
              방식으로 다시 생성됩니다.
            </p>
          </div>
          <div className="card">
            <h3>투명 배경 처리</h3>
            <p>
              PNG와 WebP는 투명 영역을 유지할 수 있지만, JPEG는 투명도를
              지원하지 않아 변환 시 흰색 배경으로 채워집니다.
            </p>
          </div>
          <div className="card">
            <h3>브라우저 로컬 처리</h3>
            <p>
              업로드한 파일과 변환 결과는 현재 브라우저 메모리에만 존재하며,
              다운로드하지 않으면 서버나 클라우드로 전송되지 않습니다.
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection
        title="JPEG, PNG, WebP는 언제 쓰면 좋은가"
        intro={
          <p>
            어떤 형식이 맞는지는 이미지 종류와 배포 목적에 따라 달라집니다.
            아래 기준을 먼저 읽은 뒤 작업 패널에서 바로 변환해 볼 수 있습니다.
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

      <PageSection title="현재 범위와 안내">
        <ul className="chip-list">
          <li>이번 티켓에서는 단일 파일 포맷 변환만 지원합니다.</li>
          <li>출력 형식은 원본과 다른 JPEG, PNG, WebP 중 하나를 선택합니다.</li>
          <li>변환 결과 파일명에는 `-converted`가 붙고 확장자는 출력 형식에 맞춰 바뀝니다.</li>
          <li>브라우저 캔버스를 다시 거치므로 EXIF 같은 메타데이터는 유지되지 않을 수 있습니다.</li>
          <li>배치 변환과 일괄 다운로드는 이번 티켓 범위에 포함하지 않습니다.</li>
        </ul>
      </PageSection>

      <PageSection
        title="이 도구에서 바로 확인할 수 있는 것"
        intro={
          <p>
            아래 작업 패널에서 실제 포맷 변환을 실행하고, 실패한 경우 이유를
            메시지로 확인할 수 있습니다.
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
            <p>원본과 결과 형식, 파일 크기, 해상도, 다운로드 파일명을 비교합니다.</p>
          </div>
          <div className="card">
            <h3>오류 처리</h3>
            <p>
              지원하지 않는 형식, 단일 파일 제한, 브라우저 인코딩 실패를 모두
              사용자 메시지로 안내합니다.
            </p>
          </div>
        </div>
      </PageSection>

      <ToolShell
        title={tool.title}
        description="이미지 1개의 형식을 로컬에서 JPEG, PNG, WebP 중 다른 형식으로 변환하고, 전후 정보를 비교한 뒤 바로 다운로드합니다."
        primaryActionLabel="이미지 포맷 변환하기"
        variant="convert"
      />
    </PageLayout>
  );
}
