# Guru Chat Bot Brownfield Enhancement PRD

## Intro Project Analysis and Context

### Existing Project Overview

**Analysis Source**: Document-project output available at `docs/brownfield-architecture/`

**Current Project State**: Modern Next.js 15 application with experimental Partial Prerendering (PPR), real-time AI streaming via Vercel AI SDK v5, PostgreSQL database with Drizzle ORM, and sophisticated document management system. Built for scale with Redis-backed resumable streams and multi-model AI support.

### Available Documentation Analysis

**Document-project analysis available** - using existing technical documentation:
- Tech Stack Documentation ✅
- Source Tree/Architecture ✅
- API Documentation ✅
- External API Documentation ✅
- Technical Debt Documentation ✅
- Performance Considerations ✅
- Security Considerations ✅

### Enhancement Scope Definition

**Enhancement Type**
- ✅ New Feature Addition
- Integration with New Systems

**Enhancement Description**: Integration of external RAG (Retrieval-Augmented Generation) knowledge base tool that allows users to search Telegram message history and receive contextual responses with full source attribution.

**Impact Assessment**
- ✅ Moderate Impact (some existing code changes)

### Goals and Background Context

**Goals**
- Enable users to access external knowledge base through chatbot interface
- Provide source-attributed responses from Telegram message history
- Maintain seamless integration with existing AI streaming architecture
- Deliver configurable search parameters for different knowledge base groups

**Background Context**

The existing guru-chat-bot provides sophisticated AI interactions with multi-model support and real-time streaming. Users need access to historical Telegram conversations and knowledge that exists outside the current AI model's training data. This enhancement adds a selectable tool that queries an external RAG endpoint, allowing users to search a Telegram knowledge base and receive both AI-generated answers and original source citations.

The external knowledge base is accessible via a FastAPI endpoint at `https://flowapi-dexguru.dexguru.biz/api/rag_search_telegram_es_db` and returns structured responses containing both LLM-generated answers and source message metadata including user names, dates, and original message content.

### Change Log

| Change | Date | Version | Description | Author |
|--------|------|---------|-------------|--------|
| Initial PRD | 2025-09-13 | 1.0 | External Knowledge Base Integration PRD | John (PM Agent) |

## Requirements

### Functional

**FR1:** The chatbot interface shall provide a selectable tool component that allows users to choose the "Knowledge Base Search" option from the available AI tools.

**FR2:** When the Knowledge Base Search tool is selected, the interface shall provide parameter selection controls including group_id configuration (default: 2493387211) and search query input.

**FR3:** The system shall integrate with the external RAG endpoint at `https://flowapi-dexguru.dexguru.biz/api/rag_search_telegram_es_db` to retrieve contextual information from the Telegram knowledge base. *(Verified: No authentication required, endpoint accessible with standard HTTP requests)*

**FR4:** The chatbot response shall display both the LLM-generated answer and source citations, showing message metadata including msg_id, user_name, msg_date, and msg_text for each source.

**FR5:** The tool integration shall maintain compatibility with the existing Vercel AI SDK v5 streaming architecture and multi-model AI support.

### Non Functional

**NFR1:** The RAG tool integration must maintain existing chatbot performance characteristics and not exceed current memory usage by more than 20%.

**NFR2:** External API calls to the knowledge base shall implement proper timeout handling and fallback mechanisms to prevent chatbot session blocking.

**NFR3:** The knowledge base tool shall integrate seamlessly with the existing UI component library (shadcn/ui) and maintain visual consistency.

**NFR4:** Source citation display shall be responsive and accessible, supporting mobile and desktop viewing patterns.

### Compatibility Requirements

**CR1:** API Integration Compatibility: Must integrate with existing `/api/chat` endpoint structure without breaking current streaming responses.

**CR2:** Database Schema Compatibility: RAG tool usage shall be trackable through existing conversation/message schema without requiring database migrations.

**CR3:** UI/UX Consistency: Knowledge base tool selection and results display must follow existing chatbot tool selection patterns and message formatting.

**CR4:** Authentication Compatibility: External API calls shall leverage existing authentication patterns and session management.

## Technical Constraints and Integration Requirements

### Existing Technology Stack

**Languages**: TypeScript 5.6.3
**Frameworks**: Next.js 15.3.0-canary.31 (App Router, experimental PPR enabled)
**Database**: PostgreSQL (Neon) via @vercel/postgres
**Infrastructure**: Vercel deployment, Redis for caching/sessions
**External Dependencies**: Vercel AI SDK 5.0.26, NextAuth.js 5.0.0-beta.25

### Integration Approach

**Database Integration Strategy**: Leverage existing conversation/message schema to track RAG tool usage without requiring migrations

**API Integration Strategy**: Extend existing `/api/chat` endpoint to support RAG tool calls while maintaining streaming architecture

**Frontend Integration Strategy**: Add RAG tool to existing tool selection UI using shadcn/ui components and maintaining design consistency

**Testing Integration Strategy**: Utilize existing Playwright E2E framework to test RAG integration flows

### Code Organization and Standards

**File Structure Approach**: Follow existing Next.js App Router patterns with RAG client in `/lib/rag/` and UI components in existing component structure

