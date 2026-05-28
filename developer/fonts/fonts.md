# Font Guide

Checked on: 2026-05-28

Fonts are loaded with `next/font/google`, which self-hosts them through Next.js. The browser should not make runtime requests to Google Fonts.

## Loaded Fonts

The root layout loads six modern fonts:

- Geist - clean UI and brand fallback.
- Geist Mono - code, SKUs, IDs, technical specs.
- Instrument Sans - default UI/body font.
- Manrope - calm long-form body copy and product descriptions.
- Plus Jakarta Sans - headings and dashboard labels.
- Sora - display/brand sections, hero, major category headings.

## CSS Variables

Configured variables:

```css
--font-sans: var(--font-instrument-sans);
--font-mono: var(--font-geist-mono);
--font-heading: var(--font-plus-jakarta);
--font-display: var(--font-sora);
--font-body: var(--font-manrope);
--font-brand: var(--font-geist-sans);
```

Use Tailwind utilities:

- `font-sans` for standard UI.
- `font-heading` for section headings and admin page titles.
- `font-display` for hero/category display text.
- `font-body` for product descriptions and editorial content.
- `font-brand` for logo-adjacent labels.
- `font-mono` for SKUs, dimensions, order IDs, and logs.

## Rules

- Do not add raw `<link>` tags for Google Fonts.
- Do not import fonts in random components.
- Do not use more than two visible font families in one compact surface.
- Keep font weights intentional. Avoid using every available weight.
- If a paid/local font is added later, put source files under `src/assets/fonts` and load with `next/font/local`.
- Use `public/fonts` only if a file must be directly addressable by URL.

## Sources

- Next.js font optimization: https://nextjs.org/docs/app/getting-started/fonts
- Next.js font API: https://nextjs.org/docs/app/api-reference/components/font
- Google Fonts: https://fonts.google.com/
