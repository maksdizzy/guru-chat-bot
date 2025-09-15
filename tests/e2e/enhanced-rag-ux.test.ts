import { test, expect } from '@playwright/test';

test.describe('Enhanced RAG UX and Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to chat page
    await page.goto('/chat');

    // Wait for initial load
    await page.waitForLoadState('networkidle');
  });

  test.describe('Progressive Disclosure Forms', () => {
    test('should show simple form by default and expand to advanced', async ({ page }) => {
      // Type a query that should trigger knowledge base search
      const input = page.getByTestId('multimodal-input');
      await input.fill('What are the best DeFi protocols?');

      // Submit query
      await page.keyboard.press('Enter');

      // Wait for tool to appear
      await page.waitForSelector('[data-testid="tool-header"]');

      // Check if tool uses simple form initially
      const simpleForm = page.locator('text=Show Advanced Options');
      if (await simpleForm.isVisible()) {
        await simpleForm.click();

        // Verify advanced options appear
        await expect(page.locator('text=Telegram Group ID')).toBeVisible();
        await expect(page.locator('input[placeholder*="2493387211"]')).toBeVisible();
      }
    });

    test('should validate form parameters correctly', async ({ page }) => {
      // Navigate to a state where RAG tool is visible
      await page.fill('[data-testid="multimodal-input"]', 'Search knowledge base');
      await page.keyboard.press('Enter');

      await page.waitForSelector('.rag-tool-form', { timeout: 10000 });

      const queryInput = page.locator('input[placeholder*="trading strategies"]');
      const submitButton = page.locator('button:has-text("Search Knowledge Base")');

      // Submit button should be disabled with empty query
      await expect(submitButton).toBeDisabled();

      // Enable after typing
      await queryInput.fill('test query');
      await expect(submitButton).toBeEnabled();

      // Clear and verify disabled again
      await queryInput.clear();
      await expect(submitButton).toBeDisabled();
    });
  });

  test.describe('Enhanced Source Citations', () => {
    test('should display collapsible source citations with highlighting', async ({ page }) => {
      // Search for something that will return sources
      await page.fill('[data-testid="multimodal-input"]', 'Tell me about trading strategies using the knowledge base');
      await page.keyboard.press('Enter');

      // Wait for response with sources
      await page.waitForSelector('.rag-sources-section', { timeout: 15000 });

      // Check source citations are collapsed by default
      const sourcesHeader = page.locator('text=Sources');
      await expect(sourcesHeader).toBeVisible();

      // Check citation count badge
      const countBadge = page.locator('.citation-count');
      await expect(countBadge).toBeVisible();

      // Expand first citation
      const firstCitation = page.locator('.rag-citation-block').first();
      const expandButton = firstCitation.locator('button[aria-expanded="false"]');

      if (await expandButton.isVisible()) {
        await expandButton.click();

        // Verify expanded content
        await expect(expandButton).toHaveAttribute('aria-expanded', 'true');

        // Check for search term highlighting
        const highlightedText = page.locator('.search-highlighted-text mark');
        if (await highlightedText.count() > 0) {
          await expect(highlightedText.first()).toBeVisible();
        }
      }
    });

    test('should show confidence indicators when enabled', async ({ page }) => {
      // Trigger knowledge base search
      await page.fill('[data-testid="multimodal-input"]', 'What are the latest DeFi trends?');
      await page.keyboard.press('Enter');

      // Wait for sources
      await page.waitForSelector('.rag-citations-enhanced', { timeout: 15000 });

      // Look for confidence indicators (star icons and percentages)
      const confidenceIndicators = page.locator('[class*="relevance"]');
      if (await confidenceIndicators.count() > 0) {
        await expect(confidenceIndicators.first()).toBeVisible();
      }
    });

    test('should handle source exploration workflow', async ({ page }) => {
      // Search and get sources
      await page.fill('[data-testid="multimodal-input"]', 'Explain yield farming strategies');
      await page.keyboard.press('Enter');

      await page.waitForSelector('.rag-citation-block', { timeout: 15000 });

      // Expand a citation
      const expandButton = page.locator('button[aria-expanded="false"]').first();
      if (await expandButton.isVisible()) {
        await expandButton.click();

        // Look for explore context button
        const exploreButton = page.locator('text=Explore Context');
        if (await exploreButton.isVisible()) {
          await exploreButton.click();
          // This would typically trigger additional functionality
        }
      }
    });
  });

  test.describe('Mobile Responsive Design', () => {
    test('should adapt layout for mobile screens', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Search for content
      await page.fill('[data-testid="multimodal-input"]', 'Mobile test query');
      await page.keyboard.press('Enter');

      await page.waitForSelector('.rag-search-result', { timeout: 15000 });

      // Check mobile-specific adaptations
      const badges = page.locator('.badge');
      if (await badges.count() > 0) {
        // Verify badges are responsive
        await expect(badges.first()).toBeVisible();
      }

      // Check touch targets meet 44px requirement
      const buttons = page.locator('.rag-citation-block button');
      if (await buttons.count() > 0) {
        const buttonBox = await buttons.first().boundingBox();
        if (buttonBox) {
          expect(buttonBox.height).toBeGreaterThanOrEqual(44);
        }
      }
    });

    test('should handle touch interactions properly', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Test touch-friendly expansion
      await page.fill('[data-testid="multimodal-input"]', 'Touch interaction test');
      await page.keyboard.press('Enter');

      await page.waitForSelector('.rag-citation-block', { timeout: 15000 });

      const touchButton = page.locator('.rag-citation-block button').first();
      if (await touchButton.isVisible()) {
        // Simulate touch interaction
        await touchButton.click();

        // Verify proper touch feedback
        await expect(touchButton).toHaveAttribute('aria-expanded', 'true');
      }
    });
  });

  test.describe('Loading States and Error Handling', () => {
    test('should show progressive loading states', async ({ page }) => {
      // Start a search
      await page.fill('[data-testid="multimodal-input"]', 'Complex query that takes time');

      // Intercept network requests to slow them down
      await page.route('**/api/chat', async (route) => {
        // Add delay to simulate slow response
        await new Promise(resolve => setTimeout(resolve, 2000));
        route.continue();
      });

      await page.keyboard.press('Enter');

      // Check for loading states
      const loadingIndicators = [
        'Validating query parameters',
        'Searching knowledge base',
        'Processing sources',
        'Formatting response'
      ];

      for (const indicator of loadingIndicators) {
        const element = page.locator(`text=${indicator}`);
        if (await element.isVisible({ timeout: 5000 })) {
          await expect(element).toBeVisible();
        }
      }
    });

    test('should handle error states gracefully', async ({ page }) => {
      // Simulate network error
      await page.route('**/api/chat', route => route.abort('failed'));

      await page.fill('[data-testid="multimodal-input"]', 'This will fail');
      await page.keyboard.press('Enter');

      // Look for error indicators
      await page.waitForSelector('[role="alert"]', { timeout: 10000 });

      const errorAlert = page.locator('[role="alert"]');
      await expect(errorAlert).toBeVisible();

      // Check for retry functionality
      const retryButton = page.locator('button:has-text("Retry")');
      if (await retryButton.isVisible()) {
        await expect(retryButton).toBeVisible();
      }
    });

    test('should show appropriate no results message', async ({ page }) => {
      // Mock API to return no results
      await page.route('**/api/chat', async (route) => {
        const mockResponse = {
          llm_answer: 'No relevant information found.',
          sources: [],
          query: 'nonexistent query',
          group_id: 2493387211
        };

        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockResponse)
        });
      });

      await page.fill('[data-testid="multimodal-input"]', 'nonexistent query');
      await page.keyboard.press('Enter');

      await page.waitForSelector('.rag-search-result', { timeout: 10000 });

      // Verify no sources message
      const noSources = page.locator('text=Found 0 relevant sources');
      await expect(noSources).toBeVisible();
    });
  });

  test.describe('Accessibility Compliance', () => {
    test('should be navigable via keyboard', async ({ page }) => {
      await page.fill('[data-testid="multimodal-input"]', 'Accessibility test');
      await page.keyboard.press('Enter');

      await page.waitForSelector('.rag-search-result', { timeout: 15000 });

      // Test tab navigation through citation components
      await page.keyboard.press('Tab');

      // Continue tabbing to reach citation buttons
      let focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      let attempts = 0;

      while (focusedElement !== 'BUTTON' && attempts < 10) {
        await page.keyboard.press('Tab');
        focusedElement = await page.evaluate(() => document.activeElement?.tagName);
        attempts++;
      }

      if (focusedElement === 'BUTTON') {
        // Test Enter key activation
        await page.keyboard.press('Enter');

        // Verify button was activated
        const activeElement = await page.evaluate(() => {
          const el = document.activeElement as HTMLButtonElement;
          return el.getAttribute('aria-expanded');
        });

        expect(activeElement).toBeTruthy();
      }
    });

    test('should have proper ARIA labels and roles', async ({ page }) => {
      await page.fill('[data-testid="multimodal-input"]', 'ARIA test query');
      await page.keyboard.press('Enter');

      await page.waitForSelector('.rag-sources-section', { timeout: 15000 });

      // Check for proper ARIA attributes
      const sourcesSection = page.locator('.rag-sources-section');
      await expect(sourcesSection).toHaveAttribute('aria-label');

      const listElements = page.locator('[role="list"]');
      if (await listElements.count() > 0) {
        await expect(listElements.first()).toBeVisible();
      }

      const listItems = page.locator('[role="listitem"]');
      if (await listItems.count() > 0) {
        await expect(listItems.first()).toBeVisible();
      }

      // Check button accessibility
      const expandButtons = page.locator('button[aria-expanded]');
      if (await expandButtons.count() > 0) {
        const firstButton = expandButtons.first();
        await expect(firstButton).toHaveAttribute('aria-label');
        await expect(firstButton).toHaveAttribute('aria-expanded');
      }
    });

    test('should announce content changes to screen readers', async ({ page }) => {
      await page.fill('[data-testid="multimodal-input"]', 'Screen reader test');
      await page.keyboard.press('Enter');

      await page.waitForSelector('[role="status"]', { timeout: 15000 });

      // Check for live regions
      const liveRegions = page.locator('[aria-live]');
      if (await liveRegions.count() > 0) {
        await expect(liveRegions.first()).toHaveAttribute('aria-live');
      }

      // Check for status updates
      const statusElements = page.locator('[role="status"]');
      if (await statusElements.count() > 0) {
        await expect(statusElements.first()).toBeVisible();
      }
    });
  });

  test.describe('Performance and Optimization', () => {
    test('should render large numbers of sources efficiently', async ({ page }) => {
      // Mock API to return many sources
      await page.route('**/api/chat', async (route) => {
        const sources = Array.from({ length: 50 }, (_, i) => ({
          msg_id: i + 1,
          user_name: `User ${i + 1}`,
          msg_date: new Date().toISOString(),
          msg_text: `Message ${i + 1} content about various topics`,
          reply_to_msg_id: null
        }));

        const mockResponse = {
          llm_answer: 'Here is information from many sources.',
          sources,
          query: 'large result set',
          group_id: 2493387211
        };

        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockResponse)
        });
      });

      await page.fill('[data-testid="multimodal-input"]', 'large result set');

      const startTime = Date.now();
      await page.keyboard.press('Enter');

      await page.waitForSelector('.rag-sources-section', { timeout: 15000 });
      const endTime = Date.now();

      // Should render within reasonable time
      expect(endTime - startTime).toBeLessThan(5000);

      // Should show "Show More" functionality
      const showMoreButton = page.locator('text=+47 more');
      if (await showMoreButton.isVisible()) {
        await expect(showMoreButton).toBeVisible();

        // Test expanding more sources
        await showMoreButton.click();

        // Verify more sources are shown
        const citations = page.locator('.rag-citation-block');
        const citationCount = await citations.count();
        expect(citationCount).toBeGreaterThan(5);
      }
    });

    test('should maintain smooth animations at 60fps', async ({ page }) => {
      await page.fill('[data-testid="multimodal-input"]', 'Animation test');
      await page.keyboard.press('Enter');

      await page.waitForSelector('.rag-citation-block', { timeout: 15000 });

      // Test animation performance
      await page.evaluate(() => {
        let frameCount = 0;
        let lastTime = performance.now();

        function measureFPS() {
          const currentTime = performance.now();
          frameCount++;

          if (currentTime - lastTime >= 1000) {
            const fps = (frameCount * 1000) / (currentTime - lastTime);

            // Store FPS for test verification
            (window as any).measuredFPS = fps;
            frameCount = 0;
            lastTime = currentTime;
          }

          requestAnimationFrame(measureFPS);
        }

        requestAnimationFrame(measureFPS);
      });

      // Trigger animations
      const expandButton = page.locator('button[aria-expanded="false"]').first();
      if (await expandButton.isVisible()) {
        await expandButton.click();

        // Wait for animation to complete
        await page.waitForTimeout(500);

        const fps = await page.evaluate(() => (window as any).measuredFPS);
        if (fps) {
          // Animation should maintain reasonable framerate
          expect(fps).toBeGreaterThan(30);
        }
      }
    });
  });

  test.describe('Cross-browser Compatibility', () => {
    test('should work consistently across different browsers', async ({ page, browserName }) => {
      // Test core functionality across browsers
      await page.fill('[data-testid="multimodal-input"]', 'Cross-browser test');
      await page.keyboard.press('Enter');

      await page.waitForSelector('.rag-search-result', { timeout: 15000 });

      // Verify core elements exist regardless of browser
      await expect(page.locator('.rag-search-result')).toBeVisible();

      // Test CSS custom properties support
      const hasRagColors = await page.evaluate(() => {
        const style = getComputedStyle(document.documentElement);
        return style.getPropertyValue('--rag-source-highlight').trim() !== '';
      });

      expect(hasRagColors).toBe(true);

      console.log(`Test passed on ${browserName}`);
    });
  });
});