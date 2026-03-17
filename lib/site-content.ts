export const repositoryUrl = "https://github.com/jongha1230/browser-image-tools";
export const repositoryIssuesUrl = `${repositoryUrl}/issues`;
export const contactEmail = "browserimagetools@gmail.com";
export const contactEmailHref = `mailto:${contactEmail}`;
export const siteUpdatedAt = "2026-03-17T11:45:00+09:00";

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
  | "blog-cms-image-prep-checklist"
  | "product-thumbnail-image-settings"
  | "avoid-repeat-export-quality-loss"
  | "when-png-is-the-wrong-choice"
  | "blog-image-upload-final-checklist"
  | "listing-image-resize-vs-compress"
  | "detail-image-upload-mistakes"
  | "batch-cleanup-before-product-upload"
  | "image-compression-basics"
  | "webp-vs-jpeg-vs-png"
  | "remove-exif-for-privacy"
  | "batch-resize-checklist";

export type GuideCluster = "core" | "cluster-01" | "cluster-02" | "cluster-03";

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
  | GuideRouteBase<"blog-cms-image-prep-checklist">
  | GuideRouteBase<"product-thumbnail-image-settings">
  | GuideRouteBase<"avoid-repeat-export-quality-loss">
  | GuideRouteBase<"when-png-is-the-wrong-choice">
  | GuideRouteBase<"blog-image-upload-final-checklist">
  | GuideRouteBase<"listing-image-resize-vs-compress">
  | GuideRouteBase<"detail-image-upload-mistakes">
  | GuideRouteBase<"batch-cleanup-before-product-upload">
  | GuideRouteBase<"image-compression-basics">
  | GuideRouteBase<"webp-vs-jpeg-vs-png">
  | GuideRouteBase<"remove-exif-for-privacy">
  | GuideRouteBase<"batch-resize-checklist">;

