# Source Tree and Module Organization

## Project Structure (Actual)

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

## Key Modules and Their Purpose

- **Chat Service**: `app/(chat)/api/chat/route.ts` - Main chat endpoint with streaming, rate limiting, tool execution
- **Authentication**: `lib/auth.ts` + `middleware.ts` - NextAuth.js with guest support, JWT validation
- **AI Integration**: `lib/ai/providers.ts` - xAI Grok models via Vercel AI Gateway, test mode support
- **Database Operations**: `lib/db/queries.ts` - User, chat, message, document, vote operations
- **Stream Management**: `app/(chat)/api/chat/[id]/stream/route.ts` - Resumable streaming with Redis
- **Document System**: `components/artifact.tsx` + `lib/db/queries.ts` - Version control, real-time updates
- **Error Handling**: `lib/errors.ts` - Structured error system with ChatSDKError class
