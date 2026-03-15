export const repositoryUrl = "https://github.com/jongha1230/browser-image-tools";
export const repositoryIssuesUrl = `${repositoryUrl}/issues`;
export const siteUpdatedAt = "2026-03-15T09:00:00+09:00";

export type ToolSlug =
  | "compress-image"
  | "resize-image"
  | "convert-image"
  | "remove-exif";

export type GuideSlug =
  | "image-compression-basics"
  | "webp-vs-jpeg-vs-png"
  | "remove-exif-for-privacy"
  | "batch-resize-checklist";

type ToolRouteBase<TSlug extends ToolSlug> = {
  slug: TSlug;
  href: `/tools/${TSlug}`;
  title: string;
  shortLabel: string;
  description: string;
  metadataDescription: string;
  intro: string;
  highlights: string[];
  checklist: string[];
  shellActionLabel: string;
};

type GuideSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

type GuideRouteBase<TSlug extends GuideSlug> = {
  slug: TSlug;
  href: `/guides/${TSlug}`;
  title: string;
  description: string;
  metadataDescription: string;
  intro: string;
  readTime: string;
  publishedAt: string;
  updatedAt: string;
  focusPoints: string[];
  sections: GuideSection[];
  relatedTools: ToolSlug[];
};

export type ToolRoute =
  | ToolRouteBase<"compress-image">
  | ToolRouteBase<"resize-image">
  | ToolRouteBase<"convert-image">
  | ToolRouteBase<"remove-exif">;

export type GuideRoute =
  | GuideRouteBase<"image-compression-basics">
  | GuideRouteBase<"webp-vs-jpeg-vs-png">
  | GuideRouteBase<"remove-exif-for-privacy">
  | GuideRouteBase<"batch-resize-checklist">;

export const siteName = "브라우저 이미지 툴";
export const siteTagline = "브라우저 안에서 끝내는 한국어 이미지 작업 도구";
export const siteDescription =
  "이미지 압축, 크기 조절, 포맷 변환, EXIF 제거와 배치 내보내기를 모두 브라우저 안에서 처리하는 한국어 이미지 유틸리티 사이트입니다.";

export const primaryNav = [
  { href: "/tools", label: "도구" },
  { href: "/guides", label: "가이드" },
  { href: "/about", label: "소개" },
  { href: "/privacy", label: "개인정보" },
  { href: "/contact", label: "문의" },
] as const;

export const footerNav = [
  { href: "/about", label: "소개" },
  { href: "/privacy", label: "개인정보" },
  { href: "/contact", label: "문의" },
] as const;

