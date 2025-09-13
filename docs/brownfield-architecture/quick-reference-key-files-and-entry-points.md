# Quick Reference - Key Files and Entry Points

## Critical Files for Understanding the System

- **Main Entry**: `app/layout.tsx` - Root application layout with providers
- **Configuration**: `next.config.ts`, `.env.local` (environment variables)
- **Core Business Logic**: `lib/ai/`, `lib/db/`
- **API Definitions**: `app/(chat)/api/` - Chat, stream, and artifact endpoints
- **Database Models**: `lib/db/schema.ts` - Drizzle ORM schemas
- **Key Algorithms**: `lib/ai/reasoning-middleware.ts` - Chain-of-thought processing
- **Authentication**: `lib/auth.ts`, `app/(auth)/api/auth/[...nextauth]/route.ts`

## Most Complex/Critical Components

- **Chat Component**: `components/chat.tsx` - Main chat interface with streaming
- **Artifact System**: `components/artifact.tsx` - Complex document management UI
- **Message Handler**: `components/message.tsx` - Multi-modal message rendering
- **Stream Resume**: `app/(chat)/api/chat/[id]/stream/route.ts` - Resumable streaming
