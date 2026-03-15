import type { ReactNode } from "react";

type SiteContainerProps = {
  children: ReactNode;
  className?: string;
};

export function SiteContainer({ children, className }: SiteContainerProps) {
  return (
    <div
      className={className ? `site-container ${className}` : "site-container"}
    >
      {children}
    </div>
  );
}