export const toolRoutes = [
  {
    slug: "compress-image",
    href: "/tools/compress-image",
    title: "이미지 압축",
    shortLabel: "압축",
    description:
      "사진과 캡처를 업로드 전에 더 가볍게 정리할 수 있는 이미지 압축 도구입니다.",
    metadataDescription:
      "브라우저 안에서 JPG, PNG, WebP 이미지 용량을 줄이고 결과를 개별 저장 또는 ZIP으로 내려받는 이미지 압축 도구 페이지입니다.",
    intro:
      "커뮤니티, 블로그, 쇼핑몰 업로드 전에 여러 장의 파일 크기를 한 번에 줄이는 흐름에 맞춰 구성했습니다.",
    highlights: [
      "품질과 출력 형식을 정한 뒤 여러 파일에 같은 기준을 한 번에 적용할 수 있습니다.",
      "원본과 결과의 파일 크기, 형식, 해상도를 같은 화면에서 바로 비교할 수 있습니다.",
      "파일은 서버로 보내지 않고 현재 브라우저 안에서만 처리합니다.",
    ],
    checklist: [
      "업로드 목적에 맞는 품질 범위 고르기",
      "원본과 결과의 용량 차이 확인하기",
      "필요한 결과만 개별 저장 또는 ZIP으로 내려받기",
    ],
    shellActionLabel: "이미지 압축하기",
  },
  {
    slug: "resize-image",
    href: "/tools/resize-image",
    title: "이미지 크기 조절",
    shortLabel: "리사이즈",
    description:
      "썸네일, 상세 이미지, 문서 첨부용 규격에 맞게 픽셀 크기를 조절하는 이미지 크기 조절 도구입니다.",
    metadataDescription:
      "브라우저 안에서 JPG, PNG, WebP 이미지 크기를 조정하고 결과를 개별 저장 또는 ZIP으로 내려받는 리사이즈 도구 페이지입니다.",
    intro:
      "가로·세로 입력, 비율 유지, 자주 쓰는 프리셋으로 여러 장의 해상도를 같은 기준에 맞출 수 있습니다.",
    highlights: [
      "가로와 세로 픽셀 값을 직접 입력하거나 프리셋으로 빠르게 시작할 수 있습니다.",
      "비율 유지를 켜면 원본 비율을 살린 채 각 파일 크기를 자동으로 계산합니다.",
      "여러 파일을 한 번에 처리하고 결과 해상도를 파일별로 확인할 수 있습니다.",
    ],
    checklist: [
      "비율 유지 여부 먼저 정하기",
      "목표 규격에 맞는 가로·세로 값 또는 프리셋 선택하기",
      "원본과 결과 해상도, 저장 파일명 비교하기",
    ],
    shellActionLabel: "이미지 크기 조절하기",
  },
  {
    slug: "convert-image",
    href: "/tools/convert-image",
    title: "이미지 포맷 변환",
    shortLabel: "변환",
    description:
      "JPG, PNG, WebP 사이를 바꿔 업로드 호환성과 용량 기준을 맞추는 이미지 포맷 변환 도구입니다.",
    metadataDescription:
      "브라우저 안에서 JPG, PNG, WebP 사이를 변환하고 결과를 개별 저장 또는 ZIP으로 내려받는 포맷 변환 도구 페이지입니다.",
    intro:
      "사진, 로고, 캡처에 맞는 형식으로 여러 장을 한 번에 바꾸고 품질과 저장 형식을 바로 확인할 수 있습니다.",
    highlights: [
      "JPEG, PNG, WebP의 차이와 투명 배경 처리 방식을 바로 확인할 수 있습니다.",
      "원본과 결과의 형식, 용량, 저장 파일명을 한 화면에서 비교할 수 있습니다.",
      "여러 파일을 같은 출력 형식으로 정리해 한 번에 저장할 수 있습니다.",
    ],
    checklist: [
      "출력 형식과 품질 기준 정하기",
      "투명 배경 유지 여부 확인하기",
      "변환된 파일만 골라 저장하기",
    ],
    shellActionLabel: "이미지 포맷 변환하기",
  },
  {
    slug: "remove-exif",
    href: "/tools/remove-exif",
    title: "EXIF 제거",
    shortLabel: "EXIF 제거",
    description:
      "사진을 공유하기 전에 위치, 기기, 촬영 시각 같은 메타데이터를 정리하는 EXIF 제거 도구입니다.",
    metadataDescription:
      "브라우저 안에서 사진 EXIF 메타데이터를 정리하고 결과를 개별 저장 또는 ZIP으로 내려받는 개인정보 보호 도구 페이지입니다.",
    intro:
      "공개 게시물, 중고거래, 제보용 첨부처럼 메타데이터가 신경 쓰이는 상황에서 여러 장을 한 번에 다시 저장할 수 있습니다.",
    highlights: [
      "EXIF에 어떤 정보가 들어갈 수 있는지부터 먼저 설명합니다.",
      "원본 파일을 서버에 보내지 않고 브라우저 안에서만 다시 저장합니다.",
      "여러 파일을 한 번에 정리하고 필요한 결과만 묶어 저장할 수 있습니다.",
    ],
    checklist: [
      "위치, 기기, 촬영 시각 정보가 필요한지 먼저 확인하기",
      "재저장 후 파일명과 형식 다시 보기",
      "공유할 결과만 골라 내려받기",
    ],
    shellActionLabel: "EXIF 제거하기",
  },
] satisfies ToolRoute[];

