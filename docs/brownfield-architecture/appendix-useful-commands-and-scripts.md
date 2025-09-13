# Appendix - Useful Commands and Scripts

## Frequently Used Commands

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

## Debugging and Troubleshooting

- **Logs**: Check browser console and terminal output
- **Debug Mode**: Set `DEBUG=*` for verbose logging
- **Database Issues**: Use `pnpm db:studio` to inspect data
- **Stream Issues**: Check Redis connection and `REDIS_URL`
- **Auth Issues**: Verify `AUTH_SECRET` is set correctly
- **Common Errors**:
  - "Rate limit exceeded" - Check message counts in database
  - "Stream timeout" - 60-second limit on chat responses
  - "Authorization failed" - Check JWT token and user session

## Migration Commands

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
