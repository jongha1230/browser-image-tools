# Testing

## Commands

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run test:e2e`
- `npm run build`

## Unit and integration coverage

Vitest covers:

- upload validation
- file and batch limits
- resize helpers
- processing plan helpers
- ZIP layout and classic ZIP boundary guards
- tool-shell cancellation state helpers

## E2E coverage

Playwright covers Chromium browser flows for:

- compress image
- resize image
- convert image
- remove EXIF
- multi-file ZIP availability
- invalid file type errors
- limit violation errors

## Test data strategy

- E2E creates tiny image buffers inside the test instead of storing large binary fixtures in the repo.
- ZIP boundary tests use metadata-based layout validation instead of allocating huge buffers.

## CI

The GitHub Actions workflow runs:

1. `npm ci`
2. `npm run lint`
3. `npm run typecheck`
4. `npm run test`
5. `npm run test:e2e`
6. `npm run build`

## Known gaps

- Public CI coverage is Chromium-only.
- Worker fallback is covered indirectly through unit logic and runtime behavior, not through a dedicated cross-browser matrix.
- Extremely large real-device memory scenarios are documented and guarded, but not exhaustively replayed in automation.
