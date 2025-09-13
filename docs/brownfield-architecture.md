# Guru Chat Bot Brownfield Architecture Document

## Introduction

This document captures the CURRENT STATE of the guru-chat-bot codebase, including technical debt, workarounds, and real-world patterns. It serves as a reference for AI agents working on enhancements.

### Document Scope

Comprehensive documentation of entire system - Next.js AI chatbot with advanced streaming, document management, and multi-model AI integration.

### Change Log

| Date       | Version | Description                 | Author    |
| ---------- | ------- | --------------------------- | --------- |
| 2025-09-13 | 1.0     | Initial brownfield analysis | Winston   |

## Quick Reference - Key Files and Entry Points

### Critical Files for Understanding the System

- **Main Entry**: `app/layout.tsx` - Root application layout with providers
- **Configuration**: `next.config.ts`, `.env.local` (environment variables)
- **Core Business Logic**: `lib/ai/`, `lib/db/`
- **API Definitions**: `app/(chat)/api/` - Chat, stream, and artifact endpoints
- **Database Models**: `lib/db/schema.ts` - Drizzle ORM schemas
- **Key Algorithms**: `lib/ai/reasoning-middleware.ts` - Chain-of-thought processing
- **Authentication**: `lib/auth.ts`, `app/(auth)/api/auth/[...nextauth]/route.ts`

### Most Complex/Critical Components

- **Chat Component**: `components/chat.tsx` - Main chat interface with streaming
- **Artifact System**: `components/artifact.tsx` - Complex document management UI
- **Message Handler**: `components/message.tsx` - Multi-modal message rendering
- **Stream Resume**: `app/(chat)/api/chat/[id]/stream/route.ts` - Resumable streaming

## High Level Architecture

### Technical Summary

Modern Next.js 15 application with experimental Partial Prerendering (PPR), real-time AI streaming via Vercel AI SDK v5, PostgreSQL database with Drizzle ORM, and sophisticated document management system. Built for scale with Redis-backed resumable streams and multi-model AI support.

### Actual Tech Stack (from package.json)

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

### Repository Structure Reality Check

- Type: Monorepo with BMAD framework integration
- Package Manager: pnpm with lockfile version 9.7
- Notable: Complex `.bmad-core/` directory with extensive templates and automation tools

## Source Tree and Module Organization

### Project Structure (Actual)

```text
guru-chat-bot/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication route group
│   │   ├── api/auth/        # NextAuth.js endpoints
│   │   ├── login/           # Login page
│   │   └── register/        # Registration page
│   ├── (chat)/              # Chat route group
│   │   ├── api/            # API endpoints (chat, stream, artifact, etc.)
│   │   ├── chat/[id]/      # Individual chat pages
│   │   └── page.tsx        # Home/chat list
│   ├── layout.tsx          # Root layout with providers
│   └── globals.css         # Global styles
├── components/              # React components
│   ├── chat.tsx            # Main chat interface (730+ lines - needs refactoring)
│   ├── message.tsx         # Message rendering (complex multi-modal)
│   ├── artifact.tsx        # Document management (900+ lines - very complex)
│   └── ui/                 # shadcn/ui components
├── lib/                     # Core business logic
│   ├── ai/                 # AI configuration and tools
│   │   ├── providers.ts    # xAI/Grok model setup
│   │   ├── tools.ts        # Tool definitions
│   │   └── reasoning-middleware.ts # Chain-of-thought
│   ├── db/                 # Database layer
│   │   ├── schema.ts       # Drizzle schemas (MIGRATION NEEDED)
│   │   ├── queries.ts      # Database operations
│   │   └── migrate.ts      # Migration runner
│   └── auth.ts             # Authentication config
├── artifacts/              # Dynamic content components
│   ├── text.tsx           # Text editor
│   ├── code.tsx           # Code editor
│   ├── image.tsx          # Image handling
│   └── sheet.tsx          # Spreadsheet
├── hooks/                  # Custom React hooks
├── tests/                  # Playwright tests (MANY FIXME)
├── public/                 # Static assets
├── .bmad-core/            # BMAD framework (extensive tooling)
│   ├── agents/            # Agent configurations
│   ├── tasks/             # Task templates
│   ├── templates/         # Document templates
│   └── checklists/        # Process checklists
└── migrations/            # Database migrations (8 applied)
```

### Key Modules and Their Purpose

- **Chat Service**: `app/(chat)/api/chat/route.ts` - Main chat endpoint with streaming, rate limiting, tool execution
- **Authentication**: `lib/auth.ts` + `middleware.ts` - NextAuth.js with guest support, JWT validation
- **AI Integration**: `lib/ai/providers.ts` - xAI Grok models via Vercel AI Gateway, test mode support
- **Database Operations**: `lib/db/queries.ts` - User, chat, message, document, vote operations
- **Stream Management**: `app/(chat)/api/chat/[id]/stream/route.ts` - Resumable streaming with Redis
- **Document System**: `components/artifact.tsx` + `lib/db/queries.ts` - Version control, real-time updates
- **Error Handling**: `lib/errors.ts` - Structured error system with ChatSDKError class

