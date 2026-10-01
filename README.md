# Fitty (Fitfolio)

A minimalist outfit-sharing social app. Next.js (App Router, TypeScript) + Supabase (Postgres, Auth, Storage).

## Status

🚧 **Actively in development** — built in public, Oct 1 – Dec 11, 2026. See [ROADMAP.md](./ROADMAP.md) for the full build plan and what's shipping when.

**Current phase:** Week 0 — shared foundation (Phase 3 feature work runs Nov 9 – Dec 6)
**Target launch:** Dec 6, 2026

### What works today

- Email/password auth with session-based route protection (`(protected)` route group)
- Outfit posting flow: image upload to Supabase Storage, caption, persisted via the `outfits` table
- Profile page (avatar, username, outfits/saved tabs, 3-column grid) — currently still routed at `/outfits`
- Settings page, bottom nav, login page
- Light/dark theme toggle with a pre-hydration inline script (no flash of unstyled content) and `localStorage` persistence

### Known gaps

- Profile page is functionally a profile view but still lives at the `/outfits` route — a rename is tracked as a follow-up, not yet done
- No RLS test suite yet (Week F, Nov 12, adds pgTAP tests in CI)
- No follow/feed/likes/comments — social core doesn't exist yet (Week G, Nov 16–22)
- No production Supabase project yet — everything runs against the dev project (Week I, Dec 2)
- No automated tests or CI yet (Week 0's Oct 3 task adds the harness)

## Getting started

```bash
npm install
npm run dev
```

Needs a `.env.local` with your Supabase project URL and anon key — see `app/lib/supabaseClient.ts` for the expected variable names.

```bash
npm run build
npm run lint
```
