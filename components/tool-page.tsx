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
        <div className="hero__actions">
          <Link className="button-muted" href="/tools">
            도구 허브로 돌아가기
          </Link>
        </div>
      </PageHero>

      <PageSection
        title="이 페이지에서 먼저 설명하는 내용"
        intro={<p>클라이언트 전용 도구 셸을 붙이기 전에 검색 가능하고 읽을 수 있는 HTML을 먼저 제공합니다.</p>}
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
        description="클라이언트 전용 도구 셸이며, 현재 단계에서는 실제 파일 처리를 붙일 자리를 보여줍니다."
        primaryActionLabel={tool.shellActionLabel}
      />
    </PageLayout>
  );
}
