# shadcn/ui Guide

Checked on: 2026-05-28

Installed stable CLI: `shadcn@4.8.2`.

Project config:

- Style: `radix-nova`
- RSC: enabled
- TypeScript: enabled
- Tailwind CSS v4
- Icons: Lucide
- UI path: `src/components/ui`

## Rule

Before building any UI primitive, check shadcn first. If a shadcn component exists, use it and compose it. Only write custom UI when the component is domain-specific, such as `ProductCard`, `HeroCarousel`, or `AdminProductEditor`.

## Installed Components

```txt
accordion
alert
alert-dialog
aspect-ratio
avatar
badge
breadcrumb
button
button-group
calendar
card
carousel
chart
checkbox
collapsible
command
context-menu
dialog
drawer
dropdown-menu
empty
field
hover-card
input
input-group
input-otp
item
kbd
label
menubar
native-select
navigation-menu
pagination
popover
progress
radio-group
resizable
scroll-area
select
separator
sheet
sidebar
skeleton
slider
sonner
spinner
switch
table
tabs
textarea
toggle
toggle-group
tooltip
```

## shadcn Components To Check In Docs

The official shadcn catalog also includes primitives and patterns such as:

```txt
combobox
data-table
date-picker
direction
form patterns
toast legacy
typography
```

Some are patterns composed from primitives instead of generated single files. Check the docs before custom-building them.

## Ecommerce Mapping

- Header/nav: `navigation-menu`, `sheet`, `dropdown-menu`, `button`, `badge`.
- Mobile menu: `sheet`, `accordion`, `scroll-area`.
- Product cards: compose `card`, `badge`, `button`, `aspect-ratio`, `tooltip`.
- Product detail: `carousel`, `tabs`, `accordion`, `separator`, `drawer`.
- Category filters: `checkbox`, `slider`, `select`, `sheet`, `button-group`.
- Admin shell: `sidebar`, `breadcrumb`, `dropdown-menu`, `avatar`, `sonner`.
- Admin CRUD: `table`, `field`, `input`, `textarea`, `select`, `switch`, `dialog`, `alert-dialog`.
- Dashboard: `chart`, `card`, `tabs`, `progress`.
- Empty/loading states: `empty`, `skeleton`, `spinner`.

## Aceternity Rule

Use Aceternity only for high-impact storefront effects where shadcn does not provide the desired visual pattern. Do not use Aceternity for dense admin workflows. Any Aceternity component must be tested on mobile and Safari-like constraints before keeping it.

## Commands

Add a stable shadcn component:

```bash
npx shadcn@latest add component-name
```

Do not install from shadcn canary, beta, or rc tags.

## Sources

- shadcn components: https://ui.shadcn.com/docs/components
- shadcn `components.json`: https://ui.shadcn.com/docs/components-json
- shadcn theming: https://ui.shadcn.com/docs/theming
- Aceternity components: https://ui.aceternity.com/components
