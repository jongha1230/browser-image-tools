# Content Plan

## Purpose

This document defines the initial content plan for the MVP.

The goal is not to publish many pages.
The goal is to publish a small set of useful, crawlable, human-reviewed pages that support the product.

## Content Principles

- Korean first
- clear and practical writing
- no vague or inflated marketing language
- every page must help the user do something or understand something
- tool landing pages must be useful even before interaction
- guide articles must stand on their own
- no thin SEO pages
- no duplicate content across multiple routes

## Core Site Pages

### Home

Goal:

- explain the product quickly
- highlight privacy and browser-local processing
- send users to the main tools

Key sections:

- product summary
- tool links
- why local processing matters
- supported formats
- guide links
- short FAQ or trust section

### Tools Index

Goal:

- show all available tools
- act as a crawlable hub page

Key sections:

- tool cards
- short descriptions
- browser-local processing note
- links to related guides

### About

Goal:

- explain what the site is
- explain why it exists
- build trust

### Privacy

Goal:

- explain local processing and privacy stance
- prepare for future ad and cookie disclosures

### Contact

Goal:

- provide a basic support and trust path

## Tool Page Content Plan

### `/tools/compress-image`

Primary intent:

- compress an image quickly
- understand what compression does

Required page content:

- what image compression is
- when to use it
- supported formats
- local-only processing note
- key limitations
- short FAQ

### `/tools/resize-image`

Primary intent:

- resize an image safely
- understand aspect-ratio behavior

Required page content:

- what resizing is
- when to change dimensions
- supported formats
- aspect-ratio explanation
- local-only processing note
- short FAQ

### `/tools/convert-image`

Primary intent:

- convert between JPEG, PNG, and WebP
- understand which format to choose

Required page content:

- what format conversion is
- when to use JPEG, PNG, or WebP
- supported formats
- local-only processing note
- short FAQ

### `/tools/remove-exif`

Primary intent:

- remove metadata for privacy
- understand what EXIF means

Required page content:

- what EXIF is
- why metadata can matter
- privacy use case
- supported formats
- local-only processing note
- short FAQ

## Guide Content Plan

### `/guides/image-compression-basics`

Goal:

- explain compression for beginners

Draft outline:

- what image compression means
- lossy vs lossless basics
- why file size matters
- when too much compression hurts quality
- simple practical recommendations

### `/guides/webp-vs-jpeg-vs-png`

Goal:

- help users choose the right format

Draft outline:

- JPEG strengths and weaknesses
- PNG strengths and weaknesses
- WebP strengths and weaknesses
- practical selection examples
- simple comparison table

### `/guides/remove-exif-for-privacy`

Goal:

- explain EXIF and privacy concerns

Draft outline:

- what EXIF metadata includes
- when metadata matters
- location and device information examples
- when removing EXIF is useful
- limitations users should know

### `/guides/batch-resize-checklist`

Goal:

- give users a practical workflow

Draft outline:

- define the target output size first
- keep aspect ratio unless necessary
- prepare filenames
- review compression after resizing
- check output before publishing

## Tone Rules

- practical
- direct
- non-salesy
- beginner-friendly without sounding simplistic
- avoid exaggerated claims
- avoid keyword stuffing

## Review Rules

Before publishing any page:

- check for duplicate wording across tool pages
- confirm the H1 matches the page intent
- confirm title and meta description are unique
- confirm the page includes useful non-UI copy
- confirm the page links to related pages
- confirm the content reads naturally in Korean
- confirm a human reviewed the final copy

## Initial Publishing Order

Publish in this order:

1. home
2. tools index
3. four tool pages
4. privacy
5. about
6. contact
7. guides index
8. four guide drafts after human revision

## Notes

Guide drafts can be assisted by Codex, but final wording should be human-reviewed and edited before publish.
The MVP should prioritize fewer useful pages over more weak pages.
