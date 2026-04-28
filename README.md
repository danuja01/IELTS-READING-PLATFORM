# IELTS Platform Workspace

This repository uses a small workspace layout:

- `package.json` (root): workspace coordinator
- `apps/web/package.json`: actual Next.js application dependencies and scripts

## Why two package.json files?

- Root `package.json` manages workspace-level commands.
- App `package.json` contains the real app runtime/build dependencies.

This is standard for scalable projects where you may later add:
- `apps/admin`
- `apps/api`
- `packages/ui`

## Run commands

From project root (pnpm):

- Install deps: `pnpm install`
- Clear Next cache (after config/CSS issues): `pnpm clean`
- Start app: `pnpm dev`
- Build app: `pnpm build`
- Start prod server: `pnpm start`
- Lint app: `pnpm lint`

## Current structure

- `apps/web`: IELTS Reading web app (Next.js)
- `supabase`: SQL migrations and seed data
