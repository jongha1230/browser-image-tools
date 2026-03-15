"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SiteContainer } from "@/components/site-container";
import { footerNav, siteName, siteTagline } from "@/lib/site-content";

export function SiteFooter() {
  const pathname = usePathname();

  return (
    <footer className="site-footer">
      <SiteContainer className="site-footer__inner">
        <div className="site-footer__summary">
          <strong>{siteName}</strong>
          <p>{siteTagline}</p>
          <p>이미지 압축, 리사이즈, 변환, EXIF 제거는 서버 업로드 없이 현재 브라우저 안에서만 처리합니다.</p>
        </div>

        <nav aria-label="보조 탐색">
          <ul className="site-footer__links">
            {footerNav.map((item) => {
              const isCurrent = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    aria-current={isCurrent ? "page" : undefined}
                    className="site-footer__link"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </SiteContainer>
    </footer>
  );
}
