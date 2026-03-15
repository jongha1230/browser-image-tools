import type { Metadata } from "next";

import { ToolPage } from "@/components/tool-page";
import { buildMetadata } from "@/lib/site-metadata";
import { getToolRoute } from "@/lib/site-content";

const tool = getToolRoute("convert-image");

export const metadata: Metadata = buildMetadata(
  "이미지 포맷 변환",
  "JPG, PNG, WebP 사이를 브라우저 안에서 변환하는 도구 랜딩 페이지입니다.",
);

export default function ConvertImagePage() {
  return <ToolPage tool={tool} />;
}

