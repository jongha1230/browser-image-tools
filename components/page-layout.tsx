import type { ReactNode } from "react";
import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageLayoutProps = {
  children: ReactNode;
  breadcrumbs?: readonly BreadcrumbItem[];
};

type PageHeroProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
};

type PageSectionProps = {
  title: string;
  intro?: ReactNode;
  children: ReactNode;
};

export function PageLayout({
  children,
  breadcrumbs,
}: PageLayoutProps) {
  return (
    <article className="page-layout">
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <nav className="breadcrumbs" aria-label="브레드크럼">
          <ol className="breadcrumbs__list">
            {breadcrumbs.map((item, index) => {
              const isCurrent = index === breadcrumbs.length - 1;

              return (
                <li className="breadcrumbs__item" key={`${item.label}-${index}`}>
                  {item.href && !isCurrent ? (
                    <Link className="breadcrumbs__link" href={item.href}>
                      {item.label}
                    </Link>
                  ) : (
                    <span aria-current={isCurrent ? "page" : undefined}>
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      ) : null}

      <div className="page-stack">{children}</div>
    </article>
  );
}

export function PageHero({ eyebrow, title, children }: PageHeroProps) {
  return (
    <header className="hero">
      <p className="hero__eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <div className="hero__body">{children}</div>
    </header>
  );
}

export function PageSection({
  title,
  intro,
  children,
}: PageSectionProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <h2>{title}</h2>
        {intro ? <div className="section-heading__intro">{intro}</div> : null}
      </div>
      {children}
    </section>
  );
}
