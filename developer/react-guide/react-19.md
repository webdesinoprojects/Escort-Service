# React 19 Guide

Checked on: 2026-05-28

Installed stable version: `react@19.2.6` and `react-dom@19.2.6`.

## Stable-Only Rule

Use APIs from stable React 19 and React 19.2. Do not install canary or experimental React builds.

## Server-First Components

In Next App Router, components are Server Components by default. Keep that default unless the component needs:

- `useState`, `useReducer`, or event handlers.
- `useEffect` or browser APIs.
- Interactive UI such as drawers, filters, tabs, menus, carousels, or admin table controls.

If a file needs those, add `"use client"` at the top and keep it as small as practical.

## React 19 APIs To Use

- Actions: use with forms and Server Actions for admin mutations and cart flows.
- `useActionState`: show form validation results and pending state without extra state wiring.
- `useFormStatus`: build submit buttons that react to the nearest parent form.
- `useOptimistic`: cart quantity, wishlist, and admin row updates that need immediate feedback.
- `use`: unwrap promises/context only where the framework pattern supports it.
- `ref` as a prop: avoid unnecessary `forwardRef` wrappers in new custom components unless a library requires it.

## React 19.2 APIs To Use Carefully

- `<Activity>`: Next.js uses Activity with Cache Components for client navigation state preservation. Do not add direct Activity wrappers unless there is a clear UI state-preservation requirement.
- `useEffectEvent`: use for event logic inside effects, such as subscriptions or analytics callbacks, where the effect should not rerun because theme or labels changed.
- `cacheSignal`: server-side only, useful when deduped cached work needs cancellation. Do not use in Client Components.

## React Compiler

React Compiler is enabled through stable Next.js `reactCompiler: true`.

Rules:

- Do not add `useMemo` and `useCallback` by habit.
- Keep components pure.
- Do not mutate props or module-level shared state during render.
- Use `"use no memo"` only if the compiler causes a measured issue.

## Security Rules

- Do not render admin-controlled HTML with `dangerouslySetInnerHTML` unless it has been sanitized server-side.
- Treat all Client Component props as public. If it reaches a Client Component, it can be visible in HTML, RSC payloads, JavaScript, React DevTools, or the Network tab.
- Do not log secrets, tokens, raw sessions, cookies, payment payloads, or user PII in browser code.
- Do not put authorization logic only in UI conditionals. UI hiding is not security.

## Sources

- React 19 release: https://react.dev/blog/2024/12/05/react-19
- React 19.2 release: https://react.dev/blog/2025/10/01/react-19-2
- React Compiler: https://react.dev/learn/react-compiler
- Next.js React Compiler config: https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler
