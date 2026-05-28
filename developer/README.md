# Developer Guide Index

Checked on: 2026-05-28

This project uses stable npm `latest` releases only:

- `next@16.2.6`
- `react@19.2.6`
- `react-dom@19.2.6`
- `shadcn@4.8.2`

Do not install packages from `canary`, `beta`, `rc`, `next`, or `experimental` dist-tags. Do not add `experimental` framework config without explicit approval.

## Read Before Coding

- `developer/nextjs-guide/nextjs-16.md` - Next.js 16 rules, routing, caching, images, proxy, Server Actions.
- `developer/react-guide/react-19.md` - React 19.2 stable APIs and component rules.
- `developer/security/security.md` - Secrets, network exposure, admin security, caching, and logging rules.
- `developer/folder-structure/folder-structure.md` - Planned ecommerce and admin panel structure.
- `developer/fonts/fonts.md` - Font system and `next/font` usage.
- `developer/shadcn/shadcn-components.md` - Installed shadcn primitives and when to use them.

## Current Project Defaults

- App Router with `src/app`.
- Tailwind CSS v4.
- shadcn/ui with Radix, Lucide icons, and CSS variables.
- React Compiler enabled using stable `reactCompiler`.
- Next 16 Cache Components enabled using stable `cacheComponents`.
- `next/image` restricted to `/images/**` local assets until external storage domains are chosen.
- Basic security headers configured in `next.config.ts`.

## Source Policy

For framework behavior, prefer these sources in order:

1. Local docs shipped with the installed package: `node_modules/next/dist/docs/`.
2. Official docs: `nextjs.org`, `react.dev`, `ui.shadcn.com`, `owasp.org`.
3. Third-party articles only for ideas, not as authority.

Important source links:

- Next.js 16 release: https://nextjs.org/blog/next-16
- Next.js 16 upgrade guide: https://nextjs.org/docs/app/guides/upgrading/version-16
- Next.js data security: https://nextjs.org/docs/app/guides/data-security
- React 19.2 release: https://react.dev/blog/2025/10/01/react-19-2
- shadcn components: https://ui.shadcn.com/docs/components
- OWASP API Security Top 10: https://owasp.org/API-Security/editions/2023/en/0x00-header/
