# Development and Deployment

## Local Development Setup

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

## Build and Deployment Process

- **Build Command**: `tsx lib/db/migrate && next build`
- **Deployment**: One-click Vercel deployment
- **Environments**: Local, Preview (branch deploys), Production
- **Auto-migrations**: Build process runs migrations automatically
