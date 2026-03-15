import type { Metadata } from "next";

import { ToolPage } from "@/components/tool-page";
import { getToolRoute } from "@/lib/site-content";
import { createPageMetadata, getPageMetadataEntry } from "@/lib/site-metadata";

const tool = getToolRoute("compress-image");

export const metadata: Metadata = createPageMetadata(
  getPageMetadataEntry(tool.href),
);

export default function CompressImagePage() {
  return <ToolPage tool={tool} />;
}
