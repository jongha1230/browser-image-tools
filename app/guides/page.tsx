import type { Metadata } from "next";

import { buildMetadata } from "@/lib/site-metadata";
import { guideTopics } from "@/lib/site-content";

export const metadata: Metadata = buildMetadata(
  "가이드",
  "이미지 최적화와 포맷 선택을 다루는 한국어 가이드 허브 페이지입니다.",
);

export default function GuidesPage() {
  return (
    <div className="page-stack">
      <section className="hero">
        <p className="hero__eyebrow">Guides</p>
        <h1>도구 사용 전후 맥락을 설명하는 가이드 허브</h1>
        <p>
          검색 유입과 도구 페이지 연결을 고려해, 실제 기능 구현 전에도 읽을 수
          있는 설명성 콘텐츠를 배치했습니다.
        </p>
      </section>

      <section className="panel">
        <h2>준비된 주제</h2>
        <div className="card-grid">
          {guideTopics.map((topic) => (
            <article className="card" key={topic}>
              <h3>{topic}</h3>
              <p>상세 본문은 다음 작업에서 개별 가이드 라우트로 확장할 수 있습니다.</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

