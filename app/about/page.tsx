import type { Metadata } from "next";

import { PageHero, PageLayout, PageSection } from "@/components/page-layout";
import { createPageMetadata, getPageMetadataEntry } from "@/lib/site-metadata";

export const metadata: Metadata = createPageMetadata(getPageMetadataEntry("/about"));

export default function AboutPage() {
  return (
    <PageLayout>
      <PageHero eyebrow="About" title="한국어 중심 이미지 유틸리티의 시작점">
        <p>
          이 프로젝트는 광고 기반 무료 서비스 구조를 전제로 하되, 파일은 브라우저
          밖으로 보내지 않는 것을 핵심 원칙으로 둡니다.
        </p>
      </PageHero>

      <PageSection title="현재 범위">
        <ul className="list-reset">
          <li>이미지 압축, 크기 조절, 포맷 변환, EXIF 제거 라우트 제공</li>
          <li>실제 파일 처리 전 단계에서 필요한 정보 구조와 메타데이터 고정</li>
          <li>배치 내보내기 기능을 위한 확장 여지 확보</li>
        </ul>
      </PageSection>
    </PageLayout>
  );
}
