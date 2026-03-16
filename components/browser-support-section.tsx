import Link from "next/link";

import { PageSection } from "@/components/page-layout";

export function BrowserSupportSection() {
  return (
    <PageSection
      title="지원 브라우저와 처리 한계"
      intro={
        <p>
          현재 구현 기준에서 공개적으로 확인한 범위와, 느려지거나 실패할 수
          있는 상황만 보수적으로 적었습니다.
        </p>
      }
    >
      <div className="detail-grid">
        <div className="card">
          <h3>권장 브라우저</h3>
          <p>
            최신 Chrome, Edge 같은 Chromium 계열 데스크톱 브라우저를 가장 먼저
            권장합니다. 2026년 3월 16일 기준 공개 수동 확인 범위도 production
            demo의 Chromium 흐름입니다.
          </p>
        </div>
        <div className="card">
          <h3>다른 브라우저 기대치</h3>
          <p>
            Safari와 Firefox도 Canvas, Blob, 다운로드 링크, Web Worker 같은
            필수 웹 API가 정상 동작하면 사용할 수 있습니다. 다만 현재 저장소에서
            공개적으로 수동 검증했다고 말할 수 있는 범위는 아닙니다.
          </p>
        </div>
        <div className="card">
          <h3>워커 폴백</h3>
          <p>
            백그라운드 작업자(Web Worker)를 우선 시도하고, 초기화가 안 되거나
            일부 API가 빠진 브라우저에서는 메인 스레드로 같은 처리 흐름을
            이어갑니다. 이때 탭 스크롤과 입력 반응이 더 느려질 수 있습니다.
          </p>
        </div>
        <div className="card">
          <h3>대용량과 배치</h3>
          <p>
            큰 파일, 반복 내보내기, 많은 수의 배치 ZIP 생성은 모두 현재 브라우저
            메모리와 기기 성능에 직접 영향을 받습니다. 대표 파일로 먼저 확인하고
            작은 묶음으로 나누면 실패 범위를 줄이기 쉽습니다.
          </p>
        </div>
      </div>
      <p>
        입력과 출력은 JPEG, PNG, WebP만 지원하며 PDF, HEIC, RAW, 비디오,
        서버 업로드는 현재 범위에 포함하지 않습니다. 더 자세한 설명은{" "}
        <Link href="/guides/browser-local-image-processing-limits">
          브라우저 로컬 이미지 처리의 현실적인 한계
        </Link>{" "}
        가이드에서 확인할 수 있습니다.
      </p>
    </PageSection>
  );
}
