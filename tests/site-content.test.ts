import { describe, expect, it } from "vitest";

import { requiredRoutes, toolRoutes } from "../lib/site-content";

describe("site content scaffold", () => {
  it("defines the required route skeletons", () => {
    expect(requiredRoutes).toEqual([
      "/",
      "/tools",
      "/tools/compress-image",
      "/tools/resize-image",
      "/tools/convert-image",
      "/tools/remove-exif",
      "/guides",
      "/about",
      "/privacy",
      "/contact",
    ]);
  });

  it("keeps the launched tool routes unique", () => {
    expect(toolRoutes.map((tool) => tool.href)).toEqual([
      "/tools/compress-image",
      "/tools/resize-image",
      "/tools/convert-image",
      "/tools/remove-exif",
    ]);
    expect(new Set(toolRoutes.map((tool) => tool.title)).size).toBe(
      toolRoutes.length,
    );
  });
});
