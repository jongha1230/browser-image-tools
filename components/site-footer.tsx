"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SiteContainer } from "@/components/site-container";
import {
  contactEmail,
  contactEmailHref,
  footerNav,
  repositoryIssuesUrl,
  siteName,
  siteTagline,
} from "@/lib/site-content";

export function SiteFooter() {
  const pathname = usePathname();

  return (
    <footer className="site-footer">
      <SiteContainer className="site-footer__inner">
        <div className="site-footer__summary">
          <strong>{siteName}</strong>
          <p>{siteTagline}</p>
          <p>이미지 압축, 리사이즈, 변환, EXIF 제거는 서버 업로드 없이 현재 브라우저 안에서만 처리합니다.</p>
          <p>문의는 프로젝트 이메일을 우선 사용하고, 재현 가능한 버그 공유는 GitHub Issues를 보조 경로로 유지합니다.</p>
          <ul className="site-footer__links" aria-label="프로젝트 연락처">
            <li>
              <a className="site-footer__link" href={contactEmailHref}>
                {contactEmail}
              </a>
            </li>
            <li>
              <a
                className="site-footer__link"
                href={repositoryIssuesUrl}
                rel="noreferrer"
                target="_blank"
              >
                GitHub Issues
              </a>
            </li>
          </ul>
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
