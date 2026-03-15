"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SiteContainer } from "@/components/site-container";
import { primaryNav, siteName, siteTagline } from "@/lib/site-content";

export function SiteHeader() {
  const pathname = usePathname();

  function isCurrentItem(href: string) {
    return href === "/"
      ? pathname === href
      : pathname === href || pathname.startsWith(`${href}/`);
  }

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
            {primaryNav.map((item) => {
              const isCurrent = isCurrentItem(item.href);

              return (
                <li key={item.href}>
                  <Link
                    aria-current={isCurrent ? "page" : undefined}
                    className="site-nav__link"
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
    </header>
  );
}
