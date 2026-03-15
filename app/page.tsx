import type { Metadata } from "next";
import Link from "next/link";

import { buildMetadata } from "@/lib/site-metadata";
import { primaryNav, toolRoutes } from "@/lib/site-content";

export const metadata: Metadata = buildMetadata(
  "홈",
  "브라우저 안에서 이미지를 압축, 크기 조절, 포맷 변환, EXIF 제거로 연결하는 한국어 중심 이미지 도구 홈입니다.",
);

export default function HomePage() {
  return (
    <div className="page-stack">
      <section className="hero">
        <p className="hero__eyebrow">Korean-First Image Utilities</p>
        <h1>업로드 전에 끝내는 브라우저 이미지 작업</h1>
        <p>
          이 스캐폴드는 이미지 압축, 크기 조절, 포맷 변환, EXIF 제거를 모두
          브라우저에서 처리하는 한국어 중심 서비스의 시작점입니다.
        </p>
        <p>
          현재 단계에서는 각 도구의 고유 라우트, 메타데이터, 초기 설명 콘텐츠를
          우선 고정했습니다.
        </p>
        <div className="hero__actions">
          <Link className="button-link" href="/tools">
            도구 살펴보기
          </Link>
          <Link className="button-muted" href="/guides">
            가이드 읽기
          </Link>
        </div>
      </section>

      <section className="panel">
        <h2>핵심 도구</h2>
        <div className="card-grid">
          {toolRoutes.map((tool) => (
            <article className="card" key={tool.href}>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
              <Link className="card__link" href={tool.href}>
                페이지 열기
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>브라우저 처리 원칙</h2>
        <ul className="list-reset">
          <li>파일 업로드 없이 로컬 탭 안에서만 처리합니다.</li>
          <li>광고 기반 무료 서비스 구조를 염두에 두되, 현재는 정보 구조만 준비합니다.</li>
          <li>각 도구는 해시가 아닌 실제 라우트와 개별 메타데이터를 사용합니다.</li>
        </ul>
      </section>

      <section className="panel">
        <h2>안내 페이지</h2>
        <div className="card-grid">
          {primaryNav.map((item) => (
            <article className="card" key={item.href}>
              <h3>{item.label}</h3>
              <p>도구 소개, 운영 정책, 콘텐츠 가이드를 위한 기본 페이지입니다.</p>
              <Link className="card__link" href={item.href}>
                이동하기
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