export const guideRoutes = [
  {
    slug: "image-compression-basics",
    href: "/guides/image-compression-basics",
    title: "이미지 압축 기초: 업로드 전 꼭 확인할 기준",
    description:
      "용량을 줄일 때 품질, 형식, 배치 내보내기를 어떻게 판단해야 하는지 정리한 기본 가이드입니다.",
    metadataDescription:
      "이미지 압축을 시작하기 전에 품질, 형식, 업로드 목적을 어떻게 판단할지 정리한 한국어 가이드입니다.",
    intro:
      "무조건 가장 작은 파일을 만드는 것보다, 어디에 올릴 이미지인지와 어느 정도 선명도가 필요한지를 먼저 정리하는 편이 결과를 덜 망칩니다.",
    readTime: "4분",
    publishedAt: "2026-03-15T09:00:00+09:00",
    updatedAt: "2026-03-15T09:00:00+09:00",
    focusPoints: [
      "사진과 그래픽은 같은 압축 기준으로 다루지 않는 편이 안전합니다.",
      "품질 슬라이더보다 출력 형식 선택이 결과를 더 크게 바꾸는 경우가 많습니다.",
      "배치 작업 전에는 목표 용량과 사용처를 먼저 고정해야 재작업이 줄어듭니다.",
    ],
    sections: [
      {
        title: "먼저 업로드 목적을 정리하세요",
        paragraphs: [
          "이미지 압축은 파일을 작게 만드는 작업이 아니라, 사용처에 맞는 용량과 선명도를 맞추는 작업에 가깝습니다. 커뮤니티 업로드, 쇼핑몰 상세 이미지, 메신저 전송은 각각 허용 용량과 기대 품질이 다릅니다.",
          "같은 원본이라도 모바일 웹 썸네일처럼 작게 보일 이미지는 조금 더 강하게 압축해도 문제가 적고, 확대해서 보는 상품 사진은 과도한 압축이 금방 티가 납니다.",
        ],
        bullets: [
          "업로드 제한 용량이 있는지 먼저 확인하기",
          "대표 이미지인지, 본문 삽입용인지 구분하기",
          "텍스트가 많은 캡처인지, 사진 중심인지 나누기",
          "여러 장을 같은 기준으로 내보낼지 결정하기",
        ],
      },
      {
        title: "품질과 형식을 같이 보세요",
        paragraphs: [
          "JPEG와 WebP는 품질 값을 낮추면 용량을 줄이기 쉽지만, PNG는 무손실이라 품질 슬라이더보다 형식 자체를 바꾸는 영향이 큽니다.",
          "배경이 투명한 로고나 UI 캡처는 PNG나 WebP가 낫고, 일반 사진은 JPEG 또는 WebP가 대체로 더 효율적입니다.",
        ],
        bullets: [
          "사진 위주면 JPEG 또는 WebP부터 비교하기",
          "투명 배경이 있으면 PNG 또는 WebP 유지하기",
          "텍스트 가장자리가 번지면 품질을 다시 올리기",
          "원본보다 커진 파일은 형식 선택부터 다시 보기",
        ],
      },
      {
        title: "배치 압축은 한 번에 같은 기준을 적용합니다",
        paragraphs: [
          "여러 장을 한 번에 처리할 때는 파일별로 세부 옵션을 다르게 주기보다, 품질과 출력 형식을 먼저 통일한 뒤 결과를 비교하는 방식이 빠릅니다.",
          "이 사이트의 압축 도구도 동일한 품질과 출력 형식을 큐 전체에 적용하고, 성공한 파일만 ZIP으로 묶어 내려받는 흐름에 맞춰 설계돼 있습니다.",
        ],
        bullets: [
          "대표 파일 1장으로 먼저 품질 범위 확인하기",
          "괜찮은 결과가 나오면 나머지 파일에 같은 설정 적용하기",
          "실패 파일이 있으면 부분 재시도 대신 원본 형식 확인하기",
          "최종 다운로드 전에 원본 대비 절감량 확인하기",
        ],
      },
    ],
    relatedTools: ["compress-image", "convert-image"],
  },
  {
    slug: "webp-vs-jpeg-vs-png",
    href: "/guides/webp-vs-jpeg-vs-png",
    title: "WebP vs JPEG vs PNG: 어떤 형식을 선택할까",
    description:
      "사진, 투명 배경, 캡처 이미지 상황별로 WebP, JPEG, PNG 선택 기준을 비교한 가이드입니다.",
    metadataDescription:
      "WebP, JPEG, PNG의 차이와 사진·캡처·투명 배경 상황별 선택 기준을 설명하는 한국어 이미지 포맷 가이드입니다.",
    intro:
      "형식 선택은 단순 취향 문제가 아니라 호환성, 용량, 투명도 유지, 편집 후 재사용 여부를 함께 따져야 하는 결정입니다.",
    readTime: "5분",
    publishedAt: "2026-03-15T09:00:00+09:00",
    updatedAt: "2026-03-15T09:00:00+09:00",
    focusPoints: [
      "JPEG는 호환성이 넓고, PNG는 선명도와 투명도 보존에 강합니다.",
      "WebP는 웹 배포에서 용량 효율이 좋지만 최종 사용처 호환성을 먼저 확인해야 합니다.",
      "투명 배경을 JPEG로 바꾸면 배경이 채워질 수 있습니다.",
    ],
    sections: [
      {
        title: "세 형식의 기본 성격",
        paragraphs: [
          "JPEG는 사진을 작게 저장하기 좋고 거의 어디서나 열립니다. 대신 투명 배경을 지원하지 않고, 반복 저장 시 품질 손실이 눈에 띌 수 있습니다.",
          "PNG는 무손실 저장과 투명 배경에 강하지만 사진 파일 크기가 커질 수 있습니다. WebP는 사진과 그래픽 모두에서 효율이 좋은 편이지만, 상대 서비스가 WebP를 바로 받는지 확인하는 게 안전합니다.",
        ],
        bullets: [
          "JPEG: 사진, 배너, 일반 업로드용",
          "PNG: 로고, UI 캡처, 투명 배경 필요",
          "WebP: 웹 배포 최적화, 파일 크기 절감 우선",
        ],
      },
      {
        title: "실무에서 자주 나오는 선택 기준",
        paragraphs: [
          "상품 사진이나 블로그 본문 이미지처럼 넓은 호환성이 중요하면 JPEG가 여전히 무난합니다. 반대로 사이트 성능과 용량을 우선한다면 WebP가 더 나은 경우가 많습니다.",
          "선명한 텍스트가 들어간 캡처 이미지나 투명 배경 로고는 PNG 또는 WebP가 흔히 더 깨끗합니다.",
        ],
        bullets: [
          "모바일 메신저 썸네일: JPEG 또는 WebP",
          "서비스 소개서 캡처: PNG 또는 WebP",
          "투명 배경 아이콘: PNG 또는 WebP",
          "쇼핑몰 원본 백업본: JPEG 원본 유지 후 파생본 변환",
        ],
      },
      {
        title: "변환 전에 놓치기 쉬운 체크 포인트",
        paragraphs: [
          "형식을 바꿔도 해상도는 그대로일 수 있으므로, 용량이 기대보다 크면 리사이즈와 압축을 같이 검토해야 합니다.",
          "특히 JPEG로 변환할 때는 투명 영역이 흰색으로 채워질 수 있으니 결과 미리보기를 확인하는 습관이 필요합니다.",
        ],
        bullets: [
          "투명 배경 유지 필요 여부 확인하기",
          "원본과 같은 형식으로 잘못 저장하지 않기",
          "파일 크기뿐 아니라 가장자리 품질도 같이 확인하기",
          "웹 업로드라면 최종 플랫폼 호환성 다시 보기",
        ],
      },
    ],
    relatedTools: ["convert-image", "compress-image"],
  },
  {
    slug: "remove-exif-for-privacy",
    href: "/guides/remove-exif-for-privacy",
    title: "EXIF 제거가 필요한 이유: 공유 전 프라이버시 체크",
    description:
      "위치, 기기, 촬영 시각 같은 메타데이터가 왜 문제가 될 수 있는지와 제거 전후 확인법을 정리한 가이드입니다.",
    metadataDescription:
      "사진 공유 전에 EXIF 메타데이터를 왜 제거해야 하는지와 위치·기기·촬영 시각 정보의 위험을 설명하는 한국어 가이드입니다.",
    intro:
      "사진은 눈에 보이는 픽셀만 공유되는 것이 아닙니다. 촬영 환경을 설명하는 메타데이터가 같이 따라갈 수 있기 때문에, 공개 범위가 넓을수록 먼저 정리하는 편이 안전합니다.",
    readTime: "4분",
    publishedAt: "2026-03-15T09:00:00+09:00",
    updatedAt: "2026-03-15T09:00:00+09:00",
    focusPoints: [
      "EXIF에는 위치, 기기 모델, 촬영 시각 같은 정보가 남을 수 있습니다.",
      "공개 커뮤니티, 중고거래, 제보용 업로드처럼 재배포 가능성이 있는 상황에서는 제거 우선이 안전합니다.",
      "재저장 방식으로 메타데이터를 정리하면 일부 앱 전용 정보도 함께 사라질 수 있습니다.",
    ],
    sections: [
      {
        title: "EXIF에 포함될 수 있는 정보",
        paragraphs: [
          "사진 파일에는 GPS 좌표, 촬영 날짜와 시간, 사용 기기 모델, 카메라 설정 같은 정보가 저장될 수 있습니다. 모든 파일이 같은 정보를 담는 것은 아니지만, 공개 전에는 포함 가능성을 전제로 생각하는 편이 낫습니다.",
          "특히 위치 정보는 사진 자체보다 더 민감할 수 있습니다. 집, 회사, 학교처럼 반복적으로 드나드는 장소가 노출되면 의도치 않은 추적 단서가 될 수 있습니다.",
        ],
        bullets: [
          "GPS 좌표와 위치 정보",
          "촬영 날짜와 시간",
          "기기 모델과 카메라 설정",
          "일부 편집 앱이 남긴 부가 메타데이터",
        ],
      },
      {
        title: "언제 제거하는 게 좋은가",
        paragraphs: [
          "개인 SNS 비공개 계정처럼 공유 범위가 좁아도 재업로드나 캡처 재배포가 생길 수 있으므로, 민감한 사진은 업로드 전 제거가 기본값에 가깝습니다.",
          "중고거래 이미지, 부동산 사진, 반려동물 산책 사진, 아이 사진처럼 생활 반경을 추정할 여지가 있는 파일은 특히 더 신중해야 합니다.",
        ],
        bullets: [
          "공개 게시판이나 커뮤니티에 올릴 때",
          "거래, 제보, 지원서 제출용 사진을 보낼 때",
          "다른 사람이 다시 배포할 가능성이 있을 때",
          "사진의 맥락보다 내용만 전달하면 되는 경우",
        ],
      },
      {
        title: "재저장 후 확인해야 할 것",
        paragraphs: [
          "메타데이터 제거는 파일 내용을 안전하게 정리하는 데 도움이 되지만, 이미지 자체에 찍힌 간판이나 차량 번호 같은 시각 정보까지 숨겨 주지는 않습니다.",
          "따라서 공유 전에는 메타데이터뿐 아니라 화면 안에 보이는 텍스트와 배경도 함께 확인해야 합니다.",
        ],
        bullets: [
          "사진 안에 위치 힌트가 직접 보이지 않는지 확인하기",
          "파일명이 원본과 구분되도록 정리하기",
          "필요하다면 리사이즈나 압축도 함께 적용하기",
          "민감한 파일은 공유 후에도 원본 보관 위치 다시 확인하기",
        ],
      },
    ],
    relatedTools: ["remove-exif"],
  },
  {
    slug: "batch-resize-checklist",
    href: "/guides/batch-resize-checklist",
    title: "배치 리사이즈 체크리스트: 여러 장을 한 번에 맞출 때",
    description:
      "썸네일, 상세 이미지, 문서 첨부용으로 여러 파일 크기를 맞출 때 필요한 체크리스트를 정리한 가이드입니다.",
    metadataDescription:
      "여러 이미지를 한 번에 리사이즈할 때 비율 유지, 프리셋, 검수 포인트를 정리한 한국어 배치 리사이즈 가이드입니다.",
    intro:
      "리사이즈는 단순히 픽셀 숫자를 바꾸는 작업처럼 보이지만, 비율 유지 여부와 사용처별 목표 크기를 먼저 정하지 않으면 결과가 쉽게 들쭉날쭉해집니다.",
    readTime: "4분",
    publishedAt: "2026-03-15T09:00:00+09:00",
    updatedAt: "2026-03-15T09:00:00+09:00",
    focusPoints: [
      "배치 리사이즈는 대표 크기와 비율 유지 정책을 먼저 정해야 합니다.",
      "같은 픽셀 값이라도 원본 비율이 다르면 실제 결과 해상도가 달라질 수 있습니다.",
      "리사이즈 후에는 흐림, 잘림, 파일명 규칙을 함께 검수해야 합니다.",
    ],
    sections: [
      {
        title: "작업 전에 먼저 정할 것",
        paragraphs: [
          "가장 먼저 정해야 할 것은 어디에 들어갈 이미지인지입니다. 썸네일, 상세 페이지, 문서 첨부, 메신저 전송은 권장 해상도와 비율이 서로 다릅니다.",
          "입력 파일들의 비율이 서로 다르다면, 같은 가로·세로를 강제로 넣을지 비율을 유지한 채 박스 안에 맞출지도 먼저 정해야 합니다.",
        ],
        bullets: [
          "목표 사용처의 권장 크기 확인하기",
          "가로형, 세로형, 정사각형 원본 비율 파악하기",
          "비율 유지 여부 먼저 고정하기",
          "파일명 규칙과 배치 저장 위치 정하기",
        ],
      },
      {
        title: "비율 유지와 프리셋 활용",
        paragraphs: [
          "비율 유지를 켜면 각 파일이 지정한 박스 안에 맞게 줄어들어 왜곡이 적습니다. 대신 결과 해상도는 파일마다 조금씩 달라질 수 있습니다.",
          "비율 유지를 끄면 모든 파일을 완전히 같은 해상도로 만들 수 있지만, 원본 비율이 다른 파일은 늘어나거나 눌린 것처럼 보일 수 있습니다.",
        ],
        bullets: [
          "대표 파일 1장을 기준으로 프리셋 먼저 점검하기",
          "상품 썸네일처럼 규격이 엄격하면 왜곡 허용 여부 확인하기",
          "문서 첨부용이면 비율 유지 쪽이 대체로 안전하기",
          "리사이즈 후 필요하면 압축까지 이어서 검토하기",
        ],
      },
      {
        title: "마지막 검수 체크리스트",
        paragraphs: [
          "배치 작업이 끝나면 해상도 숫자만 보지 말고 실제 미리보기로 흐림, 잘림, 여백 여부를 확인해야 합니다.",
          "같은 프로젝트 안에서 파일명을 일정하게 유지해 두면 업로드와 교체 작업이 훨씬 수월해집니다.",
        ],
        bullets: [
          "원본과 결과 해상도 비교하기",
          "텍스트나 상품 가장자리가 흐려지지 않았는지 보기",
          "저장 파일명에 규칙이 붙었는지 확인하기",
          "성공 파일만 ZIP으로 내려받아 한 번 더 검수하기",
        ],
      },
    ],
    relatedTools: ["resize-image", "compress-image"],
  },
] satisfies GuideRoute[];

