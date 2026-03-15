import "./globals.css";

import { ImageUploadProvider } from "@/components/image-upload-provider";
import { SiteContainer } from "@/components/site-container";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { rootMetadata } from "@/lib/site-metadata";

export const metadata = rootMetadata;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>
        <ImageUploadProvider>
          <a className="skip-link" href="#main-content">
            본문으로 건너뛰기
          </a>
          <div className="site-frame">
            <SiteHeader />
            <main className="site-main" id="main-content">
              <SiteContainer>{children}</SiteContainer>
            </main>
            <SiteFooter />
          </div>
        </ImageUploadProvider>
      </body>
    </html>
  );
}
