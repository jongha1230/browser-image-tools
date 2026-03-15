export const repositoryUrl = "https://github.com/jongha1230/browser-image-tools";
export const repositoryIssuesUrl = `${repositoryUrl}/issues`;
export const siteUpdatedAt = "2026-03-15T23:50:00+09:00";

export type ToolSlug =
  | "compress-image"
  | "resize-image"
  | "convert-image"
  | "remove-exif";

export type GuideSlug =
  | "resize-or-compress-first"
  | "transparent-image-conversion-checklist"
  | "why-converted-images-get-larger"
  | "batch-processing-preflight-checklist"
  | "browser-local-image-processing-limits"
  | "image-compression-basics"
  | "webp-vs-jpeg-vs-png"
  | "remove-exif-for-privacy"
  | "batch-resize-checklist";

export type GuideCluster = "core" | "cluster-01";

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
  categoryLabel: string;
  cluster: GuideCluster;
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
  relatedGuides: GuideSlug[];
};

export type ToolRoute =
  | ToolRouteBase<"compress-image">
  | ToolRouteBase<"resize-image">
  | ToolRouteBase<"convert-image">
  | ToolRouteBase<"remove-exif">;

export type GuideRoute =
  | GuideRouteBase<"resize-or-compress-first">
  | GuideRouteBase<"transparent-image-conversion-checklist">
  | GuideRouteBase<"why-converted-images-get-larger">
  | GuideRouteBase<"batch-processing-preflight-checklist">
  | GuideRouteBase<"browser-local-image-processing-limits">
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
    slug: "resize-or-compress-first",
    href: "/guides/resize-or-compress-first",
    categoryLabel: "작업 순서",
    cluster: "cluster-01",
    title: "리사이즈 먼저? 압축 먼저? 순서를 정하는 실전 기준",
    description:
      "해상도와 용량을 둘 다 줄여야 할 때 어떤 작업을 먼저 해야 재작업을 덜 하는지 정리한 가이드입니다.",
    metadataDescription:
      "이미지 리사이즈와 압축을 어떤 순서로 해야 하는지, 업로드 목적과 최종 규격에 따라 판단하는 한국어 가이드입니다.",
    intro:
      "둘 다 해야 할 때 순서를 잘못 잡으면 같은 이미지를 두 번 손보고도 결과가 어색해지기 쉽습니다. 핵심은 최종 픽셀 규격이 먼저 정해져 있는지, 아니면 해상도는 그대로 두고 용량만 줄이면 되는지를 먼저 가르는 것입니다.",
    readTime: "5분",
    publishedAt: "2026-03-15T23:50:00+09:00",
    updatedAt: "2026-03-15T23:50:00+09:00",
    focusPoints: [
      "최종 가로·세로 규격이 정해져 있으면 대체로 리사이즈를 먼저 하는 편이 안전합니다.",
      "해상도는 그대로 두고 업로드 제한만 맞추려는 경우라면 압축만으로 끝나는 경우도 많습니다.",
      "같은 파일을 여러 번 재인코딩할수록 텍스트 가장자리와 디테일이 먼저 무너질 수 있습니다.",
    ],
    sections: [
      {
        title: "먼저 최종 사용처를 고정하세요",
        paragraphs: [
          "상품 썸네일, 블로그 본문, 메신저 첨부처럼 최종으로 들어갈 자리의 크기가 정해져 있다면 리사이즈 여부가 먼저 결정됩니다. 해상도를 줄여도 되는 상황인지부터 정해야 압축 강도도 현실적으로 잡을 수 있습니다.",
          "반대로 원본 크기는 유지해야 하고 용량 제한만 넘는 상황이라면 굳이 리사이즈를 끼워 넣지 않는 편이 낫습니다. 같은 품질 저하를 감수하면서 해상도까지 줄이면 되돌리기 어려워집니다.",
        ],
        bullets: [
          "업로드 칸의 권장 픽셀 크기가 있는지 먼저 확인하기",
          "해상도 유지가 필요한 원본인지 구분하기",
          "썸네일용 파생본인지 최종 원본인지 나누기",
          "작업 후 다시 다른 규격으로 써야 하는지 생각하기",
        ],
      },
      {
        title: "리사이즈를 먼저 하는 편이 좋은 경우",
        paragraphs: [
          "최종 규격이 뚜렷할 때는 먼저 픽셀 수를 줄인 뒤 그 결과를 가볍게 압축하는 쪽이 예측하기 쉽습니다. 불필요하게 큰 해상도를 먼저 압축해 두면, 나중에 리사이즈하면서 다시 인코딩이 들어가 결과가 더 흐려질 수 있습니다.",
          "특히 상세 페이지용 사진, 문서 첨부 이미지, 고정된 썸네일 규격처럼 어차피 줄여야 하는 파일은 리사이즈 후 압축이 일반적으로 덜 손해입니다.",
        ],
        bullets: [
          "최종 픽셀이 명확한 썸네일과 배너",
          "문서 첨부처럼 너무 큰 원본이 오히려 불편한 경우",
          "여러 장을 같은 규격으로 맞춰야 하는 배치 작업",
        ],
      },
      {
        title: "압축만 먼저 보거나 압축으로 끝내도 되는 경우",
        paragraphs: [
          "사진의 해상도는 유지해야 하지만 업로드 제한만 넘는 경우라면 압축만으로 충분할 수 있습니다. 예를 들어 원본 크기를 그대로 보여 줘야 하는 게시판, 확대가 중요한 상품 사진은 리사이즈보다 압축 강도를 먼저 조정하는 편이 낫습니다.",
          "다만 압축을 세게 했는데도 파일이 크다면, 그때는 형식 변환이나 리사이즈를 같이 검토해야 합니다. 작업 순서를 고민하는 목적은 한 번에 끝내는 것이지, 모든 파일에 같은 공식을 억지로 적용하는 것이 아닙니다.",
        ],
        bullets: [
          "해상도 유지가 중요한 파일은 압축부터 시험하기",
          "대표 파일 1장으로 먼저 비교한 뒤 배치 적용하기",
          "압축 후에도 크면 리사이즈나 포맷 변환을 이어서 검토하기",
          "텍스트가 많은 캡처는 과한 재인코딩을 피하기",
        ],
      },
    ],
    relatedTools: ["resize-image", "compress-image"],
    relatedGuides: [
      "batch-processing-preflight-checklist",
      "why-converted-images-get-larger",
      "batch-resize-checklist",
    ],
  },
  {
    slug: "transparent-image-conversion-checklist",
    href: "/guides/transparent-image-conversion-checklist",
    categoryLabel: "포맷 변환",
    cluster: "cluster-01",
    title: "투명 배경 이미지를 변환할 때 놓치기 쉬운 점",
    description:
      "투명 배경 로고와 UI 캡처를 JPEG, PNG, WebP로 바꿀 때 생기기 쉬운 실수를 실제 작업 기준으로 정리한 가이드입니다.",
    metadataDescription:
      "투명 배경 이미지를 JPEG, PNG, WebP로 변환할 때 배경 손실과 가장자리 깨짐을 어떻게 점검할지 설명하는 한국어 가이드입니다.",
    intro:
      "투명 배경 이미지는 일반 사진보다 변환 실수가 더 눈에 띕니다. 배경이 사라지는 것보다, 흰 배경이 덮이거나 가장자리에 하얀 테두리가 생기는 문제가 실제 배포에서 더 자주 문제를 만듭니다.",
    readTime: "5분",
    publishedAt: "2026-03-15T23:50:00+09:00",
    updatedAt: "2026-03-15T23:50:00+09:00",
    focusPoints: [
      "JPEG는 투명도를 저장하지 못하므로 투명 배경 파일의 기본 선택지가 아닙니다.",
      "PNG와 WebP는 둘 다 투명 배경을 유지할 수 있지만, 재사용 목적과 호환성이 다릅니다.",
      "아이콘과 로고는 파일 크기보다 가장자리 번짐과 배경색 섞임을 먼저 확인해야 합니다.",
    ],
    sections: [
      {
        title: "먼저 투명 배경이 정말 필요한지 확인하세요",
        paragraphs: [
          "투명 배경은 아무 배경색 위에나 자연스럽게 놓기 위해 쓰는 경우가 많습니다. 사이트, 배너, 앱 UI, 발표 자료처럼 배경이 자주 바뀌는 곳에 쓸 예정이라면 투명도 유지가 핵심 조건입니다.",
          "반대로 흰색 카드 안에서만 쓸 작은 썸네일이라면 굳이 투명도를 유지하지 않아도 될 수 있습니다. 이 경우에는 JPEG처럼 더 단순한 형식이 관리하기 쉬울 때도 있습니다.",
        ],
        bullets: [
          "다른 배경색 위에 다시 올릴 이미지인지 확인하기",
          "로고, 아이콘, UI 캡처처럼 가장자리 선명도가 중요한지 보기",
          "최종 사용처가 WebP를 받는지 확인하기",
          "배경이 고정된 썸네일이면 투명도 유지가 꼭 필요한지 다시 보기",
        ],
      },
      {
        title: "PNG와 WebP 사이에서 고를 때",
        paragraphs: [
          "PNG는 편집 재사용과 선명한 가장자리 보존에 익숙한 선택지입니다. 대신 사진성 요소가 섞인 큰 이미지는 용량이 빠르게 커질 수 있습니다.",
          "WebP는 웹 배포에서 용량을 줄이기에 유리하지만, 최종 제출처나 외부 서비스가 아직 PNG만 가정하는 경우가 있습니다. 팀 내부 작업 파일은 PNG로 두고, 배포본만 WebP로 파생하는 흐름이 실무에서 자주 쓰입니다.",
        ],
        bullets: [
          "편집 원본과 재사용본은 PNG 쪽이 관리하기 쉬운 경우가 많습니다.",
          "웹 게시용 최종본은 WebP로 비교해 보기",
          "외부 업로드 호환성이 불명확하면 PNG로 먼저 안전하게 처리하기",
          "투명 배경 유지가 필요하면 JPEG는 기본 후보에서 빼기",
        ],
      },
      {
        title: "결과에서 꼭 봐야 하는 실수",
        paragraphs: [
          "투명 배경 이미지의 문제는 썸네일만 보면 잘 안 보일 수 있습니다. 밝은 배경과 어두운 배경 위에 각각 올려 보고, 가장자리 주변에 하얀 띠나 계단 현상이 생기지 않았는지 확인하는 편이 안전합니다.",
          "여러 장을 한 번에 변환할 때는 투명 배경 파일과 일반 사진 파일을 같은 큐에 섞지 않는 것이 좋습니다. 한쪽에 맞춘 형식 선택이 다른 쪽에는 손해가 되기 쉽기 때문입니다.",
        ],
        bullets: [
          "밝은 배경과 어두운 배경 위에서 각각 미리보기 하기",
          "아이콘 가장자리, 그림자, 반투명 영역 확인하기",
          "투명 배경 파일과 일반 사진을 배치 큐에서 분리하기",
          "JPEG 결과에서 흰 배경이 채워졌다면 형식 선택부터 다시 보기",
        ],
      },
    ],
    relatedTools: ["convert-image"],
    relatedGuides: [
      "webp-vs-jpeg-vs-png",
      "why-converted-images-get-larger",
      "image-compression-basics",
    ],
  },
  {
    slug: "why-converted-images-get-larger",
    href: "/guides/why-converted-images-get-larger",
    categoryLabel: "포맷 변환",
    cluster: "cluster-01",
    title: "변환했는데 파일이 더 커진 이유",
    description:
      "형식을 바꿨는데 오히려 용량이 늘어나는 대표적인 원인과 다음 판단 순서를 정리한 가이드입니다.",
    metadataDescription:
      "이미지 포맷 변환 후 파일이 더 커지는 이유와 형식, 해상도, 품질 설정을 다시 점검하는 방법을 설명하는 한국어 가이드입니다.",
    intro:
      "형식을 바꾸면 무조건 작아질 것 같지만 실제로는 그렇지 않습니다. 같은 픽셀 수라도 어떤 내용을 담은 이미지인지, 어떤 형식으로 저장했는지에 따라 결과가 더 커질 수 있습니다.",
    readTime: "4분",
    publishedAt: "2026-03-15T23:50:00+09:00",
    updatedAt: "2026-03-15T23:50:00+09:00",
    focusPoints: [
      "포맷 변환은 저장 방식을 바꾸는 일이지 자동으로 용량을 줄여 주는 마법이 아닙니다.",
      "투명 배경, 선명한 텍스트, 큰 해상도는 형식을 바꿔도 파일이 쉽게 작아지지 않습니다.",
      "변환 후 커졌다면 형식만 볼 것이 아니라 해상도와 품질 설정도 같이 봐야 합니다.",
    ],
    sections: [
      {
        title: "형식이 이미지 내용과 맞지 않을 수 있습니다",
        paragraphs: [
          "사진 중심 이미지라면 JPEG나 WebP가 잘 맞는 경우가 많지만, 캡처 화면이나 투명 배경 로고는 PNG가 더 자연스러운 경우가 있습니다. 문제는 반대로 바꿨을 때입니다. 형식 특성과 실제 이미지 내용이 맞지 않으면 오히려 더 큰 파일이 나올 수 있습니다.",
          "예를 들어 텍스트가 선명한 UI 캡처를 과하게 압축 가능한 형식으로 바꾸면 가장자리 품질을 지키기 위해 품질 값을 올려야 하고, 그 결과 용량 이점이 거의 사라질 수 있습니다.",
        ],
        bullets: [
          "사진 위주인지 텍스트·그래픽 위주인지 먼저 구분하기",
          "투명 배경과 반투명 그림자가 있는지 확인하기",
          "품질을 높여야만 보기 괜찮다면 형식 선택이 잘못됐을 가능성 보기",
        ],
      },
      {
        title: "해상도가 그대로면 용량도 쉽게 남습니다",
        paragraphs: [
          "포맷 변환은 기본적으로 픽셀 수를 줄이지 않습니다. 해상도가 크면 저장 방식만 바꿔서는 기대만큼 작아지지 않을 수 있습니다.",
          "특히 스마트폰 사진처럼 원본이 큰 파일은 먼저 리사이즈가 필요한 경우가 많습니다. 같은 4000픽셀대 이미지를 다른 형식으로만 바꾸는 것보다, 실제 사용 크기에 맞춰 줄인 뒤 다시 저장하는 편이 효과가 큽니다.",
        ],
        bullets: [
          "변환 전후 해상도가 같은지 확인하기",
          "썸네일이나 본문용이라면 먼저 목표 픽셀 크기 정하기",
          "크기 이득이 적으면 리사이즈와 압축을 같이 검토하기",
        ],
      },
      {
        title: "용량이 늘었을 때 다음 순서",
        paragraphs: [
          "가장 먼저 원본과 결과의 형식, 해상도, 품질 값을 같이 비교하세요. 그 다음 현재 파일이 정말 그 형식에 맞는지 판단하면 됩니다.",
          "실무에서는 변환 자체를 취소하고 원래 형식으로 돌아가는 선택도 충분히 합리적입니다. 중요한 것은 모든 파일을 억지로 한 형식으로 통일하는 것이 아니라, 사용처와 결과 품질이 맞는 쪽을 남기는 것입니다.",
        ],
        bullets: [
          "원본보다 커졌다면 다른 형식 후보를 한 번 더 비교하기",
          "해상도가 과하면 리사이즈를 먼저 적용하기",
          "필요 이상으로 높은 품질 값을 쓰지 않았는지 보기",
          "한 번에 모든 파일을 바꾸기 전에 대표 파일로 먼저 시험하기",
        ],
      },
    ],
    relatedTools: ["convert-image", "compress-image", "resize-image"],
    relatedGuides: [
      "resize-or-compress-first",
      "webp-vs-jpeg-vs-png",
      "transparent-image-conversion-checklist",
    ],
  },
  {
    slug: "batch-processing-preflight-checklist",
    href: "/guides/batch-processing-preflight-checklist",
    categoryLabel: "배치 작업",
    cluster: "cluster-01",
    title: "여러 장 처리 전에 확인할 배치 작업 점검표",
    description:
      "압축, 리사이즈, 변환을 여러 장에 한 번에 적용하기 전에 묶음 기준과 검수 순서를 정리한 가이드입니다.",
    metadataDescription:
      "이미지 여러 장을 브라우저에서 한 번에 압축·리사이즈·변환하기 전에 확인해야 할 묶음 기준과 검수 순서를 설명하는 한국어 가이드입니다.",
    intro:
      "배치 작업에서 시간을 가장 많이 잡아먹는 것은 처리 자체보다 재작업입니다. 파일을 한 큐에 넣기 전에 어떤 기준으로 묶고 어떤 파일로 먼저 시험할지 정해 두면 실수가 크게 줄어듭니다.",
    readTime: "5분",
    publishedAt: "2026-03-15T23:50:00+09:00",
    updatedAt: "2026-03-15T23:50:00+09:00",
    focusPoints: [
      "형식과 쓰임이 다른 파일을 한 큐에 섞지 않는 것이 배치 작업의 첫 단계입니다.",
      "대표 파일 1~2장으로 먼저 시험한 뒤 같은 설정을 넓히는 편이 안전합니다.",
      "저장 파일명, 출력 형식, ZIP 다운로드 계획까지 미리 정해야 마무리가 깔끔합니다.",
    ],
    sections: [
      {
        title: "먼저 같은 규칙으로 묶일 파일만 모으세요",
        paragraphs: [
          "사진, 스크린샷, 투명 배경 로고를 한 번에 같은 설정으로 처리하면 결과가 들쭉날쭉해지기 쉽습니다. 용도와 형식이 비슷한 파일끼리 먼저 나누면 품질 기준을 더 쉽게 통일할 수 있습니다.",
          "특히 배경이 투명한 파일과 일반 사진은 같은 변환 규칙으로 묶지 않는 것이 좋습니다. 같은 출력 형식이 모두에게 유리하지 않기 때문입니다.",
        ],
        bullets: [
          "사진 묶음과 캡처 묶음을 분리하기",
          "투명 배경 파일은 따로 모으기",
          "최종 사용처가 같은 파일끼리만 같은 큐에 넣기",
          "크기 조절과 포맷 변환을 동시에 할지 미리 결정하기",
        ],
      },
      {
        title: "대표 파일로 먼저 시험하세요",
        paragraphs: [
          "배치 도구가 있어도 처음부터 수십 장을 한 번에 처리할 필요는 없습니다. 가장 까다로워 보이는 파일 1~2장으로 먼저 결과를 확인하면 전체 실패를 피할 수 있습니다.",
          "대표 파일 시험에서는 용량만 보지 말고, 텍스트 가장자리, 투명 영역, 해상도, 파일명까지 함께 보아야 합니다. 이 과정을 건너뛰면 배치 작업의 속도 이점이 바로 사라집니다.",
        ],
        bullets: [
          "가장 큰 파일과 가장 복잡한 파일을 대표 샘플로 고르기",
          "원본 대비 해상도와 용량 변화를 같이 보기",
          "배경 손실이나 가장자리 번짐이 없는지 확인하기",
          "결과 파일명이 구분되게 붙는지 확인하기",
        ],
      },
      {
        title: "다운로드와 검수까지 한 흐름으로 정리하세요",
        paragraphs: [
          "여러 장 작업은 처리보다 저장 단계에서 더 자주 꼬입니다. 어느 파일을 개별 저장할지, ZIP으로 묶을지, 실패 파일은 어떻게 따로 확인할지 미리 생각해 두면 마무리가 훨씬 수월합니다.",
          "브라우저 로컬 처리에서는 탭을 닫거나 새로고침하면 작업 상태가 사라질 수 있으므로, 배치 한 번당 감당 가능한 양으로 나누는 습관도 중요합니다.",
        ],
        bullets: [
          "성공 파일만 ZIP으로 모을지 미리 정하기",
          "실패 파일은 별도로 다시 시도할 수 있게 구분하기",
          "한 번에 너무 많은 파일을 넣지 말고 묶음을 나누기",
          "다운로드 전 최종 미리보기와 파일명 규칙을 다시 보기",
        ],
      },
    ],
    relatedTools: ["compress-image", "resize-image", "convert-image"],
    relatedGuides: [
      "resize-or-compress-first",
      "browser-local-image-processing-limits",
      "batch-resize-checklist",
    ],
  },
  {
    slug: "browser-local-image-processing-limits",
    href: "/guides/browser-local-image-processing-limits",
    categoryLabel: "브라우저 처리",
    cluster: "cluster-01",
    title: "브라우저 로컬 이미지 처리의 현실적인 한계",
    description:
      "파일을 서버에 올리지 않는 대신 어떤 점을 기대할 수 있고 어디서 한계가 생기는지 정리한 가이드입니다.",
    metadataDescription:
      "브라우저 안에서만 이미지 처리할 때의 장점과 한계, 큰 파일과 많은 파일을 다룰 때 주의할 점을 설명하는 한국어 가이드입니다.",
    intro:
      "브라우저 로컬 처리는 프라이버시와 접근성 면에서 장점이 크지만, 아무 제약 없이 무거운 작업을 감당하는 구조는 아닙니다. 실제 한계를 알고 써야 작업 흐름이 덜 끊깁니다.",
    readTime: "4분",
    publishedAt: "2026-03-15T23:50:00+09:00",
    updatedAt: "2026-03-15T23:50:00+09:00",
    focusPoints: [
      "파일이 서버로 올라가지 않는 대신, 처리 성능은 현재 기기와 브라우저 상태에 크게 좌우됩니다.",
      "아주 큰 파일이나 많은 파일을 한 번에 다루면 속도 저하와 부분 실패가 생길 수 있습니다.",
      "탭을 닫거나 새로고침하면 작업 상태가 유지되지 않는 점을 전제로 써야 합니다.",
    ],
    sections: [
      {
        title: "로컬 처리의 장점은 분명합니다",
        paragraphs: [
          "파일을 외부 서버에 업로드하지 않는 구조는 프라이버시와 속도 면에서 분명한 이점이 있습니다. EXIF 제거처럼 민감한 사진을 다룰 때도 심리적 부담이 훨씬 적습니다.",
          "또한 계정, 대기열, 클라우드 저장 없이 바로 처리하고 내려받는 흐름이 가능해 작은 작업에는 매우 빠릅니다.",
        ],
        bullets: [
          "서버 업로드 없이 현재 브라우저 안에서 처리됨",
          "민감한 이미지도 비교적 부담 없이 정리 가능",
          "로그인이나 업로드 대기 없이 바로 시작 가능",
        ],
      },
      {
        title: "어디서 한계가 드러나는가",
        paragraphs: [
          "처리 성능은 브라우저와 기기 메모리에 영향을 받습니다. 큰 해상도 이미지가 많아질수록 처리 시간이 길어지고, 일부 파일만 실패하는 상황도 생길 수 있습니다.",
          "또한 브라우저에서 다시 저장할 수 없는 형식은 애초에 지원되지 않습니다. 이 제품도 JPEG, PNG, WebP만 대상으로 삼는 이유가 여기에 있습니다.",
        ],
        bullets: [
          "매우 큰 이미지와 많은 파일을 한 번에 넣으면 느려질 수 있음",
          "모바일보다 데스크톱 브라우저가 안정적인 경우가 많음",
          "지원 형식 밖의 파일은 처리할 수 없음",
          "탭 종료나 새로고침 시 현재 작업 상태가 사라짐",
        ],
      },
      {
        title: "실제로는 이렇게 대응하면 됩니다",
        paragraphs: [
          "한 번에 모든 파일을 밀어 넣기보다, 작업 목적이 같은 파일끼리 나눠서 처리하세요. 문제가 생기면 다시 시도해야 할 범위가 작아져 훨씬 관리하기 쉽습니다.",
          "특히 배치 작업 전에는 대표 파일로 먼저 확인하고, 큰 작업은 데스크톱 브라우저에서 진행하는 편이 안정적입니다. 로컬 처리의 장점을 살리려면 작업 규모도 로컬에 맞게 나누는 감각이 필요합니다.",
        ],
        bullets: [
          "파일을 용도별로 나눠 작은 배치로 처리하기",
          "큰 작업은 데스크톱 브라우저에서 먼저 시도하기",
          "대표 파일로 결과를 확인한 뒤 전체 적용하기",
          "다운로드를 마치기 전에는 탭을 닫지 않기",
        ],
      },
    ],
    relatedTools: [
      "compress-image",
      "resize-image",
      "convert-image",
      "remove-exif",
    ],
    relatedGuides: [
      "batch-processing-preflight-checklist",
      "remove-exif-for-privacy",
      "batch-resize-checklist",
    ],
  },
  {
    slug: "image-compression-basics",
    href: "/guides/image-compression-basics",
    categoryLabel: "압축 기준",
    cluster: "core",
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
    relatedGuides: [
      "resize-or-compress-first",
      "why-converted-images-get-larger",
      "webp-vs-jpeg-vs-png",
    ],
  },
  {
    slug: "webp-vs-jpeg-vs-png",
    href: "/guides/webp-vs-jpeg-vs-png",
    categoryLabel: "포맷 선택",
    cluster: "core",
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
    relatedGuides: [
      "transparent-image-conversion-checklist",
      "why-converted-images-get-larger",
      "image-compression-basics",
    ],
  },
  {
    slug: "remove-exif-for-privacy",
    href: "/guides/remove-exif-for-privacy",
    categoryLabel: "개인정보",
    cluster: "core",
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
    relatedGuides: [
      "browser-local-image-processing-limits",
      "batch-processing-preflight-checklist",
    ],
  },
  {
    slug: "batch-resize-checklist",
    href: "/guides/batch-resize-checklist",
    categoryLabel: "리사이즈",
    cluster: "core",
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
    relatedGuides: [
      "batch-processing-preflight-checklist",
      "resize-or-compress-first",
      "browser-local-image-processing-limits",
    ],
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
  "/guides/resize-or-compress-first",
  "/guides/transparent-image-conversion-checklist",
  "/guides/why-converted-images-get-larger",
  "/guides/batch-processing-preflight-checklist",
  "/guides/browser-local-image-processing-limits",
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
