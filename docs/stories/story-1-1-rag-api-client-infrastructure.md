# Story 1.1: RAG API Client Infrastructure

**Jira Key:** TKB-1
**Status:** To Do
**Priority:** Medium

## User Story

As a **developer**,
I want **a robust API client for the RAG endpoint**,
so that **the chatbot can reliably communicate with the external knowledge base**.

## Story Context

**Existing System Integration:**
- Integrates with: Existing API client patterns in `/lib/` directory
- Technology: TypeScript 5.6.3, Next.js 15.3.0-canary.31 App Router
- Follows pattern: Existing external API integration patterns (similar to Vercel AI SDK integration)
- Touch points: Environment configuration, error handling, and API response typing

**Enhancement Details:**
This story creates the foundational API client infrastructure for communicating with the external RAG knowledge base endpoint. The client will handle HTTP requests, response parsing, error handling, and timeout management while following existing codebase patterns.

## Acceptance Criteria

### Functional Requirements

1. **API Client Implementation**: Create TypeScript API client that handles requests to `https://flowapi-dexguru.dexguru.biz/api/rag_search_telegram_es_db`

2. **Parameter Support**: Client supports configurable `group_id` parameter (default: 2493387211) and `query` parameter for search terms

3. **Response Parsing**: Client correctly parses RAG endpoint responses containing `llm_answer` (string) and `sources` array with message metadata structure

4. **Error Handling**: Implement comprehensive error handling for network failures, timeout scenarios, and invalid responses

### Integration Requirements

5. **Environment Configuration**: RAG endpoint URL and default group_id are configurable via environment variables following existing patterns

6. **TypeScript Types**: Full TypeScript type definitions for request parameters and response structure

7. **Existing Pattern Compliance**: API client follows existing codebase patterns for external service integration

### Quality Requirements

8. **Unit Tests**: Comprehensive unit tests covering success cases, error scenarios, and edge cases

9. **Error Logging**: Integration with existing error logging and monitoring patterns

10. **Timeout Handling**: Configurable request timeouts to prevent blocking operations

## Technical Notes

**Integration Approach:**
- Create new `/lib/rag/` directory following existing library organization
- Implement as async TypeScript functions with proper error boundaries
- Use existing HTTP client patterns (likely using built-in fetch with error handling)

**Existing Pattern Reference:**
- Follow patterns from existing API integrations in the codebase
- Use similar error handling to Vercel AI SDK integration
- Match existing environment variable configuration patterns

**Key Constraints:**
- Must not interfere with existing API client functionality
- Response parsing must handle potential API format changes gracefully
- All external dependencies should be minimal and justify inclusion

## Type Definitions

```typescript
interface RAGRequest {
  group_id: number;
  query: string;
}

interface RAGSource {
  msg_id: number;
  reply_to_msg_id: number | null;
  user_name: string;
  msg_date: string;
  msg_text: string;
}

interface RAGResponse {
  llm_answer: string;
  sources: RAGSource[];
}
```

## Environment Variables

```env
RAG_ENDPOINT_URL=https://flowapi-dexguru.dexguru.biz
RAG_DEFAULT_GROUP_ID=2493387211
RAG_REQUEST_TIMEOUT=10000
```

## Definition of Done

- [ ] RAG API client implemented in `/lib/rag/client.ts`
- [ ] TypeScript types defined for all request/response structures
- [ ] Environment variables configured and documented
- [ ] Comprehensive unit tests with >90% coverage
- [ ] Error handling tested for all failure scenarios
- [ ] Integration with existing error logging patterns
- [ ] Code follows existing TypeScript and linting standards
- [ ] No regression in existing API functionality verified
- [ ] Documentation updated in relevant areas

## Risk Mitigation

**Primary Risk:** External API dependency introduces new failure points that could affect system reliability

**Mitigation:**
- Implement robust timeout and retry mechanisms
- Graceful degradation when RAG service is unavailable
- Comprehensive error handling with clear user feedback

**Rollback Plan:**
- API client is isolated in `/lib/rag/` directory for easy removal
- No existing functionality depends on RAG client
- Environment variables can be unset to disable functionality

## Integration Verification

- **IV1:** Existing chatbot functionality remains intact with new API client added
- **IV2:** API client integration doesn't affect current streaming performance
- **IV3:** Error handling doesn't interfere with existing error management systems

## Dependencies

- None - this story creates the foundational infrastructure
- Must complete before Stories 1.2, 1.3, and 1.4 can begin

## Estimated Effort

**Development:** 4-6 hours
**Testing:** 2-3 hours
**Total:** 6-9 hours