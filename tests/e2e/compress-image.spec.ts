import path from "node:path";

import { expect, test } from "@playwright/test";

const fixturePath = path.resolve(
  __dirname,
  "..",
  "..",
  "docs",
  "screenshots",
  "home-mobile.png",
);

test("compress-image tool completes a browser upload-to-download flow", async ({
  page,
}) => {
  await page.goto("/tools/compress-image");

  await expect(
    page.getByRole("heading", { level: 1, name: "이미지 압축 도구" }),
  ).toBeVisible();

  await page.getByLabel("이미지 파일 선택").setInputFiles(fixturePath);

  await expect(
    page.getByRole("heading", { level: 3, name: "home-mobile.png" }),
  ).toBeVisible();
  await expect(page.getByText("1개 파일 준비됨").first()).toBeVisible();

  await page
    .getByRole("combobox", { name: "출력 형식" })
    .selectOption("image/webp");
  await page.getByRole("button", { name: "이미지 압축하기" }).click();

  await expect(
    page.getByText(/총 1개 중 1개 성공, 0개 실패입니다\./),
  ).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText("home-mobile-compressed.webp").first()).toBeVisible();
  const resultDownloadButton = page.getByRole("button", {
    exact: true,
    name: "결과 다운로드",
  });

  await expect(resultDownloadButton).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await resultDownloadButton.click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toBe("home-mobile-compressed.webp");
});
