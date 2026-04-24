# AGENTS.md

## Project purpose

Korean-first, local-only browser image processing tools built with Next.js App Router. The product promise is simple: upload, process, and download images entirely inside the browser without a server upload path.

## Important directories

- `app/tools/*`: route-level tool pages and SEO-first explanatory content
- `components/tool-shell*`: shared client workflow UI for upload, options, results, and downloads
- `lib/*`: image processing, upload validation, ZIP generation, and browser capability helpers
- `tests/*`: Vitest unit/integration coverage
- `tests/e2e/*`: Playwright browser flows
- `docs/*`: portfolio docs, constraints, launch notes, and case study material

## Commands

- Setup: `npm ci`
- Dev: `npm run dev`
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Unit tests: `npm run test`
- E2E: `npm run test:e2e`
- Build: `npm run build`

## Code style rules

- Preserve the local-only product direction. Do not add server uploads.
- Preserve Korean user-facing copy unless the current message is clearly wrong or misleading.
- Prefer small pure helpers in `lib/` for limits, ZIP guards, and processing rules.
- Keep route pages content-first and let the shared `ToolShell` own processing UI.
- Be explicit about browser and memory limits. Honest constraints are better than silent failure.

## Testing expectations

- Use Vitest for business logic, limits, ZIP layout checks, and helper modules.
- Use Playwright only for stable, critical user flows.
- Generate tiny test files in E2E where possible instead of committing large binary fixtures.
- Do not allocate huge buffers to test ZIP boundaries; validate with metadata-based helpers.

## Do-not rules

- Do not add backend, auth, database, analytics, or cloud sync just to broaden scope.
- Do not claim Safari/Firefox support beyond what is actually verified.
- Do not claim ZIP64 support unless it is implemented end-to-end.
- Do not commit secrets or modify real `.env` files.

## Definition of done

- New reliability behavior has deterministic tests.
- New limits surface clear Korean messages instead of silent failure.
- README and `docs/` explain architecture, limits, testing, and known trade-offs.
- `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e`, and `npm run build` pass, or failures are documented exactly.
