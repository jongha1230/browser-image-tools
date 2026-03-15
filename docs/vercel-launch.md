# Vercel Launch Checklist Before the Final Domain Exists

## Goal

Keep the site safe to preview on Vercel while making the decision boundary explicit between:

- a shareable demo-only Production `vercel.app` deployment
- a temporary public canonical site on the Production `vercel.app` host
- the later custom-domain launch

## Required environment variables

- `SITE_URL`
  - Server-side source of truth for the canonical public origin.
  - When both URL variables exist, this repository prefers `SITE_URL`.
- `NEXT_PUBLIC_SITE_URL`
  - Client-visible copy of the same canonical public origin.
  - Keep it identical to `SITE_URL`.
- `ALLOW_VERCEL_APP_INDEXING`
  - Explicit opt-in for using the stable Production `vercel.app` hostname as the temporary canonical public host.
  - Leave it empty unless Production should become indexable on `vercel.app`.

Recommended rule:

- Production demo-only: leave all three variables empty.
- Production public on `vercel.app`: set both URL variables to the exact Production `https://<project>.vercel.app` origin and set `ALLOW_VERCEL_APP_INDEXING=true`.
- Production after custom-domain launch: set both URL variables to the exact custom-domain origin and leave `ALLOW_VERCEL_APP_INDEXING` empty.
- Preview: leave all three variables empty.
- Development: leave all three variables empty unless you are explicitly testing canonical behavior.

## Demo-only mode

If `SITE_URL` and `NEXT_PUBLIC_SITE_URL` are empty, or if they point to a `*.vercel.app` hostname without `ALLOW_VERCEL_APP_INDEXING=true`:

- the HTML metadata stays `noindex, nofollow`
- responses also emit `X-Robots-Tag: noindex, nofollow`
- `robots.txt` disallows all crawling
- `sitemap.xml` returns no URLs
- `rss.xml` returns `404` with `X-Robots-Tag: noindex, nofollow`
- no canonical URL is emitted in page metadata
- no production-host redirect is enabled

This keeps preview and public demo access usable without teaching search engines the wrong canonical host.

## Temporary public canonical mode on `vercel.app`

Using the stable Production `vercel.app` hostname as the temporary canonical public host is reasonable only when all of these are true:

1. One dedicated Vercel project is already serving the site from a stable Production hostname.
2. The operator is comfortable letting search engines learn that `vercel.app` URL first.
3. Preview deployments remain non-canonical and non-indexable.
4. The team accepts that a later move to a custom domain will require canonical migration and re-validation in search tools.

When Production is intentionally switched to this mode:

1. Set `SITE_URL` to the exact Production `https://<project>.vercel.app` origin.
2. Set `NEXT_PUBLIC_SITE_URL` to the same origin.
3. Set `ALLOW_VERCEL_APP_INDEXING=true` in the Production environment only.
4. Keep Preview variables empty.
5. Redeploy Production.

After that redeploy:

- page metadata emits canonical URLs on the Production `vercel.app` host
- HTML robots metadata becomes indexable
- `robots.txt` allows crawling and publishes the sitemap URL
- `sitemap.xml` lists the full route set on the Production `vercel.app` host
- `rss.xml` returns `200` and uses the same host
- production-only canonical redirects point at that Production `vercel.app` host

## When not to switch yet

Keep the site demo-only for now if any of these are true:

- the project name or Production hostname may still change soon
- the branded custom domain is expected shortly enough that a double launch would create avoidable canonical churn
- Search Console and Search Advisor should start on the final branded host instead of the temporary `vercel.app` host
- the site still needs major route or content reshaping before public indexing

## After the final domain is purchased

1. Decide the canonical production origin first.
2. Add the canonical origin to the Vercel project.
3. Set `SITE_URL` and `NEXT_PUBLIC_SITE_URL` to that exact `https://` custom-domain origin in Production.
4. Clear `ALLOW_VERCEL_APP_INDEXING`.
5. Redeploy Production.
6. Verify that the production response now includes:
   - canonical URLs on the custom domain
   - an allow-all `robots.txt`
   - a populated `sitemap.xml`
   - a working `rss.xml`

## Recommended apex/www strategy

Pick one canonical host and redirect the other:

- If brand trust and short URLs matter most, use the apex domain as canonical and redirect `www` to apex.
- If you want DNS and CDN operations to stay slightly more conventional, use `www` as canonical and redirect apex to `www`.

The important rule is consistency:

- only one host should be canonical
- `SITE_URL` and `NEXT_PUBLIC_SITE_URL` must match that host exactly
- every secondary host, including the default `vercel.app` hostname after the custom-domain launch, should redirect to the canonical host in production

## What to configure in the Vercel dashboard

Project settings to review:

- Framework Preset: `Next.js`
- Production Branch: `main`
- Environment Variables:
  - Production demo-only on `vercel.app`: leave `SITE_URL`, `NEXT_PUBLIC_SITE_URL`, and `ALLOW_VERCEL_APP_INDEXING` empty
  - Production public on `vercel.app`: set `SITE_URL`, `NEXT_PUBLIC_SITE_URL`, and `ALLOW_VERCEL_APP_INDEXING=true`
  - Production after custom-domain launch: set `SITE_URL` and `NEXT_PUBLIC_SITE_URL`, clear `ALLOW_VERCEL_APP_INDEXING`
  - Preview: keep all three variables empty unless there is a deliberate temporary reason to test canonical behavior
- Domains:
  - while the site is demo-only or temporarily public on `vercel.app`, the default Production `vercel.app` hostname can remain the share URL
  - after the domain purchase, add the chosen canonical host
  - add the secondary host (`www` or apex)
  - configure the non-canonical host to redirect to the canonical host

## Duplicate-host handling

This repository treats host normalization as production-only behavior:

- Preview deployments stay browsable and unforced.
- Production requests redirect to the canonical origin whenever the site is indexable.
- Leaving the variables unset keeps preview and demo-only Production deployments from redirecting.

That means the safe rollout path is:

1. launch preview builds freely
2. keep Production non-indexable on `vercel.app` while the site is still demo-only
3. if the temporary public-host decision is accepted, set the Production `vercel.app` origin variables and enable `ALLOW_VERCEL_APP_INDEXING=true`
4. later connect the real domain
5. switch the Production origin variables to the custom domain
6. let Vercel domain redirects and the app proxy enforce the canonical host