export const siteName = "브라우저 이미지 툴";
export const siteTagline = "업로드 전 이미지 정리, 브라우저 로컬 처리";
export const siteDescription =
  "블로그 업로드 전 점검, 썸네일·상품 이미지 준비를 위해 이미지 압축, 리사이즈, 포맷 변환, EXIF 제거와 배치 내보내기를 브라우저에서 처리하는 로컬 이미지 도구입니다.";

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
    title: "이미지 압축 도구",
    shortLabel: "압축",
    description:
      "블로그 업로드 전 점검과 썸네일·상품 이미지 용량 정리에 맞춘 로컬 이미지 압축 도구입니다.",
    metadataDescription:
      "블로그 업로드 전 점검과 썸네일·상품 이미지 준비를 위해 JPEG, PNG, WebP 이미지 용량을 브라우저에서 줄이고 여러 장 결과를 저장하는 로컬 이미지 압축 도구입니다.",
    intro:
      "업로드 전에 사진과 캡처 용량을 여러 장 한 번에 줄이고, 결과를 비교해 바로 저장하는 흐름에 맞춰 구성했습니다.",
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
    title: "이미지 리사이즈 도구",
    shortLabel: "리사이즈",
    description:
      "썸네일, 상품 이미지, 블로그 본문 규격을 맞추는 로컬 이미지 리사이즈 도구입니다.",
    metadataDescription:
      "썸네일, 상품 이미지, 블로그 업로드용 JPEG, PNG, WebP 해상도를 브라우저에서 맞추고 여러 장 결과를 저장하는 이미지 리사이즈 도구입니다.",
    intro:
      "블로그 대표 이미지, 썸네일, 상품 이미지처럼 크기 기준이 있는 파일을 여러 장 한 번에 같은 흐름으로 맞출 수 있습니다.",
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
    title: "이미지 포맷 변환 도구",
    shortLabel: "변환",
    description:
      "블로그 업로드, 썸네일, 상세 이미지 준비에 맞춰 JPEG, PNG, WebP를 정리하는 로컬 이미지 변환 도구입니다.",
    metadataDescription:
      "블로그 업로드와 썸네일·상품 이미지 준비를 위해 JPEG, PNG, WebP 이미지를 브라우저에서 다른 형식으로 변환하고 여러 장 결과를 저장하는 로컬 이미지 변환 도구입니다.",
    intro:
      "사진, 캡처, 로고를 업로드 목적에 맞는 형식으로 여러 장 한 번에 바꾸고 용량과 호환성을 함께 점검할 수 있습니다.",
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
    title: "사진 EXIF 제거 도구",
    shortLabel: "EXIF 제거",
    description:
      "공개 업로드나 공유 전에 위치, 기기, 촬영 시각 같은 EXIF 메타데이터를 정리하는 로컬 EXIF 제거 도구입니다.",
    metadataDescription:
      "블로그 첨부와 공개 공유 전에 사진 EXIF 메타데이터를 브라우저에서 재저장 방식으로 정리하고 여러 장 결과를 저장하는 로컬 EXIF 제거 도구입니다.",
    intro:
      "블로그 첨부, 중고거래, 제보용 이미지처럼 공유 전 메타데이터 점검이 필요한 파일을 여러 장 한 번에 다시 저장할 수 있습니다.",
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
      "avoid-repeat-export-quality-loss",
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
    title: "이미지 변환 후 파일이 더 커지는 이유",
    description:
      "형식을 바꿨는데 오히려 용량이 늘어나는 대표적인 원인과 다시 점검할 순서를 정리한 가이드입니다.",
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
      "blog-cms-image-prep-checklist",
      "batch-cleanup-before-product-upload",
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
      "브라우저 로컬 처리는 프라이버시와 접근성 면에서 장점이 크지만, 서버가 대신 버텨 주는 구조는 아닙니다. 실제로는 현재 기기 성능, 브라우저 구현, 메모리 여유가 처리 경험을 크게 좌우합니다.",
    readTime: "5분",
    publishedAt: "2026-03-15T23:50:00+09:00",
    updatedAt: "2026-03-16T16:29:00+09:00",
    focusPoints: [
      "최신 Chrome, Edge 같은 Chromium 계열 데스크톱 브라우저를 가장 먼저 권장하고, 다른 브라우저는 필요한 웹 API 지원 여부를 먼저 봐야 합니다.",
      "백그라운드 작업자(Web Worker)를 쓰지 못하는 환경에서는 메인 스레드로 폴백하며, 이때 탭 반응이 더 느려질 수 있습니다.",
      "아주 큰 파일, 많은 파일, 반복 ZIP 내보내기는 브라우저 메모리와 기기 성능 한계에 직접 닿기 쉽습니다.",
    ],
    sections: [
      {
        title: "왜 로컬 처리여도 브라우저 차이가 중요한가",
        paragraphs: [
          "같은 사이트라도 브라우저가 제공하는 Canvas, Blob, 다운로드 링크, Web Worker, 이미지 재인코딩 지원 범위가 조금씩 다를 수 있습니다. 로컬 처리 도구는 바로 이 브라우저 기능 위에서 동작하므로, 서버형 도구보다 브라우저 차이의 영향을 더 직접 받습니다.",
          "이 프로젝트도 최신 Chrome, Edge 같은 Chromium 계열 데스크톱 브라우저를 가장 먼저 권장합니다. Safari와 Firefox에서도 필요한 API가 모두 동작하면 사용할 수 있지만, 공개적으로 넓은 수동 검증 범위를 약속하는 단계는 아닙니다.",
        ],
        bullets: [
          "권장 환경은 최신 Chromium 계열 데스크톱 브라우저",
          "다른 브라우저는 동작 가능성과 검증 범위를 분리해서 보는 편이 안전함",
          "브라우저 기능 차이가 곧 처리 가능 범위 차이로 이어질 수 있음",
        ],
      },
      {
        title: "워커가 안 될 때 실제로 무슨 일이 생기나",
        paragraphs: [
          "브라우저가 Web Worker, OffscreenCanvas, `convertToBlob` 같은 백그라운드 처리 경로를 온전히 지원하면 작업 중 화면 반응성이 더 낫습니다. 하지만 이 경로가 막히거나 초기화에 실패하는 환경도 실제로 존재합니다.",
          "그런 경우 이 사이트는 작업을 중단하기보다 메인 스레드에서 같은 처리 파이프라인을 이어갑니다. 결과 형식과 저장 흐름은 같지만, 처리 중에는 스크롤과 입력 반응이 둔해질 수 있고 큰 배치일수록 체감 차이가 커집니다.",
        ],
        bullets: [
          "워커 우선, 실패 시 메인 스레드 폴백",
          "폴백 시 결과 품질이 달라지기보다 탭 반응성이 먼저 달라짐",
          "큰 작업일수록 백그라운드 처리 가능 여부가 체감에 영향을 줌",
        ],
      },
      {
        title: "큰 파일과 배치 작업이 느린 이유",
        paragraphs: [
          "브라우저 로컬 처리에서는 원본 읽기, 캔버스 그리기, 결과 Blob 생성, ZIP 묶기까지 모두 현재 탭 메모리 안에서 진행됩니다. 파일 수가 늘거나 해상도가 커질수록 계산량과 메모리 사용량이 같이 커져 처리 시간이 길어집니다.",
          "특히 배치 ZIP 내보내기와 반복 재시도는 같은 세션 안에서 메모리 사용량을 빠르게 늘릴 수 있습니다. 모바일보다 데스크톱이 대체로 안정적인 이유도 여기에 있습니다.",
        ],
        bullets: [
          "대용량 이미지 여러 장은 같은 세션에서 느려질 가능성이 큼",
          "ZIP 생성도 브라우저 메모리를 추가로 사용함",
          "반복 내보내기 전에 기존 결과를 먼저 내려받는 편이 안전함",
        ],
      },
      {
        title: "실제로는 이렇게 대응하면 됩니다",
        paragraphs: [
          "로컬 처리의 장점을 살리려면 작업 규모도 로컬 환경에 맞게 나누는 편이 좋습니다. 사진, 캡처, 투명 배경 로고처럼 특성이 다른 파일을 한 번에 섞기보다 용도별로 나누면 실패 원인을 파악하기도 쉽습니다.",
          "배치 작업 전에는 대표 파일 1장으로 먼저 결과를 보고, 큰 작업은 데스크톱 브라우저에서 시도하세요. 탭을 닫거나 새로고침하면 현재 큐와 결과가 유지되지 않는 점도 항상 전제로 두는 편이 안전합니다.",
        ],
        bullets: [
          "대표 파일로 먼저 확인한 뒤 전체 배치 적용하기",
          "큰 작업은 모바일보다 데스크톱 브라우저에서 먼저 시도하기",
          "지원 범위는 JPEG, PNG, WebP까지만 가정하기",
          "다운로드를 끝내기 전에는 탭을 닫거나 새로고침하지 않기",
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
    slug: "blog-cms-image-prep-checklist",
    href: "/guides/blog-cms-image-prep-checklist",
    categoryLabel: "블로그 / CMS",
    cluster: "cluster-02",
    title: "블로그·CMS 업로드 전 이미지 준비 체크리스트",
    description:
      "블로그나 CMS에 올리기 전에 대표 이미지, 본문 이미지, 캡처를 어떤 순서로 리사이즈·압축·변환할지 정리한 가이드입니다.",
    metadataDescription:
      "블로그·CMS 업로드 전에 대표 이미지, 본문 이미지, 캡처 파일을 리사이즈·압축·포맷 변환 기준으로 정리하는 한국어 가이드입니다.",
    intro:
      "블로그 에디터와 CMS는 업로드 후 자동 리사이즈를 해 주기도 하지만, 결과가 항상 예측 가능하지는 않습니다. 미리 픽셀 크기와 형식을 정리해 두면 업로드 실패와 본문 흐림을 훨씬 줄일 수 있습니다.",
    readTime: "5분",
    publishedAt: "2026-03-16T15:30:00+09:00",
    updatedAt: "2026-03-16T15:30:00+09:00",
    focusPoints: [
      "대표 이미지와 본문 이미지는 같은 크기와 용량 목표로 묶지 않는 편이 안전합니다.",
      "사진 본문, 캡처, 배너는 서로 다른 형식이 더 잘 맞습니다.",
      "에디터가 자동으로 줄여 보여 줘도 원본이 너무 크면 업로드 속도와 재작업만 늘어납니다.",
    ],
    sections: [
      {
        title: "먼저 들어갈 자리를 나누세요",
        paragraphs: [
          "블로그나 CMS는 대표 이미지, 본문 삽입 이미지, 캡처, 배너가 각각 다른 크기로 들어가는 경우가 많습니다. 업로드 전에 자리를 먼저 나눠 두면 한 묶음에 같은 기준을 적용하기 쉬워집니다.",
          "특히 대표 이미지는 카드나 목록에서 먼저 보이고, 본문 이미지는 실제 읽는 화면 폭에 맞춰 보입니다. 같은 파일 하나로 두 자리를 모두 해결하려 하면 용량도 애매하고 선명도도 애매해지기 쉽습니다.",
        ],
        bullets: [
          "대표 이미지와 본문 삽입 이미지를 분리해 목록 만들기",
          "가로 폭이 고정된 템플릿이면 그 규격부터 확인하기",
          "본문 캡처와 사진 파일을 같은 묶음으로 처리하지 않기",
          "에디터 축소 표시만으로 끝나는지 실제 리사이즈가 필요한지 확인하기",
        ],
      },
      {
        title: "사진, 캡처, 배너를 같은 형식으로 맞추지 마세요",
        paragraphs: [
          "본문 사진은 JPEG나 WebP가 더 현실적인 경우가 많고, 텍스트가 선명한 캡처는 PNG나 WebP가 더 깔끔할 수 있습니다. 형식 선택을 한 번에 통일하려 하면 어느 한쪽은 손해를 보기 쉽습니다.",
          "배경이 있는 사진과 투명 배경 배너도 분리해서 생각하는 편이 낫습니다. 특히 블로그 스킨이나 CMS 카드가 흰색이 아닐 수 있다면 투명 배경 유지 여부를 먼저 확인해야 합니다.",
        ],
        bullets: [
          "사진 중심 본문은 JPEG 또는 WebP부터 비교하기",
          "텍스트가 많은 캡처는 PNG 또는 WebP로 먼저 확인하기",
          "배너와 로고는 투명 배경 유지가 필요한지 먼저 보기",
          "변환 후 용량이 기대보다 크면 형식과 해상도를 같이 다시 보기",
        ],
      },
      {
        title: "게시 전에 마지막으로 볼 것",
        paragraphs: [
          "업로드 직전에는 파일 크기 숫자보다 실제 편집기 미리보기를 보는 편이 중요합니다. 모바일 폭에서 본문 캡처의 글자가 읽히는지, 대표 이미지가 카드 영역에서 지나치게 답답해 보이지 않는지를 먼저 확인하세요.",
          "또한 업로드 한도에 맞추려고 이미지를 여러 번 다시 저장하기 시작하면 품질이 빨리 무너질 수 있습니다. 대표 이미지 1장과 본문 이미지 1장으로 먼저 시험한 뒤 전체에 적용하는 편이 훨씬 안전합니다.",
        ],
        bullets: [
          "대표 이미지 1장과 본문 캡처 1장으로 먼저 업로드 테스트하기",
          "모바일 미리보기에서 텍스트와 상품 가장자리 흐림 확인하기",
          "업로드 한도가 있으면 압축 후 결과 용량 다시 보기",
          "변환된 파일명이 헷갈리지 않게 정리된 상태로 저장하기",
        ],
      },
    ],
    relatedTools: ["resize-image", "compress-image", "convert-image"],
    relatedGuides: [
      "blog-image-upload-final-checklist",
      "detail-image-upload-mistakes",
      "resize-or-compress-first",
      "webp-vs-jpeg-vs-png",
      "batch-processing-preflight-checklist",
    ],
  },
  {
    slug: "product-thumbnail-image-settings",
    href: "/guides/product-thumbnail-image-settings",
    categoryLabel: "쇼핑몰 이미지",
    cluster: "cluster-02",
    title: "쇼핑몰 상품 썸네일·리스트 이미지 설정 가이드",
    description:
      "쇼핑몰 썸네일, 상품 리스트 카드, 대표 이미지를 여러 장 준비할 때 해상도와 형식 기준을 정리한 가이드입니다.",
    metadataDescription:
      "쇼핑몰 상품 썸네일과 리스트 이미지를 준비할 때 해상도, 배경, 압축 강도, 포맷 선택 기준을 설명하는 한국어 가이드입니다.",
    intro:
      "상품 이미지는 한 장만 예쁘게 만드는 작업이 아니라, 여러 장이 나란히 놓였을 때 일관되게 보여야 하는 작업입니다. 리스트용과 확대용을 같은 파일 하나로 해결하려 하면 품질과 용량 둘 다 애매해지기 쉽습니다.",
    readTime: "5분",
    publishedAt: "2026-03-16T15:30:00+09:00",
    updatedAt: "2026-03-16T15:30:00+09:00",
    focusPoints: [
      "리스트 썸네일은 일관성이 우선이고, 확대용 상세 이미지는 별도 파생본으로 보는 편이 안전합니다.",
      "배경 제거 컷과 일반 사진은 같은 형식과 압축 설정으로 묶지 않는 편이 낫습니다.",
      "한 상품군에서 대표 샘플 2~3장만 먼저 맞춰 보면 배치 실수를 크게 줄일 수 있습니다.",
    ],
    sections: [
      {
        title: "썸네일용과 확대용을 분리해서 생각하세요",
        paragraphs: [
          "상품 목록 카드에서 보이는 썸네일은 일정한 크기와 빠른 로딩이 중요합니다. 반면 상세 페이지에서 확대해 보는 이미지는 디테일 유지가 더 중요하므로 같은 파일 하나로 두 역할을 모두 맡기지 않는 편이 낫습니다.",
          "특히 확대가 필요한 상품이라면 리스트 썸네일을 먼저 작게 맞추고, 상세용은 조금 더 큰 파생본으로 따로 남겨 두는 흐름이 재작업을 줄입니다.",
        ],
        bullets: [
          "리스트 카드에서 실제로 보이는 최대 크기 확인하기",
          "상세 확대용은 별도 원본 또는 큰 파생본으로 남기기",
          "작은 썸네일 파일을 다른 용도로 다시 키워 쓰지 않기",
          "업로드 슬롯별 권장 규격을 먼저 메모해 두기",
        ],
      },
      {
        title: "배경과 가장자리 특성에 따라 형식을 고르세요",
        paragraphs: [
          "일반 상품 사진은 JPEG나 WebP가 훨씬 가볍게 정리되는 경우가 많습니다. 반대로 누끼 이미지, 로고, 단색 배경 위에 떠 있는 상품 컷은 PNG나 WebP가 더 자연스러울 수 있습니다.",
          "중요한 점은 한 번 정한 형식을 모든 이미지에 밀어 넣지 않는 것입니다. 흰 배경 제품 사진과 투명 배경 소스는 비교 기준 자체가 다르기 때문입니다.",
        ],
        bullets: [
          "일반 상품 사진은 JPEG 또는 WebP부터 비교하기",
          "투명 배경 상품 컷은 PNG 또는 WebP로 먼저 검토하기",
          "배경이 섞인 파일과 누끼 파일을 같은 배치 큐에 넣지 않기",
          "리스트용은 용량 우선, 상세용은 확대 품질 우선으로 보기",
        ],
      },
      {
        title: "배치 리사이즈에서 자주 망가지는 부분",
        paragraphs: [
          "가로형, 세로형, 정사각형 원본이 섞여 있는데 모두 같은 가로·세로 값으로 밀어 넣으면 왜곡된 결과가 나오기 쉽습니다. 이 사이트는 크기 조절은 지원하지만 크롭은 제공하지 않기 때문에, 비율이 다른 파일은 더더욱 묶음을 나누는 편이 낫습니다.",
          "규격을 엄격하게 맞춰야 하는 플랫폼이라면 비율 유지 여부를 먼저 결정하고 샘플 몇 장으로 실제 리스트 카드에 올려 보는 편이 안전합니다.",
        ],
        bullets: [
          "비율이 다른 원본은 별도 묶음으로 나누기",
          "비율 유지를 끌 때는 왜곡 허용 범위를 먼저 확인하기",
          "리스트 카드에서 잘 보이는지 샘플 업로드로 먼저 확인하기",
          "한 번에 전체 상품군에 적용하기 전에 대표 파일로 시험하기",
        ],
      },
      {
        title: "업로드 전 샘플 검수 순서",
        paragraphs: [
          "썸네일 작업은 숫자보다 비교 화면이 중요합니다. 실제 상품 목록처럼 여러 장을 나란히 놓고 봤을 때, 특정 상품만 유독 흐리거나 지나치게 무거운 파일로 남지 않았는지 확인해야 합니다.",
          "이 검수는 데스크톱뿐 아니라 모바일 목록에서도 해 보는 편이 좋습니다. 작은 화면에서 텍스트 라벨과 상품 윤곽이 먼저 무너지는 경우가 많기 때문입니다.",
        ],
        bullets: [
          "대표 상품 2~3개를 같은 리스트 화면에서 비교하기",
          "모바일 목록에서 상품 윤곽과 텍스트 가독성 확인하기",
          "확대용 상세 이미지와 썸네일이 섞여 저장되지 않았는지 보기",
          "결과 파일명을 상품군 기준으로 정리한 뒤 내려받기",
        ],
      },
    ],
    relatedTools: ["resize-image", "compress-image", "convert-image"],
    relatedGuides: [
      "listing-image-resize-vs-compress",
      "batch-cleanup-before-product-upload",
      "batch-resize-checklist",
      "image-compression-basics",
      "transparent-image-conversion-checklist",
    ],
  },
  {
    slug: "avoid-repeat-export-quality-loss",
    href: "/guides/avoid-repeat-export-quality-loss",
    categoryLabel: "품질 유지",
    cluster: "cluster-02",
    title: "여러 번 저장할수록 화질이 무너지는 이유와 피하는 법",
    description:
      "같은 이미지를 반복해서 압축·리사이즈·변환할 때 품질이 왜 무너지는지와 손실을 줄이는 순서를 정리한 가이드입니다.",
    metadataDescription:
      "반복 저장과 재변환으로 이미지 품질이 나빠지는 이유, 그리고 브라우저 도구에서 손실을 줄이는 작업 순서를 설명하는 한국어 가이드입니다.",
    intro:
      "문제는 한 번의 압축보다, 작은 수정이 생길 때마다 같은 파일을 다시 내보내는 습관입니다. 저장 횟수가 늘수록 블록 노이즈, 텍스트 번짐, 가장자리 깨짐이 조금씩 누적됩니다.",
    readTime: "4분",
    publishedAt: "2026-03-16T15:30:00+09:00",
    updatedAt: "2026-03-16T15:30:00+09:00",
    focusPoints: [
      "반복 재저장은 한 번의 강한 설정보다 더 지저분한 결과를 만들 수 있습니다.",
      "최종 사용처가 정해질 때까지는 원본이나 큰 마스터를 따로 두는 편이 안전합니다.",
      "작은 이미지를 다시 키우거나 PNG와 JPEG를 여러 번 오가도 품질은 돌아오지 않습니다.",
    ],
    sections: [
      {
        title: "품질이 무너지는 대표 패턴",
        paragraphs: [
          "가장 흔한 실수는 JPEG를 한 번 압축한 뒤, 다시 크기를 줄이고, 다시 다른 서비스용으로 저장하는 식으로 같은 파일을 계속 돌려 쓰는 것입니다. 첫 번째 저장에서는 괜찮아 보여도 두세 번 지나면 텍스트 주변과 얇은 선이 먼저 무너집니다.",
          "캡처 이미지를 JPEG로 바꿨다가 다시 PNG로 돌리는 것도 품질을 복구하는 방법이 아닙니다. 한 번 손실된 가장자리는 형식을 다시 바꿔도 원래 상태로 돌아오지 않습니다.",
        ],
        bullets: [
          "이미 압축된 JPEG를 다시 압축해서 저장하기",
          "작은 썸네일을 다른 용도로 다시 키워 쓰기",
          "PNG와 JPEG, WebP를 여러 번 오가며 비교하기",
          "플랫폼마다 다른 파일을 만들면서 같은 파생본을 재사용하기",
        ],
      },
      {
        title: "원본 한 장, 파생본 여러 장으로 나누세요",
        paragraphs: [
          "품질 손실을 줄이는 가장 쉬운 방법은 손대지 않은 원본이나 큰 마스터를 따로 두고, 최종 사용처별 파생본만 새로 만드는 것입니다. 이렇게 하면 블로그용, 썸네일용, 메신저용 파일을 각각 다시 만들더라도 손실이 누적되지 않습니다.",
          "특히 여러 플랫폼에 올릴 예정이라면 가장 먼저 해야 할 일은 마스터 보관입니다. 용량이 조금 더 들더라도, 다시 시작할 기준점이 있으면 결과가 훨씬 안정적입니다.",
        ],
        bullets: [
          "원본 또는 큰 마스터 파일은 따로 보관하기",
          "최종 사용처마다 새 파생본을 원본에서 다시 만들기",
          "한 번 만든 작은 파일을 다른 작업의 출발점으로 쓰지 않기",
          "파일명에 용도와 규격을 붙여 파생본을 구분하기",
        ],
      },
      {
        title: "이 사이트에서 작업할 때 손실을 줄이는 순서",
        paragraphs: [
          "최종 픽셀 규격이 정해져 있다면 먼저 크기를 맞추고, 형식이 바뀌어야 하는 이유가 있을 때만 포맷 변환을 거친 뒤, 마지막에 필요한 만큼만 압축하는 편이 예측하기 쉽습니다.",
          "반대로 해상도를 유지해야 하는 파일은 압축만 먼저 시험하고, 그 결과가 부족할 때만 형식 변환이나 리사이즈를 검토하세요. 핵심은 같은 파생본을 계속 다시 저장하지 않는 것입니다.",
        ],
        bullets: [
          "최종 규격이 있으면 리사이즈를 먼저 보기",
          "형식 변경은 호환성이나 투명도 이유가 있을 때만 적용하기",
          "최종본 직전에 한 번만 압축 강도를 조정하기",
          "대표 파일로 먼저 확인한 뒤 같은 설정을 전체에 적용하기",
        ],
      },
    ],
    relatedTools: ["compress-image", "resize-image", "convert-image"],
    relatedGuides: [
      "resize-or-compress-first",
      "why-converted-images-get-larger",
      "image-compression-basics",
    ],
  },
  {
    slug: "when-png-is-the-wrong-choice",
    href: "/guides/when-png-is-the-wrong-choice",
    categoryLabel: "포맷 선택",
    cluster: "cluster-02",
    title: "PNG가 항상 안전한 선택은 아닌 이유",
    description:
      "PNG를 습관처럼 고르면 오히려 업로드 용량과 작업 속도가 나빠지는 상황을 이미지 유형별로 정리한 가이드입니다.",
    metadataDescription:
      "PNG가 유리한 경우와 손해인 경우, 사진·썸네일·캡처마다 JPEG와 WebP로 바꿔 볼 기준을 설명하는 한국어 가이드입니다.",
    intro:
      "PNG는 선명하고 익숙해서 기본값처럼 쓰이지만, 실제 업로드에서는 필요 이상으로 큰 파일을 만들기 쉽습니다. 투명 배경이나 텍스트 캡처가 아니라면 먼저 PNG가 꼭 필요한지부터 다시 보는 편이 낫습니다.",
    readTime: "4분",
    publishedAt: "2026-03-16T15:30:00+09:00",
    updatedAt: "2026-03-16T15:30:00+09:00",
    focusPoints: [
      "투명 배경과 선명한 UI 캡처가 아니라면 PNG가 과할 수 있습니다.",
      "사진성 이미지와 상품 썸네일은 JPEG 또는 WebP가 더 현실적인 경우가 많습니다.",
      "PNG 결과가 무겁다면 압축 강도보다 형식 선택을 먼저 다시 봐야 합니다.",
    ],
    sections: [
      {
        title: "PNG가 맞는 경우부터 분리하세요",
        paragraphs: [
          "PNG는 투명 배경, 선명한 텍스트, 로고, UI 캡처처럼 가장자리 보존이 중요한 파일에 잘 맞습니다. 이런 이미지까지 무조건 JPEG로 밀어 넣으면 배경 손실이나 가장자리 번짐이 먼저 눈에 띕니다.",
          "즉 PNG가 나쁜 것이 아니라, 정말 필요한 파일과 습관적으로 PNG를 쓰는 파일을 구분하는 것이 중요합니다.",
        ],
        bullets: [
          "투명 배경이 필요한 로고와 상품 컷",
          "글자가 선명해야 하는 화면 캡처",
          "편집 원본처럼 다시 손볼 가능성이 큰 그래픽",
          "배경색이 자주 바뀌는 배너와 UI 자산",
        ],
      },
      {
        title: "PNG가 손해가 되는 장면",
        paragraphs: [
          "일반 사진, 블로그 본문 이미지, 쇼핑몰 썸네일처럼 투명도가 필요 없는 파일은 PNG가 지나치게 무거워질 수 있습니다. 이 경우에는 JPEG나 WebP로 바꿔도 육안 차이는 크지 않은데, 업로드 시간과 용량은 훨씬 줄어드는 경우가 많습니다.",
          "특히 수십 장을 한꺼번에 처리하는 배치 작업에서는 PNG 선택 하나 때문에 전체 다운로드가 느려지거나 ZIP 파일이 필요 이상으로 커질 수 있습니다.",
        ],
        bullets: [
          "일반 사진 중심의 블로그 본문 이미지",
          "배경이 고정된 쇼핑몰 썸네일",
          "메신저 전송용 상품 사진과 행사 사진",
          "업로드 용량 제한이 빡빡한 CMS와 커뮤니티 게시판",
        ],
      },
      {
        title: "형식을 바꿀 때 실수 줄이기",
        paragraphs: [
          "PNG를 다른 형식으로 바꿀 때는 파일 크기만 보지 말고 배경 손실과 글자 가독성도 같이 확인해야 합니다. 특히 투명 배경이 숨어 있는 파일은 밝은 배경과 어두운 배경 위에서 모두 확인하는 편이 안전합니다.",
          "또한 비교를 위해 여러 형식을 만든 뒤, 다시 그 파생본을 출발점으로 쓰지 않는 것이 좋습니다. 원본에서 각 형식을 다시 만들어야 판단이 정확해집니다.",
        ],
        bullets: [
          "투명 배경이 숨어 있는지 먼저 확인하기",
          "밝은 배경과 어두운 배경에서 미리보기 비교하기",
          "JPEG와 WebP 결과를 원본 기준으로 각각 비교하기",
          "한 번 변환한 파생본을 다시 재변환하지 않기",
        ],
      },
    ],
    relatedTools: ["convert-image", "compress-image"],
    relatedGuides: [
      "webp-vs-jpeg-vs-png",
      "transparent-image-conversion-checklist",
      "why-converted-images-get-larger",
      "detail-image-upload-mistakes",
    ],
  },
  {
    slug: "blog-image-upload-final-checklist",
    href: "/guides/blog-image-upload-final-checklist",
    categoryLabel: "블로그 발행",
    cluster: "cluster-03",
    title: "블로그 이미지 업로드 전 최종 체크리스트",
    description:
      "블로그 발행 직전에 대표 이미지, 본문 사진, 캡처를 어떤 기준으로 다시 보고 올릴지 정리한 가이드입니다.",
    metadataDescription:
      "블로그 이미지 업로드 직전에 대표 이미지, 본문 사진, 캡처를 어떻게 최종 점검할지 설명하는 한국어 가이드입니다.",
    intro:
      "초안 단계에서는 괜찮아 보여도 발행 직전에는 카드 썸네일 비율, 본문 캡처 가독성, 업로드 속도 문제로 다시 걸리는 경우가 많습니다. 자동 축소에 기대기보다 마지막 업로드용 파생본을 짧게 점검해 두면 교체 작업이 훨씬 줄어듭니다.",
    readTime: "5분",
    publishedAt: "2026-03-16T17:10:00+09:00",
    updatedAt: "2026-03-16T17:10:00+09:00",
    focusPoints: [
      "대표 이미지와 본문 이미지는 같은 파일 하나로 끝내려 할수록 둘 다 애매해지기 쉽습니다.",
      "텍스트가 있는 캡처는 용량보다 모바일 가독성을 먼저 확인해야 합니다.",
      "발행 직전에는 업로드 순서와 파일명까지 정리해 두어야 교체 실수가 줄어듭니다.",
    ],
    sections: [
      {
        title: "대표 이미지와 본문 이미지를 분리해서 검수하세요",
        paragraphs: [
          "대표 이미지는 목록 카드와 공유 미리보기에서 먼저 보이고, 본문 이미지는 실제 읽는 폭에서 보입니다. 같은 파일 하나로 두 역할을 모두 맡기면 대표 이미지는 너무 무겁고 본문 이미지는 지나치게 크거나 답답해지기 쉽습니다.",
          "초안 작성 중에는 원본을 써도 되지만, 발행 직전에는 대표용 파생본과 본문용 파생본을 따로 남기는 편이 훨씬 관리하기 쉽습니다.",
        ],
        bullets: [
          "대표 이미지와 본문 삽입 이미지를 업로드 폴더부터 분리하기",
          "목록 카드와 본문 폭에서 각각 어떻게 보일지 따로 확인하기",
          "대표 이미지는 불필요하게 큰 해상도를 그대로 두지 않기",
          "본문용 파일은 실제 문단 폭에서 선명한지만 먼저 보기",
        ],
      },
      {
        title: "캡처와 사진은 같은 압축 기준으로 보지 마세요",
        paragraphs: [
          "본문 사진은 JPEG나 WebP로 가볍게 정리해도 무난한 경우가 많지만, 글자가 들어간 캡처는 과한 압축에서 먼저 흐려집니다. 캡처를 사진과 같은 품질 기준으로 돌리면 읽기 어려운 본문이 생기기 쉽습니다.",
          "특히 튜토리얼, 비교표, 관리 화면처럼 작은 글자가 많은 캡처는 모바일 폭에서 다시 확인해야 합니다. 데스크톱 미리보기에서 괜찮아 보여도 실제 게시 후에는 글자가 먼저 무너집니다.",
        ],
        bullets: [
          "사진과 캡처를 같은 배치 큐에 넣지 않기",
          "캡처는 PNG 또는 WebP도 함께 비교하기",
          "본문 캡처는 모바일 폭 미리보기로 글자 가독성 확인하기",
          "용량 숫자만 보고 캡처를 과하게 다시 저장하지 않기",
        ],
      },
      {
        title: "발행 직전에는 업로드 동선까지 정리하세요",
        paragraphs: [
          "블로그 발행 직전에는 이미지 품질뿐 아니라 교체 동선도 중요합니다. 파일명이 제각각이거나 대표 이미지와 본문 이미지가 섞여 있으면 업로드 후 다시 바꾸는 시간이 더 오래 걸립니다.",
          "첫 게시 전에 대표 이미지 1장과 본문 캡처 1장만 먼저 올려 보고, 문제가 없으면 나머지를 한 번에 올리는 편이 안전합니다. 발행 직전 급하게 여러 번 다시 저장하는 습관은 품질만 더 깎습니다.",
        ],
        bullets: [
          "대표 이미지 1장, 본문 이미지 1장으로 먼저 시험 업로드하기",
          "파일명에 cover, inline 같은 용도 표기를 붙여 구분하기",
          "업로드 후 바로 교체할 일이 없도록 모바일 미리보기까지 확인하기",
          "재저장은 원본에서 다시 만들고 기존 파생본을 또 저장하지 않기",
        ],
      },
    ],
    relatedTools: ["resize-image", "compress-image", "convert-image"],
    relatedGuides: [
      "blog-cms-image-prep-checklist",
      "detail-image-upload-mistakes",
      "webp-vs-jpeg-vs-png",
      "avoid-repeat-export-quality-loss",
    ],
  },
  {
    slug: "listing-image-resize-vs-compress",
    href: "/guides/listing-image-resize-vs-compress",
    categoryLabel: "쇼핑몰 업로드",
    cluster: "cluster-03",
    title: "상품 리스트 이미지 업로드: 리사이즈 vs 압축",
    description:
      "상품 리스트 카드와 썸네일 업로드에서 리사이즈와 압축 중 무엇을 먼저 적용해야 하는지 정리한 가이드입니다.",
    metadataDescription:
      "상품 리스트 이미지 업로드에서 리사이즈와 압축 중 어느 쪽을 먼저 적용할지, 썸네일과 상세 이미지를 어떻게 나눌지 설명하는 한국어 가이드입니다.",
    intro:
      "쇼핑몰 리스트 이미지는 화면에서 작게 보이지만, 원본은 생각보다 큰 경우가 많습니다. 무조건 압축부터 세게 거는 것보다 리스트 슬롯 크기와 확대 필요 여부를 먼저 나누면 훨씬 덜 망가집니다.",
    readTime: "5분",
    publishedAt: "2026-03-16T17:10:00+09:00",
    updatedAt: "2026-03-16T17:10:00+09:00",
    focusPoints: [
      "목록 카드에 실제로 보이는 크기가 작다면 리사이즈가 먼저인 경우가 많습니다.",
      "상세 확대에 다시 쓸 파일이라면 압축만으로 끝내는 편이 나을 수 있습니다.",
      "리스트용과 상세용을 같은 파일 하나로 맞추려는 습관이 재작업을 가장 많이 만듭니다.",
    ],
    sections: [
      {
        title: "리스트 슬롯이 작다면 리사이즈가 먼저입니다",
        paragraphs: [
          "상품 목록 카드에 작게 들어갈 이미지라면 원본 해상도를 그대로 들고 갈 이유가 많지 않습니다. 카드가 400~800픽셀 수준으로만 보이는데 3000픽셀 원본을 먼저 압축만 하면, 용량은 줄어도 불필요하게 큰 파일을 계속 들고 있게 됩니다.",
          "이럴 때는 먼저 리스트 슬롯에 맞는 크기로 줄이고, 그 결과에 가볍게 압축을 거는 편이 예측하기 쉽습니다. 특히 여러 상품을 한 번에 맞출 때 일관성이 좋아집니다.",
        ],
        bullets: [
          "실제 리스트 카드에서 보이는 최대 폭 먼저 확인하기",
          "어차피 줄여야 하는 썸네일이면 리사이즈부터 적용하기",
          "리사이즈 후 결과가 여전히 무거우면 그때 압축 강도 조정하기",
          "대표 상품 2~3장으로 먼저 카드 화면을 비교하기",
        ],
      },
      {
        title: "압축만으로 끝나는 경우도 따로 있습니다",
        paragraphs: [
          "리스트 이미지라도 확대 보기, 상세 연결, 재사용 계획이 걸려 있으면 해상도 유지가 더 중요할 수 있습니다. 이미 플랫폼 권장 크기 안에 들어와 있다면 압축만 조금 조정해서 끝내는 편이 낫습니다.",
          "특히 작은 글자, 질감, 섬세한 패턴이 중요한 상품은 크기를 더 줄이는 것보다 품질 손실을 먼저 피해야 합니다.",
        ],
        bullets: [
          "현재 픽셀이 이미 권장 범위 안인지 먼저 보기",
          "확대나 재사용이 필요한 상품은 해상도 유지 여부 확인하기",
          "압축 결과에서 텍스처와 글자 선명도를 같이 보기",
          "리스트용이라도 모든 상품에 같은 압축 세기를 강요하지 않기",
        ],
      },
      {
        title: "상세 이미지와 같은 규칙으로 묶지 마세요",
        paragraphs: [
          "리스트 카드 이미지는 빠른 로딩과 일관성이 우선이지만, 상세 이미지는 디테일과 확대 품질이 더 중요합니다. 두 용도를 한 규칙으로 묶으면 한쪽은 항상 손해를 봅니다.",
          "가장 실무적인 방법은 리스트용 파생본과 상세용 파생본을 분리하고, 리스트용만 따로 리사이즈·압축 기준을 고정하는 것입니다.",
        ],
        bullets: [
          "리스트용과 상세용 다운로드 묶음을 분리하기",
          "작은 리스트 파일을 상세 이미지로 다시 쓰지 않기",
          "한 상품군 전체 적용 전 대표 샘플만 먼저 업로드해 보기",
          "규격이 섞인 원본은 비율 유지 여부를 먼저 결정하기",
        ],
      },
    ],
    relatedTools: ["resize-image", "compress-image"],
    relatedGuides: [
      "product-thumbnail-image-settings",
      "resize-or-compress-first",
      "batch-resize-checklist",
      "batch-cleanup-before-product-upload",
    ],
  },
  {
    slug: "detail-image-upload-mistakes",
    href: "/guides/detail-image-upload-mistakes",
    categoryLabel: "상세 이미지",
    cluster: "cluster-03",
    title: "상세 이미지와 설명 캡처 업로드에서 자주 하는 실수",
    description:
      "상품 상세 이미지, 설명 캡처, 사용 예시 이미지를 올릴 때 반복되는 실수와 점검 순서를 정리한 가이드입니다.",
    metadataDescription:
      "상품 상세 이미지와 설명 캡처 업로드에서 형식 선택, 압축, 검수 순서에서 자주 생기는 실수를 설명하는 한국어 가이드입니다.",
    intro:
      "상세 페이지는 사진 몇 장만 올리는 곳이 아니라, 제품 컷·설명 캡처·사이즈 표 같은 서로 다른 이미지가 함께 들어가는 자리입니다. 이걸 한 규칙으로 밀어 넣으면 글자는 흐려지고 사진은 무거워지기 쉽습니다.",
    readTime: "5분",
    publishedAt: "2026-03-16T17:10:00+09:00",
    updatedAt: "2026-03-16T17:10:00+09:00",
    focusPoints: [
      "제품 사진과 설명 캡처는 같은 형식과 압축 기준으로 묶지 않는 편이 안전합니다.",
      "상세 페이지는 데스크톱보다 모바일 폭에서 먼저 품질 차이가 드러납니다.",
      "이 사이트는 리사이즈·압축·변환·EXIF 제거까지 지원하지만 크롭이나 규정 자동 검사는 제공하지 않습니다.",
    ],
    sections: [
      {
        title: "사진 컷과 설명 캡처를 같은 큐에 넣지 마세요",
        paragraphs: [
          "제품 사진은 자연스러운 질감과 용량 균형이 중요하지만, 설명 캡처와 사이즈 표는 글자 가독성이 더 중요합니다. 둘을 같은 JPEG 품질 값으로 밀어 넣으면 한쪽은 지나치게 무겁고 다른 쪽은 쉽게 흐려집니다.",
          "상세 페이지를 구성하는 이미지는 내용 타입이 다르므로, 업로드 전에 사진 묶음과 캡처 묶음을 분리하는 것만으로도 실수가 크게 줄어듭니다.",
        ],
        bullets: [
          "제품 사진, 설명 캡처, 표 이미지를 각각 다른 묶음으로 나누기",
          "글자와 얇은 선이 있는 파일은 별도로 먼저 시험하기",
          "상세 페이지 전체 이미지를 한 형식으로 통일하려 하지 않기",
          "배치 처리 전 대표 캡처 1장과 대표 사진 1장을 따로 비교하기",
        ],
      },
      {
        title: "글자 있는 캡처는 용량보다 읽힘을 먼저 보세요",
        paragraphs: [
          "상품 설명 캡처나 배송 안내 표는 파일 크기가 조금 늘어도 글자가 읽혀야 의미가 있습니다. 캡처를 과하게 압축해 놓으면 모바일에서 확대하지 않는 한 내용을 읽기 어려워집니다.",
          "이런 파일은 PNG나 WebP도 같이 비교해 보고, 숫자와 표 선이 살아 있는지를 먼저 보세요. 용량만 보고 판단하면 상세 페이지 완성 후에 다시 만드는 일이 생깁니다.",
        ],
        bullets: [
          "캡처는 JPEG만 고집하지 말고 PNG 또는 WebP도 같이 비교하기",
          "모바일 폭에서 글자 크기와 표 선이 무너지지 않는지 보기",
          "한 번 괜찮아 보였던 파생본을 다시 또 저장하지 않기",
          "파일 크기보다 읽힘과 선명도를 먼저 점검하기",
        ],
      },
      {
        title: "상세 화면 기준으로 검수하지 않으면 늦게 발견합니다",
        paragraphs: [
          "상세 이미지는 편집 화면에서 단독으로 볼 때보다 실제 상세 영역에 연속으로 들어갔을 때 문제가 더 잘 드러납니다. 특히 작은 화면에서는 글자와 얇은 라인이 먼저 무너집니다.",
          "사진도 마찬가지로 흰 배경 제품컷, 어두운 소품컷, 반사 재질 제품은 압축 흔적이 다르게 보일 수 있으니 샘플 업로드로 실제 배치를 확인하는 편이 안전합니다.",
        ],
        bullets: [
          "모바일 상세 화면에서 먼저 위아래로 이어서 보기",
          "밝은 제품컷과 어두운 제품컷을 모두 샘플로 확인하기",
          "글자 캡처는 확대 없이 읽히는지 기준 잡기",
          "문제 파일만 다시 만들 수 있게 파일명을 분리해 두기",
        ],
      },
      {
        title: "도구로 정리할 수 있는 범위를 먼저 나누세요",
        paragraphs: [
          "이 사이트에서 바로 정리할 수 있는 것은 해상도, 용량, 출력 형식, EXIF 메타데이터입니다. 반대로 잘라내기, 가리기, 워터마크 추가, 플랫폼별 상세 규정 검사는 현재 범위가 아닙니다.",
          "즉 픽셀 안에 이미 개인 정보나 불필요한 문구가 박혀 있다면 그 수정은 다른 편집 단계에서 끝내고, 여기에서는 업로드용 파생본 정리에 집중하는 편이 맞습니다.",
        ],
        bullets: [
          "해상도, 형식, 용량, EXIF 정리는 여기서 처리하기",
          "잘라내기와 마스킹은 업로드 전에 다른 편집 단계에서 끝내기",
          "플랫폼별 세부 규정은 직접 확인하고 여기서 자동 검사를 기대하지 않기",
          "최종 업로드 전 샘플 몇 장으로 실제 상세 영역을 다시 보기",
        ],
      },
    ],
    relatedTools: ["compress-image", "convert-image", "resize-image", "remove-exif"],
    relatedGuides: [
      "when-png-is-the-wrong-choice",
      "webp-vs-jpeg-vs-png",
      "avoid-repeat-export-quality-loss",
      "blog-image-upload-final-checklist",
    ],
  },
  {
    slug: "batch-cleanup-before-product-upload",
    href: "/guides/batch-cleanup-before-product-upload",
    categoryLabel: "배치 업로드",
    cluster: "cluster-03",
    title: "쇼핑몰 상품 이미지 배치 업로드 전 정리 순서",
    description:
      "쇼핑몰 대표 이미지, 리스트 컷, 상세 컷을 여러 장 올리기 전에 어떤 기준으로 나누고 정리할지 정리한 가이드입니다.",
    metadataDescription:
      "쇼핑몰 상품 이미지를 여러 장 업로드하기 전에 리스트 컷, 상세 컷, 촬영 원본을 어떻게 나누고 정리할지 설명하는 한국어 가이드입니다.",
    intro:
      "상품 이미지를 한 번에 많이 올릴 때 진짜 시간이 걸리는 부분은 처리 버튼을 누르는 순간보다, 섞인 파일을 다시 나누고 재업로드하는 순간입니다. 업로드 슬롯 기준으로 먼저 묶어 두면 배치 처리의 이점이 살아납니다.",
    readTime: "6분",
    publishedAt: "2026-03-16T17:10:00+09:00",
    updatedAt: "2026-03-16T17:10:00+09:00",
    focusPoints: [
      "상품군보다 업로드 슬롯 기준으로 먼저 묶는 편이 설정 실수를 줄입니다.",
      "대표 샘플 몇 장으로 규격과 형식을 고정한 뒤 나머지에 넓히는 방식이 안전합니다.",
      "촬영 원본을 그대로 쓰는 경우라면 EXIF와 파일명 정리도 배치 준비에 포함됩니다.",
    ],
    sections: [
      {
        title: "상품군보다 업로드 슬롯부터 나누세요",
        paragraphs: [
          "같은 상품군 안에서도 대표 이미지, 리스트 카드, 상세 설명용 이미지는 요구 조건이 다릅니다. 상품명 기준으로 먼저 묶으면 나중에 슬롯별 규격 차이 때문에 다시 나누게 되는 일이 많습니다.",
          "배치 작업 전에 커버용, 리스트용, 상세용처럼 실제 업로드 칸 기준으로 파일을 나눠 두면 어떤 도구를 써야 할지도 훨씬 빨리 정해집니다.",
        ],
        bullets: [
          "대표 이미지, 리스트 이미지, 상세 이미지를 폴더나 파일명으로 분리하기",
          "같은 상품이라도 업로드 슬롯이 다르면 별도 묶음으로 다루기",
          "가로형, 세로형, 정사각형 원본이 섞였는지 먼저 확인하기",
          "플랫폼 권장 규격은 직접 확인하고 묶음 이름에 메모하기",
        ],
      },
      {
        title: "대표 샘플로 규격과 형식을 먼저 고정하세요",
        paragraphs: [
          "수십 장을 한 번에 처리하기 전에 가장 까다로워 보이는 파일 몇 장으로 먼저 리사이즈, 압축, 형식 변환 결과를 확인해야 합니다. 샘플이 통과하면 나머지를 같은 설정으로 넓히는 방식이 훨씬 안전합니다.",
          "특히 누끼 컷과 일반 사진이 섞인 경우에는 같은 형식 선택이 모두에게 맞지 않을 수 있으니, 샘플 단계에서부터 묶음을 더 쪼갤 필요가 있는지 판단해야 합니다.",
        ],
        bullets: [
          "가장 큰 파일과 가장 복잡한 파일을 대표 샘플로 고르기",
          "리사이즈 후에도 무거우면 압축이나 형식 변환을 이어서 비교하기",
          "누끼 컷과 일반 사진은 샘플 단계부터 따로 보기",
          "샘플이 통과한 뒤에만 전체 배치에 같은 설정 적용하기",
        ],
      },
      {
        title: "촬영 원본이면 EXIF와 파일명도 같이 정리하세요",
        paragraphs: [
          "스마트폰이나 카메라에서 바로 가져온 상품 사진에는 위치, 기기, 촬영 시각 같은 EXIF 정보가 남아 있을 수 있습니다. 외부 파트너와 공유하거나 공개 업로드에 가까운 흐름이라면 메타데이터 정리도 배치 준비에 포함하는 편이 좋습니다.",
          "또한 결과 파일명이 원본과 뒤섞이면 업로드 단계에서 다시 혼란이 생깁니다. 용도와 규격이 드러나는 이름으로 내려받아 두면 재업로드가 훨씬 쉽습니다.",
        ],
        bullets: [
          "촬영 원본을 그대로 쓸 때는 EXIF 제거 필요 여부 먼저 판단하기",
          "공개 업로드용과 내부 보관용 파일을 따로 남기기",
          "파일명에 용도와 규격을 붙여 다시 섞이지 않게 만들기",
          "민감한 메타데이터 제거가 필요하면 배치 처리 전에 먼저 실행하기",
        ],
      },
      {
        title: "다운로드 묶음과 업로드 묶음을 맞추세요",
        paragraphs: [
          "배치 작업의 마지막 실수는 다운로드 구조와 실제 업로드 구조가 따로 노는 것입니다. ZIP으로 내려받은 뒤 다시 손으로 나누기 시작하면 처음의 정리 기준이 금방 무너집니다.",
          "처리 단계에서 만든 묶음이 곧 업로드 묶음이 되도록 맞춰 두면, 상품 등록 반복 작업에서도 같은 흐름을 재사용하기 쉽습니다.",
        ],
        bullets: [
          "ZIP 하나가 업로드 한 묶음과 대응되게 정리하기",
          "대표 이미지와 상세 이미지를 같은 다운로드 묶음에 섞지 않기",
          "업로드 직전에는 샘플 몇 장만 먼저 넣어 실제 슬롯에 맞는지 확인하기",
          "재작업이 생기면 기존 파생본이 아니라 원본 묶음에서 다시 시작하기",
        ],
      },
    ],
    relatedTools: ["resize-image", "compress-image", "convert-image", "remove-exif"],
    relatedGuides: [
      "batch-processing-preflight-checklist",
      "product-thumbnail-image-settings",
      "listing-image-resize-vs-compress",
      "remove-exif-for-privacy",
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
      "when-png-is-the-wrong-choice",
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
      "when-png-is-the-wrong-choice",
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
      "batch-cleanup-before-product-upload",
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
      "product-thumbnail-image-settings",
      "listing-image-resize-vs-compress",
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
  "/guides/blog-cms-image-prep-checklist",
  "/guides/product-thumbnail-image-settings",
  "/guides/avoid-repeat-export-quality-loss",
  "/guides/when-png-is-the-wrong-choice",
  "/guides/blog-image-upload-final-checklist",
  "/guides/listing-image-resize-vs-compress",
  "/guides/detail-image-upload-mistakes",
  "/guides/batch-cleanup-before-product-upload",
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
