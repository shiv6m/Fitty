# Roadmap — Fitty

Part of a three-project build plan (Satellite Collision Predictor → LostSWE → Fitty), running Oct 1 – Dec 11, 2026. This repo is Phase 3 and gets four weeks — it has the most remaining scope and needs a private beta before launch. Schema and security come first; every UI feature after that is a thin layer on a tested data layer.

**Goal:** a public social app where people follow, browse, like and comment on outfits — safe enough for strangers to use.

## Architectural traps (decided up front, not discovered later)

| Trap | Why it bites | Decision |
|---|---|---|
| Schema living only in the dashboard | Dev and prod drift, and you can't review or roll back changes | Capture the current schema as Supabase CLI migrations and generate TS types |
| RLS added after features | Every new table is a data leak until its policies exist | Write tables, RLS policies and RLS tests together, before any UI |
| Offset pagination and live counts | Feeds skip or repeat posts; \`count(*)\` on every card gets slow | Cursor pagination on \`(created_at, id)\`; counter columns kept by triggers |
| Raw photo uploads | Phone photos are 3-8 MB, fill the free storage tier, and carry GPS EXIF data | Compress, resize and strip EXIF in the browser before upload |
| Supabase calls scattered in components | Schema changes ripple through every page | One typed data-access layer; components never call Supabase directly |

## Week F — Data model and security (Nov 9-15)

| Date | Work | Push |
|---|---|---|
| Mon Nov 9 | Confirm \`@supabase/ssr\` everywhere: one server client, one browser client, middleware that refreshes the session; remove any legacy auth-helpers code | \`refactor(auth): unify Supabase clients on @supabase/ssr\` |
| Tue Nov 10 | One migration for the whole social schema: \`follows\`, \`likes\`, \`comments\`, \`outfit_items\`, \`reports\`, plus counter columns kept by triggers; draw the ERD in \`docs/\` | \`feat(db): social schema migration\` |
| Wed Nov 11 | RLS for every new table; storage policy so users write only under their own \`uid/\` folder | \`feat(db): RLS and storage policies\` |
| Thu Nov 12 | RLS test suite (pgTAP via \`supabase test db\`) with two users, run in CI with \`supabase start\` | \`test(db): RLS policy suite in CI\` |
| Fri Nov 13 | Upload pipeline: compress and resize in the browser, strip EXIF (GPS), fixed aspect ratio, size limit enforced client and server side | \`feat(upload): compress, resize, strip EXIF\` |
| Sat Nov 14 | Typed data-access layer in \`lib/data/\` using the generated types; components stop calling Supabase directly | \`refactor: typed data-access layer\` |
| Sun Nov 15 | Move existing pages (profile, settings, posting) onto the data layer; buffer | \`refactor: migrate existing pages to data layer\` |

## Week G — Social core (Nov 16-22)

| Date | Work | Push |
|---|---|---|
| Mon Nov 16 | Public profiles at \`/u/[username]\`, follow/unfollow, follower and following counts | \`feat(social): public profiles and follows\` |
| Tue Nov 17 | Following feed with cursor pagination on \`(created_at, id)\` and infinite scroll | \`feat(feed): cursor-paginated following feed\` |
| Wed Nov 18 | Outfit detail page \`/o/[id]\`: large image, tagged items, caption, author | \`feat(outfit): detail page\` |
| Thu Nov 19 | Likes with optimistic UI and rollback on error | \`feat(social): likes with optimistic updates\` |
| Fri Nov 20 | Comments: paginated list, create, delete own | \`feat(social): comments\` |
| Sat Nov 21 | Explore page: recent and trending (likes in the last 7 days) through a SQL view or RPC | \`feat(explore): recent and trending\` |
| Sun Nov 22 | User search by username with a \`pg_trgm\` index | \`feat(search): username search\` |

## Week H — Completeness (Thanksgiving week, Nov 23-29)

| Date | Work | Push |
|---|---|---|
| Mon Nov 23 | Edit and delete outfits; deleting removes the storage object too | \`feat(outfit): edit and delete with storage cleanup\` |
| Tue Nov 24 | Account deletion (cascade + storage cleanup in a server-only action with the service role), password reset, email confirmation | \`feat(account): deletion, password reset, email confirm\` |
| Wed Nov 25 | Report post/user flow and a minimal admin review page gated by a role claim | \`feat(moderation): reports and admin review\` |
| Thu Nov 26 | Off — Thanksgiving | — |
| Fri Nov 27 | Skeletons, empty states, error boundaries, \`not-found\` pages | \`feat(ui): loading, empty and error states\` |
| Sat Nov 28 | Mobile-first pass, design tokens for the minimalist look, PWA manifest and icons | \`feat(ui): mobile polish and PWA manifest\` |
| Sun Nov 29 | Buffer | — |

## Week I — Hardening and launch (Nov 30-Dec 6)

| Date | Work | Push |
|---|---|---|
| Mon Nov 30 | Playwright end-to-end: sign up → post → follow → like → comment → delete account; run in CI | \`test(e2e): core user journey\` |
| Tue Dec 1 | Seed script and a demo account recruiters can log into | \`chore: seed data and demo account\` |
| Wed Dec 2 | Separate production Supabase project; migrations applied from CI; Vercel env vars per environment | \`ci: production migrations and environments\` |
| Thu Dec 3 | Security pass: service-role key server-only, auth rate limits, security headers and CSP in \`next.config\` | \`feat(security): headers, CSP, key audit\` |
| Fri Dec 4 | Deploy, Sentry, private beta with 5-10 friends | \`release: v0.9.0-beta\` |
| Sat Dec 5 | Fix beta feedback | \`fix: beta feedback\` |
| Sun Dec 6 | Public launch, README with demo GIF and architecture | \`release: v1.0.0\` |

## Definition of done

- [ ] Every table has RLS and passing policy tests in CI
- [ ] Uploads compressed with EXIF stripped
- [ ] Follow, feed, likes, comments, explore and search work end to end
- [ ] Account deletion removes all user data and images
- [ ] Reporting and admin review in place
- [ ] Playwright journey green; separate production project; demo account ready
