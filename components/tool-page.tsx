import Link from "next/link";

import { PageHero, PageLayout, PageSection } from "@/components/page-layout";
import { ToolShell } from "@/components/tool-shell";
import type { ToolRoute } from "@/lib/site-content";

type ToolPageProps = {
  tool: ToolRoute;
};

export function ToolPage({ tool }: ToolPageProps) {
  return (
    <PageLayout
      breadcrumbs={[
        { href: "/", label: "홈" },
        { href: "/tools", label: "도구" },
        { label: tool.shortLabel },
      ]}
    >
      <PageHero eyebrow="Tool Landing Page" title={tool.title}>
        <p>{tool.description}</p>
        <p>{tool.intro}</p>
        <p>
          현재 단계에서는 JPEG, PNG, WebP 파일 업로드와 미리보기까지 브라우저
          안에서만 처리하며, 실제 편집 옵션은 이어서 연결할 예정입니다.
        </p>
        <div className="hero__actions">
          <Link className="button-muted" href="/tools">
            도구 허브로 돌아가기
          </Link>
        </div>
      </PageHero>

      <PageSection
        title="이 페이지에서 먼저 설명하는 내용"
        intro={
          <p>
            인터랙션과 별개로 검색 가능하고 읽을 수 있는 HTML 설명을 먼저
            유지해 각 도구 라우트의 역할과 지원 범위를 초기 응답에서 바로
            전달합니다.
          </p>
        }
      >
        <div className="detail-grid">
          {tool.highlights.map((item) => (
            <div className="card" key={item}>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection title="출시 전 체크 포인트">
        <ul className="chip-list">
          {tool.checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </PageSection>

      <ToolShell
        title={tool.title}
        description="클라이언트 전용 도구 셸이며, 현재 단계에서는 로컬 업로드와 미리보기까지 연결하고 실제 편집 옵션은 다음 단계에 붙입니다."
        primaryActionLabel={tool.shellActionLabel}
      />
    </PageLayout>
  );
}
