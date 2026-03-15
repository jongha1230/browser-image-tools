import type { Metadata } from "next";

import { ToolPage } from "@/components/tool-page";
import { buildMetadata } from "@/lib/site-metadata";
import { getToolRoute } from "@/lib/site-content";

const tool = getToolRoute("resize-image");

export const metadata: Metadata = buildMetadata(
  "이미지 크기 조절",
  "픽셀 크기를 브라우저 안에서 조정하는 리사이즈 도구 랜딩 페이지입니다.",
);

export default function ResizeImagePage() {
  return <ToolPage tool={tool} />;
}

