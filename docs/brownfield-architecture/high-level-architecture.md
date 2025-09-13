# High Level Architecture

## Technical Summary

Modern Next.js 15 application with experimental Partial Prerendering (PPR), real-time AI streaming via Vercel AI SDK v5, PostgreSQL database with Drizzle ORM, and sophisticated document management system. Built for scale with Redis-backed resumable streams and multi-model AI support.

## Actual Tech Stack (from package.json)

| Category       | Technology          | Version              | Notes                                        |
| -------------- | ------------------- | -------------------- | -------------------------------------------- |
| Runtime        | Node.js             | 20.x                 | Required for Next.js 15                     |
| Framework      | Next.js             | 15.3.0-canary.31     | App Router, experimental PPR enabled        |
| UI Library     | React               | 19.0.0-rc            | Release candidate - potential stability risk |
| Language       | TypeScript          | 5.6.3                | Strict mode enabled                         |
| Database       | PostgreSQL (Neon)   | via @vercel/postgres | Serverless Postgres                         |
| ORM            | Drizzle             | 0.34.0               | TypeScript-first ORM                        |
| Auth           | NextAuth.js         | 5.0.0-beta.25        | Beta version - migration needed eventually  |
| AI SDK         | Vercel AI SDK       | 5.0.26               | Latest stable version                       |
| Styling        | Tailwind CSS        | 4.1.13               | Alpha version with new engine               |
| Components     | shadcn/ui           | Latest               | Radix UI primitives                         |
| Animation      | Framer Motion       | 11.3.19              | Animation library                           |
| Cache/Session  | Redis               | 5.0.0                | Optional for resumable streams              |
| Storage        | Vercel Blob         | 0.24.1               | File attachments                            |
| Linting        | Biome               | 1.9.4                | Replaces ESLint/Prettier                    |
| Testing        | Playwright          | 1.50.1               | E2E testing                                 |
| Package Manager| pnpm                | 9.12.3               | Fast, efficient package management          |

## Repository Structure Reality Check

- Type: Monorepo with BMAD framework integration
- Package Manager: pnpm with lockfile version 9.7
- Notable: Complex `.bmad-core/` directory with extensive templates and automation tools
