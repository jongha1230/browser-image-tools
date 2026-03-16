import type { StructuredDataNode } from "@/lib/structured-data";

type StructuredDataScriptProps = {
  data: StructuredDataNode | null;
};

export function StructuredDataScript({
  data,
}: StructuredDataScriptProps) {
  if (!data) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
