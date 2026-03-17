# Product Scope

## Goal

Build a Korean-first, ad-supported image utility site that keeps all file processing local in the browser.

## MVP

- Compress image
- Resize image
- Convert image format
- Remove EXIF metadata
- Batch export

## Constraints

- No backend, authentication, database, or cloud upload
- No PDF, HEIC, RAW, video, or end-user AI features
- Use real App Router routes for tool pages
- Render explanatory HTML on the initial response before any client-only tool shell

## Content and SEO direction

- Every main route should have unique title and description metadata
- Tool pages should explain the user problem, local-processing promise, and expected workflow
- Shared tool workflows can include lightweight use-case presets when they stay within current browser-only capabilities
- Guides should support search entry points that can link into tool pages

## Out of scope for this scaffold

- Actual image processing implementation
- Ad network integration
- Analytics, user accounts, or saved history