## Data Models and APIs

### Data Models

Instead of duplicating, reference actual model files:

- **User Model**: See `lib/db/schema.ts:10-23` - Regular and guest users
- **Chat Model**: See `lib/db/schema.ts:25-38` - Chat sessions with visibility
- **Message Models**:
  - DEPRECATED: `lib/db/schema.ts:39-52` (messageDeprecated)
  - CURRENT: `lib/db/schema.ts:88-103` (Message_v2 with parts)
- **Document Model**: See `lib/db/schema.ts:138-152` - Multi-type documents
- **Vote Models**:
  - DEPRECATED: `lib/db/schema.ts:54-64` (voteDeprecated)
  - CURRENT: `lib/db/schema.ts:120-130` (Vote_v2)
- **Stream Model**: See `lib/db/schema.ts:174-181` - Resumable stream contexts
- **Suggestion Model**: See `lib/db/schema.ts:154-172` - Collaborative suggestions

### API Specifications

#### Chat API
- **Endpoint**: `POST /api/chat`
- **Streaming**: Server-sent events with AI SDK data protocol
- **Rate Limiting**: 20/day (guest), 100/day (registered)
- **Tools**: Document creation, weather, suggestions
- **Max Duration**: 60 seconds timeout

#### Stream Resume API
- **Endpoint**: `GET /api/chat/[id]/stream`
- **Purpose**: Resume interrupted streams
- **Window**: 15 seconds for resumption
- **Fallback**: Returns stored messages if stream expired

#### Artifact API
- **Endpoint**: `POST /api/artifact`
- **Operations**: Create, update, delete documents
- **Types**: text, code, image, sheet
- **Versioning**: Automatic with timestamps

## Technical Debt and Known Issues

### Critical Technical Debt

1. **Schema Migration Required**: `lib/db/schema.ts:39-86`
   - messageDeprecated and voteDeprecated tables need removal
   - Migration guide: https://chat-sdk.dev/docs/migration-guides/message-parts
   - Data migration script needed for existing messages

2. **Oversized Components**:
   - `components/chat.tsx` (730+ lines) - Needs splitting into smaller components
   - `components/artifact.tsx` (900+ lines) - Complex modal system needs refactoring

3. **Test Coverage Issues**:
   - Multiple FIXME tests in Playwright suite
   - No unit tests configured
   - E2E tests only run on Chrome

4. **Beta Dependencies**:
   - NextAuth.js v5.0.0-beta.25 - Production risk
   - React 19.0.0-rc - Release candidate
   - Tailwind CSS 4.1.13 - Alpha version

5. **Custom Implementations**:
   - Custom UUID generator instead of standard library
   - Custom error system may be over-engineered

### Workarounds and Gotchas

- **Redis Optional**: Resumable streams silently disabled if REDIS_URL not set
- **Guest Authentication**: Auto-redirects to `/api/auth/guest` if no token - can cause confusion
- **Model Coupling**: Tightly coupled to xAI Grok models - no easy provider switching
- **Environment Detection**: Uses `process.env.TEST` for mocking - non-standard
- **Non-null Assertions**: Biome warnings disabled for `!` usage - potential runtime errors
- **Deep Equality**: Expensive memo checks in components - performance impact

### Incomplete Features

- **Paid Membership**: TODO in `lib/ai/entitlements.ts:27` - payment integration not implemented
- **Type Issues**: Type ignore in `lib/ai/tools/request-suggestions.ts:53`
- **Commented Code**: Large blocks of deprecated code in `lib/db/helpers/01-core-to-parts.ts`

## Integration Points and External Dependencies

### External Services

| Service         | Purpose              | Integration Type | Key Files                          | Notes                           |
| --------------- | -------------------- | ---------------- | ---------------------------------- | ------------------------------- |
| xAI/Grok        | LLM Provider         | REST API         | `lib/ai/providers.ts`              | Via Vercel AI Gateway           |
| Neon Postgres   | Database             | Connection String| `drizzle.config.ts`                | Serverless PostgreSQL           |
| Vercel Blob     | File Storage         | SDK              | Used in chat for attachments      | Token required                  |
| Redis           | Cache/Streams        | Connection String| `app/(chat)/api/chat/route.ts`    | Optional but recommended        |
| Vercel Functions| Geolocation          | Built-in         | `app/(chat)/api/chat/route.ts:174`| Automatic on Vercel             |

### Internal Integration Points

- **Frontend Communication**: REST API + Server-sent events for streaming
- **Authentication Flow**: NextAuth.js with middleware protection
- **Real-time Updates**: SWR for data synchronization
- **Theme System**: next-themes with cookie persistence
- **Error Reporting**: Custom ChatSDKError with user-friendly messages

