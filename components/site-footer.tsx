import Link from "next/link";

import { SiteContainer } from "@/components/site-container";
import { footerNav, siteName, siteTagline } from "@/lib/site-content";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <SiteContainer className="site-footer__inner">
        <div className="site-footer__summary">
          <strong>{siteName}</strong>
          <p>{siteTagline}</p>
          <p>모든 이미지 처리는 브라우저 안에서만 이뤄지는 것을 전제로 설계합니다.</p>
        </div>

        <nav aria-label="보조 탐색">
          <ul className="site-footer__links">
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link className="site-footer__link" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </SiteContainer>
    </footer>
  );
}
