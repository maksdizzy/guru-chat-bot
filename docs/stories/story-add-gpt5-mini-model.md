# User Story: Add GPT-5 Mini Model Support - Brownfield Addition

## User Story
**As a** chatbot user,
**I want** to select GPT-5 Mini from the model dropdown,
**So that** I can use OpenAI's GPT-5 Mini model since the API key has been configured in Vercel AI SDK dashboard.

## Story Context

**Existing System Integration:**
- Integrates with: Model selection dropdown (`components/model-selector.tsx`)
- Technology: Next.js, TypeScript, Vercel AI SDK, AI SDK Gateway
- Follows pattern: Custom provider pattern with gateway models (`lib/ai/providers.ts`)
- Touch points:
  - `lib/ai/models.ts` - Model definitions
  - `lib/ai/providers.ts` - Model provider configuration
  - `app/(chat)/api/chat/route.ts:160` - Model consumption

## Acceptance Criteria

**Functional Requirements:**
1. GPT-5 Mini model appears in the model selector dropdown
2. Users can select and use GPT-5 Mini for chat conversations
3. Selected GPT-5 Mini model persists across sessions via cookie

**Integration Requirements:**
4. Existing xAI/Grok models continue to work unchanged
5. New model follows existing `ChatModel` interface pattern
6. Integration with gateway provider maintains current architecture

**Quality Requirements:**
7. Model description clearly indicates OpenAI GPT-5 Mini
8. No regression in existing model selection functionality
9. OpenAI API key from Vercel dashboard is properly utilized

## Technical Notes

- **Integration Approach:** Add GPT-5 Mini to `chatModels` array and configure gateway provider
- **Existing Pattern Reference:** Follow xAI/Grok model pattern in `providers.ts:28-31`
- **Key Constraints:** Must use Vercel AI SDK Gateway for consistency
- **Model ID:** Use `openai/gpt-5-mini` for gateway configuration

## Definition of Done

- [ ] GPT-5 Mini model added to model definitions
- [ ] Gateway provider configured for GPT-5 Mini
- [ ] Model selector displays new option
- [ ] Existing xAI models still function
- [ ] Chat API correctly routes to selected model
- [ ] Cookie persistence works for new model

## Risk and Compatibility Check

**Minimal Risk Assessment:**
- **Primary Risk:** GPT-5 Mini API availability/correct model ID
- **Mitigation:** Gateway will handle API key; fallback to existing models if unavailable
- **Rollback:** Remove GPT-5 Mini entry from models.ts and providers.ts

**Compatibility Verification:**
- ✓ No breaking changes to existing APIs
- ✓ Database changes: None required
- ✓ UI changes follow existing dropdown pattern
- ✓ Performance impact: Negligible (same API flow)

## Validation Checklist

**Scope Validation:**
- ✓ Story can be completed in one development session (~1-2 hours)
- ✓ Integration approach is straightforward (add to arrays, configure gateway)
- ✓ Follows existing patterns exactly (ChatModel interface, gateway provider)
- ✓ No design or architecture work required

**Clarity Check:**
- ✓ Story requirements are unambiguous
- ✓ Integration points clearly specified (2 files to modify)
- ✓ Success criteria are testable
- ✓ Rollback approach is simple (revert changes)

## Implementation Files

1. **lib/ai/models.ts** - Add GPT-5 Mini to chatModels array
2. **lib/ai/providers.ts** - Configure gateway provider for GPT-5 Mini

## Estimated Effort

- **Development:** 1-2 hours
- **Testing:** 30 minutes
- **Total:** ~2 hours