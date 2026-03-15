import type { Metadata } from "next";
import Link from "next/link";

import { buildMetadata } from "@/lib/site-metadata";
import { toolRoutes } from "@/lib/site-content";

export const metadata: Metadata = buildMetadata(
  "도구 모음",
  "이미지 압축, 크기 조절, 포맷 변환, EXIF 제거 도구 라우트를 모아둔 허브 페이지입니다.",
);

export default function ToolsPage() {
  return (
    <div className="page-stack">
      <section className="hero">
        <p className="hero__eyebrow">Tools Hub</p>
        <h1>이미지 작업을 실제 라우트로 분리한 도구 허브</h1>
        <p>
          각 도구는 고유 메타데이터와 초기 설명 콘텐츠를 가진 독립 페이지로
          구성했습니다. 이후 실제 브라우저 처리 로직을 각 라우트에 순차적으로
          연결할 수 있습니다.
        </p>
      </section>

      <section className="panel">
        <h2>현재 스캐폴드된 도구</h2>
        <div className="card-grid">
          {toolRoutes.map((tool) => (
            <article className="card" key={tool.slug}>
              <h3>{tool.title}</h3>
              <p>{tool.intro}</p>
              <Link className="card__link" href={tool.href}>
                {tool.shortLabel} 페이지 보기
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>다음으로 붙일 기능</h2>
        <ul className="list-reset">
          <li>브라우저 드래그 앤 드롭 업로드</li>
          <li>도구별 옵션 패널과 미리보기</li>
          <li>배치 내보내기 다운로드 흐름</li>
        </ul>
      </section>
    </div>
  );
}

