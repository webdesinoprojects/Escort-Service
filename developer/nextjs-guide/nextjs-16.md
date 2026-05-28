# Next.js 16 Guide

Checked on: 2026-05-28

Installed stable version: `next@16.2.6`.

## Stable-Only Rule

Use stable Next.js 16 APIs only. Do not use canary packages, beta docs, deprecated examples, or `experimental` config.

Allowed stable project defaults:

- `reactCompiler: true` - stable in Next.js 16 after React Compiler 1.0.
- `cacheComponents: true` - stable Next.js 16 caching model.
- `src/app` App Router.
- `proxy.ts` instead of `middleware.ts`.
- `next/image`, `next/font`, Server Components, Server Actions, Route Handlers.

Do not use:

- `middleware.ts` for new code.
- `next/legacy/image`.
- Pages Router files under `pages/`.
- `unstable_cache` for new catalog/admin data.
- Broad image `domains` or wildcard `remotePatterns`.
- `NEXT_PUBLIC_` variables for secrets.

## Routing Rules

Use App Router file conventions:

- Public storefront groups go under `src/app/(store)`.
- Admin routes go under `src/app/admin`.
- Use route groups such as `(store)`, `(auth)`, and `(protected)` to organize layouts without changing the URL.
- Use dynamic segments for ecommerce data: `[categorySlug]`, `[productSlug]`, `[slug]`, `[id]`.
- Use `loading.tsx`, `error.tsx`, and `not-found.tsx` where the route has real async work.
- Keep route-specific components in `_components` folders near the route.

Example route intent:

```txt
src/app/(store)/page.tsx                           -> /
src/app/(store)/categories/[categorySlug]/page.tsx -> /categories/cable-lugs
src/app/(store)/products/[productSlug]/page.tsx    -> /products/example-product
src/app/admin/(protected)/products/page.tsx        -> /admin/products
src/app/admin/(auth)/login/page.tsx                -> /admin/login
```

## Caching Rules

Cache Components are enabled. This means every async data source must make an explicit choice:

- Public catalog sections that can be shared across visitors: use `"use cache"`, `cacheLife`, and `cacheTag`.
- Admin-controlled content after mutation: call `updateTag` for immediate freshness.
- Personalized data such as cart, session, admin identity, drafts, or permissions: do not use `"use cache"`; stream behind `Suspense` or render dynamically.
- Do not cache secrets, user-specific API responses, or admin dashboard data unless it is explicitly safe and tagged by tenant/role.

Catalog example for later:

```ts
import { cacheLife, cacheTag } from "next/cache";

export async function getFeaturedProducts() {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  return [];
}
```

## Data Fetching

- Fetch catalog/admin data in Server Components, Server Actions, Route Handlers, or `src/server`.
- Client Components are only for interactivity: menus, filters, carts, dialogs, carousel controls, optimistic UI.
- Avoid browser fetches for SEO-critical storefront content.
- Validate all mutation input with `zod`.
- Keep database/API clients inside server-only modules.

## Server Actions

Server Actions are public POST endpoints behind generated IDs. Treat every action like an API route:

- Validate input.
- Check authentication.
- Check role and object-level authorization inside the action.
- Return only the fields required by the UI.
- Never rely on `proxy.ts` as the only authorization gate.

Use actions for admin CRUD, login/logout, cart mutations, wishlist, and contact/lead forms when they fit the form workflow.

## Proxy

Next.js 16 uses `proxy.ts`; `middleware.ts` is deprecated.

Use `src/proxy.ts` only for lightweight request work:

- Header normalization.
- Redirects.
- Locale/domain routing.
- Optimistic auth redirects for admin paths.

Do not use Proxy for slow data fetching or full authorization. The docs state fetch caching options have no effect in Proxy.

## Images

Use `next/image` for product, category, carousel, hero, and admin media previews.

Rules:

- Local image assets live under `public/images/**`.
- Remote image hosts must be added with exact `remotePatterns` after we choose storage/CDN.
- Always provide `alt`.
- Use static imports or `width`/`height` to prevent layout shift.
- Use `fill` only inside a parent with stable dimensions.
- In Next 16, use `preload` for a single true LCP image. Do not use the deprecated `priority` prop.
- Allowed qualities are configured as `[60, 75, 85]`.

## Fonts

Use `next/font` only. Do not add browser runtime Google Fonts links. See `developer/fonts/fonts.md`.

## Sources

- Next.js 16 release: https://nextjs.org/blog/next-16
- Upgrade to Next.js 16: https://nextjs.org/docs/app/guides/upgrading/version-16
- Cache Components: https://nextjs.org/docs/app/getting-started/caching
- Proxy: https://nextjs.org/docs/app/getting-started/proxy
- Image component: https://nextjs.org/docs/app/api-reference/components/image
- Font optimization: https://nextjs.org/docs/app/getting-started/fonts
- Data security: https://nextjs.org/docs/app/guides/data-security
