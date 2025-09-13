# Testing Reality

## Current Test Coverage

- **Unit Tests**: 0% coverage (not configured)
- **Integration Tests**: Basic route testing in `tests/routes/`
- **E2E Tests**: Playwright tests with multiple FIXME markers
- **Manual Testing**: Primary QA method

## Running Tests

```bash
# E2E Tests (Playwright)
export PLAYWRIGHT=True && pnpm exec playwright test

# No unit test command configured
# No integration test command configured
```

## Test Issues

- Firefox and Safari testing disabled
- Mobile testing not configured
- 240-second timeout may be too long
- Test database setup not documented
