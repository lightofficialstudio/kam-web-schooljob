# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KAM-WEB-SCHOOLJOB is a Thai education job marketplace platform connecting teachers (EMPLOYEE) with schools (EMPLOYER). The platform is Thai-localized with Thai comments, error messages, and uses the Kanit font.

## Development Commands

```bash
bun dev          # Start development server
bun build        # Production build
bun start        # Run production server
bun lint         # Run ESLint
bun postinstall  # Generate Prisma client (runs automatically)
```

For Prisma operations:
```bash
bunx prisma generate      # Generate Prisma client
bunx prisma db push       # Push schema changes to database
bunx prisma studio        # Open Prisma Studio GUI
```

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **UI**: Ant Design 6 + Tailwind CSS 4
- **State**: Zustand 5 (with localStorage persistence)
- **Database**: PostgreSQL via Prisma 7 ORM
- **Auth**: Supabase Auth + Prisma profile sync
- **Validation**: Zod 4
- **Package Manager**: Bun

## Architecture

### Directory Structure

```
/app
  /api/v1/               # REST API routes (versioned)
    /authenticate/       # Auth endpoints (signup, signin)
      /service/          # Business logic services
      /validation/       # Zod schemas
    /admin/              # Admin API routes
  /pages/                # Page components (Next.js App Router)
    /landing/            # Public landing page
    /signin/, /signup/   # Auth pages
    /job/                # Job listings & applications
    /employee/           # Teacher dashboard
    /employer/           # School dashboard
    /admin/              # Admin panel
  /components/
    /layouts/            # Layout wrappers (landing, admin, modal)
  /stores/               # Zustand stores
  /contexts/             # React contexts (theme)
  /lib/                  # Utilities (supabase client)
/lib/
  prisma.ts              # Prisma client singleton
/prisma/
  schema.prisma          # Database schema
```

### User Roles

- **EMPLOYEE**: Teachers seeking jobs
- **EMPLOYER**: Schools posting jobs
- **ADMIN**: System administrators

### Authentication Flow

Dual auth system:
1. **Supabase Auth** handles signup/signin credentials
2. **Prisma Profile** stores extended user data
3. Services in `/api/v1/authenticate/service/` sync both systems

### State Management

- **Zustand stores** (`/app/stores/`): auth-store.ts for user state, notification-modal-store.ts for modals
- **React Context** (`/app/contexts/`): theme-context.tsx for light/dark mode

### API Pattern

Client-side calls use native `fetch()`:
```typescript
const response = await fetch("/api/v1/authenticate/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
```

Server-side API routes use service classes for business logic with Zod validation.

## Key Conventions

- **"use client"** directive required for interactive components
- **Thai language** used in: comments, error messages, user-facing text
- **Console logging** with emoji indicators (✨ ✅ ❌ 🔐 📝) throughout codebase
- **Path alias**: `@/*` maps to project root

## Environment Variables

Required in `.env`:
```
DATABASE_URL
DIRECT_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

## Build Notes

- TypeScript build errors are ignored (`ignoreBuildErrors: true` in next.config.ts)
- Ant Design packages are optimized via `optimizePackageImports`
- Remote images allowed from: unsplash.com, dicebear.com
