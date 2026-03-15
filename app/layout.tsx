import type { ReactNode } from "react";
import Link from "next/link";

import "./globals.css";

import { primaryNav, siteName, siteTagline } from "@/lib/site-content";
import { rootMetadata } from "@/lib/site-metadata";

export const metadata = rootMetadata;

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>
        <div className="site-shell">
          <header className="site-header">
            <Link className="site-brand" href="/">
              <span className="site-brand__mark">BI</span>
              <span>
                <strong>{siteName}</strong>
                <br />
                <small>{siteTagline}</small>
              </span>
            </Link>

            <nav className="site-nav" aria-label="주요 탐색">
              {primaryNav.map((item) => (
                <Link className="site-nav__link" href={item.href} key={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>

          <main>{children}</main>

          <footer className="site-footer">
            <p>
              브라우저 내부 처리만 허용하는 한국어 중심 이미지 유틸리티 사이트
              스캐폴드입니다.
            </p>
            <p>광고 영역, 실제 처리 로직, 배치 내보내기는 다음 단계에서 연결합니다.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}

