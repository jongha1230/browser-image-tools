import type { Metadata } from "next";

import { buildMetadata } from "@/lib/site-metadata";

export const metadata: Metadata = buildMetadata(
  "개인정보 처리방침",
  "브라우저 로컬 처리 원칙과 광고 도입 시 고려할 개인정보 범위를 설명하는 페이지입니다.",
);

export default function PrivacyPage() {
  return (
    <div className="page-stack">
      <section className="hero">
        <p className="hero__eyebrow">Privacy</p>
        <h1>파일은 브라우저 안에서만 처리합니다</h1>
        <p>
          현재 스캐폴드 기준으로 사용자 파일 업로드, 서버 저장, 계정 시스템은
          포함하지 않습니다. 실제 도구 구현 단계에서도 로컬 처리 원칙을 유지합니다.
        </p>
      </section>

      <section className="panel">
        <h2>명시하는 원칙</h2>
        <ul className="list-reset">
          <li>이미지 파일은 원격 서버로 전송하지 않습니다.</li>
          <li>로그인, 데이터베이스, 클라우드 업로드 기능을 도입하지 않습니다.</li>
          <li>광고 도입 시에도 파일 내용과 직접 연결된 추적은 범위에서 제외합니다.</li>
        </ul>
      </section>
    </div>
  );
}

