# Vercel Launch Checklist Before the Final Domain Exists

## Goal

Keep the site safe to preview and even temporarily expose on Vercel before the real production domain is purchased and connected.

## Required environment variables

- `SITE_URL`
  - Server-side source of truth for the canonical production origin.
  - When both variables exist, this repository prefers `SITE_URL`.
- `NEXT_PUBLIC_SITE_URL`
  - Client-visible copy of the same origin.
  - Set it to the exact same value as `SITE_URL` once the final domain exists.

Recommended rule:

- Production: set both variables to the same final `https://` origin.
- Preview: leave both variables empty.
- Development: leave both variables empty unless you are explicitly testing canonical logic.

## Behavior before a real domain is configured

If `SITE_URL` and `NEXT_PUBLIC_SITE_URL` are both empty, or if they point to a `*.vercel.app` hostname:

- the HTML metadata stays `noindex, nofollow`
- responses also emit `X-Robots-Tag: noindex, nofollow`
- `robots.txt` disallows all crawling
- `sitemap.xml` returns no URLs
- `rss.xml` returns `404` with `X-Robots-Tag: noindex, nofollow`
- no canonical URL is emitted in page metadata
- no production-host redirect is enabled

This keeps preview and temporary `vercel.app` access usable without teaching search engines the wrong canonical host.

## Stable public demo on `vercel.app`

Before a custom domain exists, the safest shareable setup is:

1. Create one dedicated Vercel project for this repo.
2. Use the project's stable Production `vercel.app` address as the public demo URL.
3. Keep `SITE_URL` and `NEXT_PUBLIC_SITE_URL` empty in both Production and Preview.
4. Keep Vercel Authentication or other deployment protection disabled for the Production deployment so anyone with the link can open it.
5. Continue using Preview deployments only for branch checks and internal review links.

That combination keeps the demo public and easy to share while still preventing accidental indexation before the real domain and search-launch configuration exist.

## After the final domain is purchased

1. Decide the canonical production origin first.
2. Add the canonical origin to the Vercel project.
3. Set `SITE_URL` and `NEXT_PUBLIC_SITE_URL` to that exact `https://` origin in the Production environment.
4. Redeploy production.
5. Verify that the production response now includes:
   - canonical URLs on indexable pages
   - an allow-all `robots.txt`
   - a populated `sitemap.xml`
   - a working `rss.xml`

Once those variables point at a non-`vercel.app` origin, the repo starts treating the site as indexable and enables canonical-host redirects for production requests.

## Recommended apex/www strategy

Pick one canonical host and redirect the other:

- If brand trust and short URLs matter most, use the apex domain as canonical and redirect `www` to apex.
- If you want DNS and CDN operations to stay slightly more conventional, use `www` as canonical and redirect apex to `www`.

The important rule is consistency:

- only one host should be canonical
- `SITE_URL` and `NEXT_PUBLIC_SITE_URL` must match that host exactly
- every secondary host, including the default `vercel.app` hostname, should redirect to the canonical host in production

## What to configure in the Vercel dashboard

Project settings to review:

- Framework Preset: `Next.js`
- Production Branch: `main`
- Environment Variables:
  - Production demo on `vercel.app`: leave `SITE_URL` and `NEXT_PUBLIC_SITE_URL` empty
  - Production after custom domain launch: set `SITE_URL` and `NEXT_PUBLIC_SITE_URL`
  - Preview: keep them empty unless there is a deliberate temporary reason to test canonical behavior
- Domains:
  - while the site is demo-only, the default Production `vercel.app` hostname can remain the share URL
  - after the domain purchase, add the chosen canonical host
  - add the secondary host (`www` or apex)
  - configure the non-canonical host to redirect to the canonical host

## Duplicate-host handling

This repository now treats host normalization as production-only behavior:

- Preview deployments stay browsable and unforced.
- Production requests redirect to the canonical origin only when `SITE_URL` or `NEXT_PUBLIC_SITE_URL` points at a non-`vercel.app` host.
- Leaving the variables unset prevents accidental redirects before the final domain exists.

That means the safe rollout path is:

1. launch preview builds freely
2. keep production non-indexable on `vercel.app` until the domain decision is final
3. connect the real domain
4. set the production origin variables
5. let Vercel domain redirects and the app middleware enforce the canonical host
