import type { Metadata } from "next";

import { ToolPage } from "@/components/tool-page";
import { buildMetadata } from "@/lib/site-metadata";
import { getToolRoute } from "@/lib/site-content";

const tool = getToolRoute("compress-image");

export const metadata: Metadata = buildMetadata(
  "이미지 압축",
  "이미지 용량을 브라우저 안에서 낮추는 압축 도구 랜딩 페이지입니다.",
);

export default function CompressImagePage() {
  return <ToolPage tool={tool} />;
}

