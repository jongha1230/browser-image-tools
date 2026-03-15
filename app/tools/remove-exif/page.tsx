import type { Metadata } from "next";

import { ToolPage } from "@/components/tool-page";
import { buildMetadata } from "@/lib/site-metadata";
import { getToolRoute } from "@/lib/site-content";

const tool = getToolRoute("remove-exif");

export const metadata: Metadata = buildMetadata(
  "EXIF 제거",
  "사진 메타데이터를 브라우저 안에서 제거하는 도구 랜딩 페이지입니다.",
);

export default function RemoveExifPage() {
  return <ToolPage tool={tool} />;
}

