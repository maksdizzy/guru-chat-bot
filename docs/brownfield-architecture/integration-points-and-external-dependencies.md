# Integration Points and External Dependencies

## External Services

| Service         | Purpose              | Integration Type | Key Files                          | Notes                           |
| --------------- | -------------------- | ---------------- | ---------------------------------- | ------------------------------- |
| xAI/Grok        | LLM Provider         | REST API         | `lib/ai/providers.ts`              | Via Vercel AI Gateway           |
| Neon Postgres   | Database             | Connection String| `drizzle.config.ts`                | Serverless PostgreSQL           |
| Vercel Blob     | File Storage         | SDK              | Used in chat for attachments      | Token required                  |
| Redis           | Cache/Streams        | Connection String| `app/(chat)/api/chat/route.ts`    | Optional but recommended        |
| Vercel Functions| Geolocation          | Built-in         | `app/(chat)/api/chat/route.ts:174`| Automatic on Vercel             |

## Internal Integration Points

- **Frontend Communication**: REST API + Server-sent events for streaming
- **Authentication Flow**: NextAuth.js with middleware protection
- **Real-time Updates**: SWR for data synchronization
- **Theme System**: next-themes with cookie persistence
- **Error Reporting**: Custom ChatSDKError with user-friendly messages
