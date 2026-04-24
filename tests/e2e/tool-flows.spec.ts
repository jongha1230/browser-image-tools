import { expect, test, type Page } from "@playwright/test";

const tinyPngBuffer = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAARSURBVBhXY2Bo+P8fBZMuAAAwbyfhelbgLwAAAABJRU5ErkJggg==",
  "base64",
);

function createImageUpload(name: string) {
  return {
    name,
    mimeType: "image/png",
    buffer: tinyPngBuffer,
  };
}

async function openTool(page: Page, pathname: string, heading: string) {
  await page.goto(pathname);

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: heading,
    }),
  ).toBeVisible();
}

async function uploadImages(page: Page, ...names: string[]) {
  await page
    .getByLabel("이미지 파일 선택")
    .setInputFiles(names.map((name) => createImageUpload(name)));

  for (const name of names) {
    await expect(
      page.getByRole("heading", {
        level: 3,
        name,
      }),
    ).toBeVisible();
  }
}

test("compress-image tool completes a browser upload-to-download flow", async ({
  page,
}) => {
  await openTool(page, "/tools/compress-image", "이미지 압축 도구");
  await uploadImages(page, "sample.png");

  await page
    .getByRole("combobox", {
      name: "출력 형식",
    })
    .selectOption("image/webp");
  await page.getByRole("button", { name: "이미지 압축하기" }).click();

  await expect(
    page.getByText(/총 1개 중 1개 성공, 0개 실패입니다\./),
  ).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("sample-compressed.webp").first()).toBeVisible();

  const resultDownloadButton = page.getByRole("button", {
    exact: true,
    name: "결과 다운로드",
  });
  await expect(resultDownloadButton).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await resultDownloadButton.click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe("sample-compressed.webp");
});

test("resize-image tool processes a single file with explicit dimensions", async ({
  page,
}) => {
  await openTool(page, "/tools/resize-image", "이미지 리사이즈 도구");
  await uploadImages(page, "poster.png");

  await page.getByLabel("가로 (px)").fill("64");
  await page.getByLabel("세로 (px)").fill("64");
  await page.getByRole("button", { name: "이미지 크기 조절하기" }).click();

  await expect(
    page.getByText(/총 1개 중 1개 성공, 0개 실패입니다\./),
  ).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("poster-resized.png").first()).toBeVisible();
});

test("convert-image tool converts a PNG into WebP", async ({ page }) => {
  await openTool(page, "/tools/convert-image", "이미지 포맷 변환 도구");
  await uploadImages(page, "diagram.png");

  await page
    .getByRole("combobox", {
      name: "출력 형식",
    })
    .selectOption("image/webp");
  await page.getByRole("button", { name: "이미지 포맷 변환하기" }).click();

  await expect(
    page.getByText(/총 1개 중 1개 성공, 0개 실패입니다\./),
  ).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("diagram-converted.webp").first()).toBeVisible();
});

test("remove-exif tool preserves the local-only EXIF cleanup flow", async ({
  page,
}) => {
  await openTool(page, "/tools/remove-exif", "사진 EXIF 제거 도구");
  await uploadImages(page, "travel.png");

  await page.getByRole("button", { name: "EXIF 제거하기" }).click();

  await expect(
    page.getByText(/총 1개 중 1개 성공, 0개 실패입니다\./),
  ).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("travel-no-exif.png").first()).toBeVisible();
});

test("compress-image tool exposes ZIP download for multi-file batches", async ({
  page,
}) => {
  await openTool(page, "/tools/compress-image", "이미지 압축 도구");
  await uploadImages(page, "batch-a.png", "batch-b.png");

  await page
    .getByRole("combobox", {
      name: "출력 형식",
    })
    .selectOption("image/webp");
  await page.getByRole("button", { name: "이미지 압축하기" }).click();

  await expect(
    page.getByText(/총 2개 중 2개 성공, 0개 실패입니다\./),
  ).toBeVisible({ timeout: 15_000 });

  const zipButton = page.getByRole("button", {
    name: "성공 파일 ZIP 다운로드",
  });
  await expect(zipButton).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await zipButton.click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe("compressed-images.zip");
});

test("compress-image tool shows a Korean error for invalid file types", async ({
  page,
}) => {
  await openTool(page, "/tools/compress-image", "이미지 압축 도구");

  await page.getByLabel("이미지 파일 선택").setInputFiles({
    name: "notes.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("hello from playwright", "utf8"),
  });

  await expect(
    page.getByText(
      "notes.txt: JPEG, PNG, WebP 파일만 추가할 수 있습니다.",
    ),
  ).toBeVisible();
});

test("compress-image tool shows a Korean limit error when too many files are added", async ({
  page,
}) => {
  await openTool(page, "/tools/compress-image", "이미지 압축 도구");

  await page.getByLabel("이미지 파일 선택").setInputFiles(
    Array.from({ length: 21 }, (_, index) =>
      createImageUpload(`limit-${index + 1}.png`),
    ),
  );

  await expect(
    page.getByText(
      "limit-21.png: 한 번에 처리할 수 있는 이미지는 최대 20개입니다.",
    ),
  ).toBeVisible();
});
