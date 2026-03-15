import { ToolShell } from "@/components/tool-shell";
import type { ToolRoute } from "@/lib/site-content";

type ToolPageProps = {
  tool: ToolRoute;
};

export function ToolPage({ tool }: ToolPageProps) {
  return (
    <article className="page-stack">
      <section className="hero">
        <p className="hero__eyebrow">Tool Landing Page</p>
        <h1>{tool.title}</h1>
        <p>{tool.description}</p>
        <p>{tool.intro}</p>
      </section>

      <section className="panel">
        <h2>이 페이지에서 먼저 설명하는 내용</h2>
        <div className="detail-grid">
          {tool.highlights.map((item) => (
            <div className="card" key={item}>
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>출시 전 체크 포인트</h2>
        <ul className="chip-list">
          {tool.checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <ToolShell
        title={tool.title}
        description="클라이언트 전용 도구 셸이며, 현재 단계에서는 실제 파일 처리를 붙일 자리를 보여줍니다."
        primaryActionLabel={tool.shellActionLabel}
      />
    </article>
  );
}

