# Data Models and APIs

## Data Models

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

## API Specifications

### Chat API
- **Endpoint**: `POST /api/chat`
- **Streaming**: Server-sent events with AI SDK data protocol
- **Rate Limiting**: 20/day (guest), 100/day (registered)
- **Tools**: Document creation, weather, suggestions
- **Max Duration**: 60 seconds timeout

### Stream Resume API
- **Endpoint**: `GET /api/chat/[id]/stream`
- **Purpose**: Resume interrupted streams
- **Window**: 15 seconds for resumption
- **Fallback**: Returns stored messages if stream expired

### Artifact API
- **Endpoint**: `POST /api/artifact`
- **Operations**: Create, update, delete documents
- **Types**: text, code, image, sheet
- **Versioning**: Automatic with timestamps
