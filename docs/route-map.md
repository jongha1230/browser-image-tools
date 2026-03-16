# Route Map

## Purpose

This document defines the intended route structure for the MVP.

Routing rules:

- every main tool must have a real route
- every indexable page must have unique metadata
- explanatory page copy must exist in initial HTML
- internal navigation must use normal crawlable links
- do not use hash fragments as primary page URLs

## Current MVP Route Tree

- `/`
- `/tools`
- `/tools/compress-image`
- `/tools/resize-image`
- `/tools/convert-image`
- `/tools/remove-exif`
- `/guides`
- `/guides/resize-or-compress-first`
- `/guides/transparent-image-conversion-checklist`
- `/guides/why-converted-images-get-larger`
- `/guides/batch-processing-preflight-checklist`
- `/guides/browser-local-image-processing-limits`
- `/guides/blog-cms-image-prep-checklist`
- `/guides/product-thumbnail-image-settings`
- `/guides/avoid-repeat-export-quality-loss`
- `/guides/when-png-is-the-wrong-choice`
- `/guides/blog-image-upload-final-checklist`
- `/guides/listing-image-resize-vs-compress`
- `/guides/detail-image-upload-mistakes`
- `/guides/batch-cleanup-before-product-upload`
- `/guides/image-compression-basics`
- `/guides/webp-vs-jpeg-vs-png`
- `/guides/remove-exif-for-privacy`
- `/guides/batch-resize-checklist`
- `/about`
- `/privacy`
- `/contact`
- `/robots.txt`
- `/sitemap.xml`
- `/rss.xml`

`ads.txt` is still intentionally deferred until a real publisher ID exists.

## Route Definitions

### `/`

Purpose:

- explain the product clearly
- link to the main tools
- link to the guides hub
- state that files stay in the browser

### `/tools`

Purpose:

- act as the tool index
- provide crawlable entry points to each tool page

### `/tools/compress-image`

Purpose:

- explain image compression
- provide the compression UI
- describe supported formats and local-only processing

### `/tools/resize-image`

Purpose:

- explain image resizing
- provide the resize UI
- explain aspect-ratio behavior and supported formats

### `/tools/convert-image`

Purpose:

- explain format conversion
- provide the conversion UI
- explain common use cases for JPEG, PNG, and WebP

### `/tools/remove-exif`

Purpose:

- explain EXIF removal
- provide the EXIF removal UI
- explain the privacy use case

### `/guides`

Purpose:

- act as the guide index
- link to all guide articles
- support internal linking between content and tool pages

### `/guides/resize-or-compress-first`

Purpose:

- explain when resize should happen before compression
- help users choose a safer workflow order
- connect resize and compression tools with a practical decision guide

### `/guides/transparent-image-conversion-checklist`

Purpose:

- explain what breaks when transparent images are converted carelessly
- help users choose between JPEG, PNG, and WebP for transparent assets
- connect common conversion mistakes to the format conversion tool

### `/guides/why-converted-images-get-larger`

Purpose:

- explain why format conversion can increase file size
- help users check format, resolution, and quality together
- connect conversion decisions back to resize and compression tools

### `/guides/batch-processing-preflight-checklist`

Purpose:

- explain how to group files before batch processing
- reduce avoidable rework in compression, resize, and conversion flows
- connect guide content to the current batch export workflow

### `/guides/browser-local-image-processing-limits`

Purpose:

- explain the realistic limits of browser-only image processing
- set expectations for large files, large batches, and browser behavior
- reinforce the local-processing promise without overstating it

### `/guides/blog-cms-image-prep-checklist`

Purpose:

- explain how to separate representative images, inline images, and captures before blog or CMS upload
- help users decide when resize, compression, and format conversion should happen before publishing
- connect publishing workflows back to the current tool routes without adding new features

### `/guides/product-thumbnail-image-settings`

Purpose:

- explain how to prepare consistent thumbnail and list images for product pages
- help users separate list-image settings from zoom or detail-image settings
- connect resizing, compression, and conversion decisions to batch-ready shopping workflows

### `/guides/avoid-repeat-export-quality-loss`

Purpose:

- explain why repeated export cycles degrade image quality
- help users keep a safer master-and-derivatives workflow
- connect quality-preservation advice to the current resize, compression, and conversion tools

### `/guides/when-png-is-the-wrong-choice`

Purpose:

- explain when PNG is not the most practical output format
- help users compare PNG against JPEG and WebP for photos, thumbnails, and uploads
- connect format tradeoffs back to the current conversion and compression tools

### `/guides/blog-image-upload-final-checklist`

Purpose:

- explain what should be checked right before blog publishing image upload
- separate representative images, inline photos, and captures into different final checks
- connect final publishing decisions back to resize, compression, and conversion tools

### `/guides/listing-image-resize-vs-compress`

Purpose:

- explain whether list and thumbnail images should be resized first or only compressed
- help users split listing-image decisions from detail-image decisions
- connect shopping-list upload workflows back to resize and compression tools

### `/guides/detail-image-upload-mistakes`

Purpose:

- explain common mistakes when product detail images and explanation captures are uploaded together
- help users separate photo files from text-heavy captures before export
- connect format, compression, and scope-limit decisions back to the existing tools

### `/guides/batch-cleanup-before-product-upload`

Purpose:

- explain how to group many product images before repeated uploads
- help users align list images, detail images, and camera originals with one batch workflow
- connect resize, compression, conversion, and EXIF cleanup to real ecommerce preparation work

### `/about`

Purpose:

- explain what the site is
- explain why it exists
- improve trust

### `/privacy`

Purpose:

- explain local processing
- explain privacy expectations
- prepare for future ad and cookie disclosures

### `/contact`

Purpose:

- provide a simple trust and support entry point

## Metadata Rules

Each indexable page should include:

- a unique title
- a unique meta description
- a unique H1
- a canonical URL
- sensible OG defaults

## Linking Rules

Required internal links:

- home links to tools and guides
- tools index links to every tool page
- each tool page links back to `/tools`
- guides index links to every guide article
- guide articles link to relevant tool pages
- footer links to `/about`, `/privacy`, and `/contact`

## Non-Indexable Patterns

Do not create indexable routes for:

- temporary upload results
- per-file output pages
- hash-fragment modes such as `#compress`
- near-duplicate SEO landing pages with only small wording changes

## Notes

Batch export is part of the MVP feature scope, but it does not need its own route in the first scaffold.
It can live inside the shared tool workflow unless a dedicated landing page becomes necessary later.