## Development and Deployment

### Local Development Setup

1. **Prerequisites**:
   ```bash
   Node.js 20.x
   pnpm 9.12.3
   PostgreSQL database (or Neon account)
   ```

2. **Environment Variables** (`.env.local`):
   ```bash
   AUTH_SECRET=<generate-with-openssl>
   POSTGRES_URL=<neon-connection-string>
   BLOB_READ_WRITE_TOKEN=<vercel-blob-token>
   AI_GATEWAY_API_KEY=<only-for-local-dev>
   REDIS_URL=<optional-for-resumable-streams>
   ```

3. **Installation**:
   ```bash
   pnpm install
   pnpm db:migrate  # Run database migrations
   pnpm dev --turbo # Start development server
   ```

4. **Known Setup Issues**:
   - Database migrations must run before first start
   - AUTH_SECRET must be 32+ characters
   - Redis connection failures are silent

### Build and Deployment Process

- **Build Command**: `tsx lib/db/migrate && next build`
- **Deployment**: One-click Vercel deployment
- **Environments**: Local, Preview (branch deploys), Production
- **Auto-migrations**: Build process runs migrations automatically

## Testing Reality

### Current Test Coverage

- **Unit Tests**: 0% coverage (not configured)
- **Integration Tests**: Basic route testing in `tests/routes/`
- **E2E Tests**: Playwright tests with multiple FIXME markers
- **Manual Testing**: Primary QA method

### Running Tests

```bash
# E2E Tests (Playwright)
export PLAYWRIGHT=True && pnpm exec playwright test

# No unit test command configured
# No integration test command configured
```

### Test Issues

- Firefox and Safari testing disabled
- Mobile testing not configured
- 240-second timeout may be too long
- Test database setup not documented

## Performance Considerations

### Optimizations

- **Streaming**: Efficient real-time responses with AI SDK
- **Memoization**: Heavy use of React.memo and useMemo
- **Debouncing**: Auto-save in artifact system
- **Pagination**: Database queries with proper limits
- **PPR**: Experimental Partial Prerendering enabled

### Bottlenecks

- **Large Components**: chat.tsx and artifact.tsx need code splitting
- **Deep Equality**: Expensive checks in memoized components
- **Bundle Size**: Large dependency footprint
- **Database Queries**: No query caching strategy
- **Rate Limiting**: Simple in-memory counter - not distributed

## Security Considerations

### Current Implementation

- **Authentication**: NextAuth.js with bcrypt password hashing
- **Authorization**: User-based chat access control
- **Rate Limiting**: Per-user message limits
- **Input Validation**: Basic validation in API routes
- **CORS**: Default Next.js configuration

### Security Gaps

- **No CSP Headers**: Content Security Policy not configured
- **Error Details**: Verbose error messages to client
- **Guest Access**: Unlimited guest account creation
- **File Uploads**: Limited validation on blob storage
- **SQL Injection**: Protected by Drizzle ORM but no additional validation

## Appendix - Useful Commands and Scripts

### Frequently Used Commands

```bash
pnpm dev --turbo        # Start development server with Turbo
pnpm build              # Production build with migrations
pnpm db:migrate         # Run database migrations
pnpm db:studio          # Drizzle Studio for database management
pnpm db:generate        # Generate migration files
pnpm lint               # Run Biome linter
pnpm format             # Format code with Biome
pnpm test               # Run Playwright tests
```

### Debugging and Troubleshooting

- **Logs**: Check browser console and terminal output
- **Debug Mode**: Set `DEBUG=*` for verbose logging
- **Database Issues**: Use `pnpm db:studio` to inspect data
- **Stream Issues**: Check Redis connection and `REDIS_URL`
- **Auth Issues**: Verify `AUTH_SECRET` is set correctly
- **Common Errors**:
  - "Rate limit exceeded" - Check message counts in database
  - "Stream timeout" - 60-second limit on chat responses
  - "Authorization failed" - Check JWT token and user session

### Migration Commands

```bash
# Generate new migration
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Push schema changes (development)
pnpm db:push

# Pull schema from database
pnpm db:pull
```

## Next Steps for Enhancement

Based on this analysis, priority areas for improvement:

1. **Complete Schema Migration**: Migrate from deprecated Message/Vote tables
2. **Refactor Large Components**: Split chat.tsx and artifact.tsx
3. **Improve Test Coverage**: Add unit tests, fix FIXME tests
4. **Upgrade Dependencies**: Move from beta/RC versions to stable
5. **Add Monitoring**: Implement observability and error tracking
6. **Enhance Security**: Add CSP headers, improve validation
7. **Optimize Performance**: Implement query caching, code splitting
8. **Documentation**: Add inline code documentation, API docs

This document represents the true state of the guru-chat-bot system as of 2025-09-13, including all technical debt, workarounds, and architectural realities that future developers and AI agents need to understand.