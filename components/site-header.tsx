import Link from "next/link";

import { SiteContainer } from "@/components/site-container";
import { primaryNav, siteName, siteTagline } from "@/lib/site-content";

export function SiteHeader() {
  return (
    <header className="site-header">
      <SiteContainer className="site-header__inner">
        <Link className="site-brand" href="/">
          <span className="site-brand__mark">BI</span>
          <span className="site-brand__text">
            <strong>{siteName}</strong>
            <small>{siteTagline}</small>
          </span>
        </Link>

        <nav aria-label="주요 탐색">
          <ul className="site-nav">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link className="site-nav__link" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </SiteContainer>
    </header>
  );
}
