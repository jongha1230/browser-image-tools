# Browser compatibility

## Publicly verified baseline

- Primary verified target: desktop Chromium browsers
- Public baseline checks: route load, upload, processing, download, and Playwright E2E on Chromium

## Required browser capabilities

- `Canvas`
- `Blob`
- `URL.createObjectURL`
- download links via `a[download]`
- `createImageBitmap` for worker path
- `OffscreenCanvas` and `convertToBlob` for worker-side encoding

## Worker and fallback behavior

- The app tries a Web Worker first for batch processing.
- If the browser cannot start the worker path, the UI falls back to main-thread processing.
- Fallback keeps the same output and download flow, but the tab may feel less responsive during long work.

## Chromium

- Best-supported target in the current repo
- Public Playwright coverage runs on Chromium in CI
- Recommended browser family for demos and interview walkthroughs

## Safari and Firefox

- Do not overclaim broad support
- Core APIs may exist, but `createImageBitmap`, `OffscreenCanvas`, and encoding behavior can vary
- Worker fallback may trigger more often or some processing routes may fail earlier than Chromium
- Until broader manual QA exists, treat Safari/Firefox as "may work, not broadly verified"

## Canvas and encoding limitations

- Browser encoding support differs by MIME type and implementation detail
- Even when a target MIME type is requested, the browser may return another type; the app checks for MIME mismatch and surfaces an error
- Very large source dimensions or resize targets can exceed safe canvas limits and are blocked proactively

## Local-only privacy model

- Uploaded files stay in the current browser session
- No backend upload path exists in this repository
- Refreshing or closing the tab clears the current queue and results

## Honest compatibility statement

When describing this project publicly, the safest claim is:

> "Chromium-first, browser-only image tools with worker fallback and explicit limits. Safari and Firefox are not broadly verified yet."
