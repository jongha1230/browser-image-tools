# AGENTS.md

- Product: Korean-first, ad-supported image utility site with browser-only file processing.
- Stack: Next.js App Router + TypeScript unless the repo already uses another stack.
- MVP: compress image, resize image, convert format, remove EXIF, batch export.
- Constraints: no backend, auth, DB, cloud upload, PDF, HEIC, RAW, video, or end-user AI.
- Routes: main tools must use real URLs with unique metadata and explanatory server-rendered HTML.
- Working rules: keep changes minimal, avoid unrelated refactors, add stable tests when useful, and run lint, typecheck, test, build before finishing.
- Docs: `/docs/product-scope.md`, `/docs/route-map.md`

