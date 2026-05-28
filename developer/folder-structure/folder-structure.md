# Folder Structure Guide

Checked on: 2026-05-28

Use Next.js App Router conventions instead of flat random folders. Route groups, dynamic segments, private folders, and colocated route files are expected.

## Target Structure

```txt
src/
  app/
    (store)/
      layout.tsx
      page.tsx
      categories/
        page.tsx
        [categorySlug]/
          page.tsx
      products/
        [productSlug]/
          page.tsx
      new-launches/
        page.tsx
      popular/
        page.tsx
      search/
        page.tsx
      _components/
        site-header.tsx
        site-footer.tsx
        product-card.tsx
    admin/
      (auth)/
        login/
          page.tsx
      (protected)/
        layout.tsx
        page.tsx
        products/
          page.tsx
          [productId]/
            page.tsx
        categories/
          page.tsx
        homepage/
          page.tsx
        media/
          page.tsx
        orders/
          page.tsx
        users/
          page.tsx
        settings/
          page.tsx
      _components/
        admin-sidebar.tsx
        admin-page-header.tsx
    api/
      webhooks/
        payment/
          route.ts
    layout.tsx
    globals.css
  components/
    ui/
    site/
    admin/
  features/
    catalog/
      components/
      queries.ts
      actions.ts
      types.ts
    homepage/
      components/
      queries.ts
      actions.ts
      types.ts
    cart/
      components/
      actions.ts
      types.ts
    admin/
      components/
      actions.ts
      types.ts
  server/
    auth/
    db/
    repositories/
    services/
    validators/
  lib/
    utils.ts
  hooks/
public/
  images/
    hero/
    categories/
    products/
    carousel/
```

## Routing Rules

- `(store)` keeps the storefront root at `/` while grouping public routes.
- `admin/(protected)` keeps URLs like `/admin/products` while applying an admin layout.
- `admin/(auth)/login` keeps the login URL as `/admin/login`.
- Product and category detail pages must use dynamic segments, not query-only pages.
- Use `[productSlug]` for public product URLs and `[productId]` for admin edit URLs.
- Use `_components` for route-private UI that should not become a URL segment.

## Component Placement

- `src/components/ui`: shadcn generated primitives only.
- `src/components/site`: shared storefront layout components used across multiple store routes.
- `src/components/admin`: shared admin layout components used across admin routes.
- `src/features/*/components`: feature-specific reusable components.
- `src/app/**/_components`: route-specific components.

Do not put every component in one global `components` folder. Promote a component only when it is reused outside its route or feature.

## Server Placement

- `src/server/db`: database client and schema access.
- `src/server/auth`: session lookup, role checks, password/session helpers.
- `src/server/repositories`: raw persistence operations.
- `src/server/services`: business logic such as publishing products or rebuilding homepage sections.
- `src/server/validators`: `zod` schemas shared by actions and route handlers.

Every file in `src/server` that must never run on the client should start with `import "server-only"`.

## Admin-Controlled Content Areas

The admin panel should control these content groups:

- Homepage hero image, heading, CTA, and sort order.
- Homepage carousel slides.
- Categories and category images.
- Products, variants, images, documents, specs, and SEO metadata.
- New launches and popular products.
- Footer columns, social links, address, and policies.
- Storewide announcement bar.

Each group should have a cache tag so admin edits can revalidate only the affected storefront section.

## Sources

- Next.js project structure: https://nextjs.org/docs/app/getting-started/project-structure
- Next.js dynamic routes: https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
- Next.js route groups: https://nextjs.org/docs/app/building-your-application/routing/route-groups
- Next.js project organization: https://nextjs.org/docs/app/getting-started/project-structure