export const requiredRoutes = [
  "/",
  "/tools",
  "/tools/compress-image",
  "/tools/resize-image",
  "/tools/convert-image",
  "/tools/remove-exif",
  "/guides",
  "/guides/image-compression-basics",
  "/guides/webp-vs-jpeg-vs-png",
  "/guides/remove-exif-for-privacy",
  "/guides/batch-resize-checklist",
  "/about",
  "/privacy",
  "/contact",
] as const;

export function getToolRoute<TSlug extends ToolSlug>(
  slug: TSlug,
): Extract<ToolRoute, { slug: TSlug }> {
  const tool = toolRoutes.find((entry) => entry.slug === slug);

  if (!tool) {
    throw new Error(`Unknown tool route: ${slug}`);
  }

  return tool as Extract<ToolRoute, { slug: TSlug }>;
}

export function getGuideRoute<TSlug extends GuideSlug>(
  slug: TSlug,
): Extract<GuideRoute, { slug: TSlug }> {
  const guide = guideRoutes.find((entry) => entry.slug === slug);

  if (!guide) {
    throw new Error(`Unknown guide route: ${slug}`);
  }

  return guide as Extract<GuideRoute, { slug: TSlug }>;
}

export function getGuidesForTool(toolSlug: ToolSlug) {
  return guideRoutes.filter((guide) =>
    guide.relatedTools.some((relatedToolSlug) => relatedToolSlug === toolSlug),
  );
}
