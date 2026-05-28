# Security Guide

Checked on: 2026-05-28

This ecommerce site will have a public storefront and a privileged admin panel. Anything controlled by admin data must still be treated as untrusted input until validated and safely rendered.

## Core Rule

If data is visible in the browser Network tab, HTML, JavaScript bundle, RSC payload, local storage, session storage, or console, it is public. Security is not achieved by avoiding `console.log`; security is achieved by never sending sensitive data to the browser.

## Secrets And Environment Variables

- Server secrets must not use the `NEXT_PUBLIC_` prefix.
- `NEXT_PUBLIC_` means public and bundled for browser code.
- Put database clients, payment keys, email keys, object storage keys, and admin service tokens in server-only modules.
- Add `import "server-only"` to modules under `src/server`.
- Never render secret env values into JSX, metadata, error messages, or API responses.

## Server Data Boundary

Use a server data layer:

```txt
src/server/db
src/server/auth
src/server/repositories
src/server/services
src/server/validators
```

Rules:

- Validate all external input with `zod`.
- Return view models, not raw database rows.
- Strip fields such as password hashes, reset tokens, internal notes, supplier cost, private margins, and audit metadata unless explicitly required.
- Check role and object access inside each server function.

## Admin Panel

- Admin routes require server-side auth checks in layouts/actions/route handlers.
- Use HttpOnly, Secure, SameSite cookies for sessions.
- Never store admin tokens in local storage.
- Every admin mutation must check the current admin role.
- Every object mutation must check object-level permission, not just route access.
- Add audit logs for content changes, product changes, image changes, and user role changes.

## Server Actions And APIs

Treat Server Actions as public POST endpoints:

- Authenticate inside the action.
- Authorize inside the action.
- Validate input before database work.
- Rate-limit sensitive actions.
- Return minimal data.

Route Handlers follow the same rules. For sensitive responses, set no-store cache headers.

## Proxy

`src/proxy.ts` can redirect unauthenticated users away from admin pages for UX, but it is not the security boundary. It must not be the only place where authorization happens.

## Caching

Cache Components are enabled, so cache choices must be explicit:

- Public catalog, categories, homepage sections, footer, and carousel config can be cached with tags.
- Admin dashboard data, draft content, sessions, carts, and user-specific data must not use `"use cache"`.
- After admin content mutations, revalidate the matching tag with `updateTag`.
- Do not cache responses containing secrets or PII.

## Logging

Do not log:

- Passwords or password reset tokens.
- Session cookies or JWTs.
- API keys or webhook secrets.
- Full payment payloads.
- Full addresses, phone numbers, or emails unless redacted.
- Internal cost/margin data.

Use structured logs later with redaction. Browser logs are for non-sensitive UI state only and should be removed from production code.

## Admin-Controlled Content

- Sanitize rich text server-side before rendering.
- Prefer structured content blocks over arbitrary HTML.
- Validate image MIME type, size, dimensions, and extension.
- Use a storage allowlist in `next.config.ts` before rendering remote images.
- Never allow `javascript:` URLs in links.
- For uploaded SVGs, either disallow them or sanitize and serve with safe headers.

## Headers

Configured now:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- restrictive `Permissions-Policy`

Add a full Content Security Policy after final domains are known for images, scripts, payment gateway, analytics, and storage. A wrong CSP can break Next scripts or checkout flows, so it should be tested with the real integrations.

## Dependency Notes

`npm audit` on 2026-05-28 reports a moderate advisory through Next's nested PostCSS dependency. npm suggests downgrading Next to `9.3.3`, which is not acceptable for this project. Track the upstream Next patch instead of force-fixing to an old major.

The local Node version is `v24.14.1`. One transitive CLI package warns it wants `^24.15.0`; project commands still ran. Upgrade Node to `24.15.0` or newer if CLI engine warnings become blocking.

## Sources

- Next.js data security: https://nextjs.org/docs/app/guides/data-security
- Next.js environment variables: https://nextjs.org/docs/app/guides/environment-variables
- Next.js Server Actions config: https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions
- OWASP Top 10: https://owasp.org/Top10/2021/
- OWASP API Security Top 10 2023: https://owasp.org/API-Security/editions/2023/en/0x00-header/
- OWASP Secrets Management: https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
- OWASP XSS Prevention: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