**Naming Conventions**: Maintain existing TypeScript strict mode and camelCase conventions

**Coding Standards**: Follow existing Biome linting rules and TypeScript strict mode requirements

**Documentation Standards**: Document RAG integration in existing `/docs/` structure

### Deployment and Operations

**Build Process Integration**: Leverage existing pnpm build pipeline without modifications

**Deployment Strategy**: Standard Vercel deployment with environment variables for RAG endpoint configuration

**Monitoring and Logging**: Integrate with existing error handling and logging patterns

**Configuration Management**: Use existing environment variable patterns for RAG endpoint URL and default group_id

### Risk Assessment and Mitigation

**Technical Risks**:
- External API dependency may introduce latency or availability issues
- RAG response format changes could break integration

**Integration Risks**:
- Streaming architecture modifications could affect existing tool performance
- UI component additions may conflict with existing responsive design

**Deployment Risks**:
- Environment variable configuration errors could break RAG functionality
- ~~External endpoint security requirements may require authentication updates~~ *(RESOLVED: No authentication required)*

**Mitigation Strategies**:
- Implement robust error handling and fallback mechanisms for external API
- Comprehensive E2E testing of streaming integration before deployment
- Gradual rollout with feature flags for RAG tool availability

### Technical Verification (Updated 2025-09-13)

**External API Authentication Status**: ✅ **VERIFIED**
- RAG endpoint requires no authentication
- Standard HTTP requests work without API keys or tokens
- Endpoint confirmed functional with test parameters
- Response format verified: `{llm_answer: string, sources: RAGSource[]}`

**Story Sequencing**: ✅ **CORRECTED**
- Story 1.3 dependencies updated to require complete Story 1.2 verification
- Pre-implementation verification checklist added to Story 1.2
- Development team sign-off required before Story 1.3 begins

## Epic and Story Structure

### Epic Approach

**Epic Structure Decision**: Single comprehensive epic with rationale: The RAG tool integration touches multiple interconnected layers (UI components, API integration, streaming responses, and data display) that must work together cohesively. The existing Vercel AI SDK v5 architecture supports incremental tool additions within a unified framework.

## Epic 1: External Knowledge Base Integration

**Epic Goal**: Enable users to search and retrieve contextual information from external Telegram knowledge base with full source attribution integrated into the existing AI chatbot experience.

**Integration Requirements**: Seamless integration with existing Vercel AI SDK v5 tool calling architecture, maintaining streaming performance and UI consistency.

### Story 1.1: RAG API Client Infrastructure
As a **developer**,
I want **a robust API client for the RAG endpoint**,
so that **the chatbot can reliably communicate with the external knowledge base**.

#### Acceptance Criteria
1. API client handles requests to `https://flowapi-dexguru.dexguru.biz/api/rag_search_telegram_es_db`
2. Client implements proper error handling and timeout mechanisms
3. Client supports configurable group_id parameter (default: 2493387211)
4. Response parsing correctly handles both llm_answer and sources array structure

#### Integration Verification
- **IV1:** Existing chatbot functionality remains intact with new API client added
- **IV2:** API client integration doesn't affect current streaming performance
- **IV3:** Error handling doesn't interfere with existing error management systems

### Story 1.2: Knowledge Base Tool Definition
As a **user**,
I want **a selectable Knowledge Base Search tool in the chatbot interface**,
so that **I can choose to search external knowledge when needed**.

#### Acceptance Criteria
1. Tool appears in existing tool selection UI with appropriate icon and description
2. Tool selection triggers parameter input form for group_id and search query
3. Tool integrates with existing Vercel AI SDK tool calling framework
4. Tool maintains visual consistency with other chatbot tools

#### Integration Verification
- **IV1:** Existing tool selection mechanisms continue to work without regression
- **IV2:** New tool doesn't interfere with other AI tools or model selection
- **IV3:** UI layout remains responsive across all existing supported devices

### Story 1.3: Streaming Response Integration
As a **user**,
I want **Knowledge Base Search results to stream naturally within chat responses**,
so that **the experience feels consistent with other AI interactions**.

#### Acceptance Criteria
1. RAG responses integrate with existing streaming message architecture
2. Both LLM answer and source citations render progressively during streaming
3. Response format matches existing message styling and typography
4. Sources display with proper formatting for msg_id, user_name, date, and text

#### Integration Verification
- **IV1:** Existing streaming performance for other tools remains unaffected
- **IV2:** Message history and persistence work correctly with RAG responses
- **IV3:** Chat session state management handles RAG responses without memory leaks

### Story 1.4: Source Citation Display Enhancement
As a **user**,
I want **clear, accessible source citations for Knowledge Base results**,
so that **I can verify and explore the original context of information**.

#### Acceptance Criteria
1. Sources render as expandable/collapsible citation blocks
2. Each source shows user_name, date, and message content with proper formatting
3. Citations are visually distinct from main response content
4. Mobile and desktop responsive display for source information

#### Integration Verification
- **IV1:** Citation display doesn't interfere with existing message rendering
- **IV2:** Source blocks maintain accessibility standards consistent with current UI
- **IV3:** Performance impact of rendering multiple sources remains within acceptable limits