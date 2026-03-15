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
