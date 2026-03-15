import type { Metadata } from "next";

import { PageHero, PageLayout, PageSection } from "@/components/page-layout";
import { createPageMetadata, getPageMetadataEntry } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata(getPageMetadataEntry("/contact"));

export default function ContactPage() {
  return (
    <PageLayout>
      <PageHero eyebrow="Contact" title="문의 채널 자리">
        <p>
          현재는 초기 스캐폴드 단계이므로 문의 폼이나 백엔드 없이 운영됩니다.
          정식 채널은 배포 단계에서 메일 링크 또는 외부 폼으로 연결할 수 있습니다.
        </p>
      </PageHero>

      <PageSection title="운영 메모">
        <p>
          이 페이지는 고객 문의 경로, 광고 문의, 버그 제보 안내를 배치할 자리를
          미리 확보합니다.
        </p>
      </PageSection>
    </PageLayout>
  );
}
