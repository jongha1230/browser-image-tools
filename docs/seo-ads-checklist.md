# SEO and Ads Checklist

## Purpose

This document defines the minimum SEO, privacy, and ad-readiness requirements for the MVP.

The site must be useful before ads are enabled.
Do not optimize for ads before the core product, content, and UX are solid.

## SEO Rules

- every indexable page must have a unique title
- every indexable page must have a unique meta description
- every indexable page must have a unique H1
- every main tool must have a real route
- explanatory copy must exist in initial HTML
- internal navigation must use normal crawlable links
- do not use hash fragments as primary page URLs
- do not create thin pages made only for keywords
- do not create near-duplicate landing pages with small wording changes

## Required Pages and Files

The MVP should include:

- `/`
- `/tools`
- `/tools/compress-image`
- `/tools/resize-image`
- `/tools/convert-image`
- `/tools/remove-exif`
- `/guides`
- `/about`
- `/privacy`
- `/contact`
- `/robots.txt`
- `/sitemap.xml`

Planned during content phase:

- guide article routes under `/guides/...`
- `/rss.xml`

Only add `ads.txt` after the real publisher ID is available.

## Metadata Checklist

Every indexable page should include:

- title
- meta description
- canonical URL
- Open Graph title
- Open Graph description
- Open Graph image default
- one clear H1

## Internal Linking Checklist

- home links to tools and guides
- tools index links to all tool pages
- each tool page links back to `/tools`
- guides index links to all guide articles
- guide articles link to relevant tool pages
- footer links to `/about`, `/privacy`, and `/contact`

## Content Quality Rules

- Korean-first writing
- no vague marketing copy
- no filler paragraphs written only for SEO
- tool pages must explain what the tool does
- tool pages must explain supported formats
- tool pages must explain that files stay in the browser
- tool pages must explain key limitations
- guide articles must be useful without using the tool
- guide drafts must be human-reviewed before publish

## Technical SEO Checklist

Before launch:

- add `robots.txt`
- add `sitemap.xml`
- make sure canonical URLs are correct
- make sure metadata is unique
- confirm internal links are crawlable
- confirm pages render useful HTML without depending on client-only UI
- avoid accidental `noindex` on important pages

After deployment:

- verify site ownership in Google Search Console
- submit sitemap in Google Search Console
- verify site ownership in Naver Search Advisor
- submit sitemap in Naver Search Advisor
- monitor indexing and fix broken metadata or crawl issues

## Privacy and Ad Rules

- do not place ads above the main action area on mobile
- do not block the first viewport with ads or interstitials
- privacy page must explain that file processing stays local in the browser
- privacy page must be ready for third-party ad and cookie disclosure before AdSense launch
- do not invent or placeholder a fake publisher ID
- add `ads.txt` only after the real publisher ID exists

## Privacy Page Requirements

The privacy page should cover:

- what data is processed locally
- whether files are uploaded to a server
- basic analytics disclosure if analytics are added
- future advertising and cookie disclosure placeholder
- contact path for privacy questions

## Launch Checklist

The MVP is launch-ready when:

- main routes exist
- metadata is unique
- `robots.txt` exists
- `sitemap.xml` exists
- privacy page exists
- internal linking is crawlable
- tool pages include useful explanatory copy
- lint passes
- typecheck passes
- test passes
- build passes

## Post-Launch Checks

- inspect index coverage in Google Search Console
- inspect index coverage in Naver Search Advisor
- improve pages with weak impressions or poor CTR
- expand guide content only when it is genuinely useful
- add ads only after UX and privacy requirements are satisfied
