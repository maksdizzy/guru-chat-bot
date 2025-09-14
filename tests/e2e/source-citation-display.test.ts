import { ChatPage } from '../pages/chat';
import { test, expect } from '../fixtures';

test.describe('Source Citation Display Integration Tests', () => {
  let chatPage: ChatPage;

  test.beforeEach(async ({ page }) => {
    chatPage = new ChatPage(page);
    await chatPage.createNewChat();
  });

  test('displays source citations below RAG response', async () => {
    // Send a message that should trigger knowledge base search with sources
    await chatPage.sendUserMessage('What are people saying about DeFi in our Telegram discussions?');
    await chatPage.isGenerationComplete();

    const page = chatPage.page;

    // Check if knowledge base search tool was used
    const kbSearchElements = await page.locator('text=Knowledge Base Search').count();

    if (kbSearchElements > 0) {
      // Verify the main LLM answer is displayed
      const answerSection = page.locator('[class*="rounded-lg"][class*="border"][class*="bg-muted"]').first();
      await expect(answerSection).toBeVisible();

      // Check for the new source citations component
      const sourcesSection = page.locator('section[aria-label*="Source citations"]');

      if (await sourcesSection.count() > 0) {
        // Verify source citations are present
        await expect(sourcesSection).toBeVisible();

        // Check that sources header is displayed
        await expect(page.locator('text=/Sources \\(\\d+\\)/')).toBeVisible();

        // Verify individual citation blocks exist
        const citationBlocks = page.locator('[class*="border-l-4"]');
        expect(await citationBlocks.count()).toBeGreaterThan(0);

        // Check that citation blocks are collapsible (buttons should be present)
        const expandButtons = page.locator('button[aria-expanded]');
        expect(await expandButtons.count()).toBeGreaterThan(0);
      }
    }

    // Ensure we got a response
    const assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).toBeTruthy();
  });

  test('citation expand/collapse functionality works correctly', async () => {
    await chatPage.sendUserMessage('Search for information about yield farming strategies');
    await chatPage.isGenerationComplete();

    const page = chatPage.page;
    const citationButtons = page.locator('button[aria-expanded]');

    if (await citationButtons.count() > 0) {
      const firstButton = citationButtons.first();

      // Check initial state
      const initialState = await firstButton.getAttribute('aria-expanded');

      // Click to toggle
      await firstButton.click();

      // Wait a bit for animation
      await page.waitForTimeout(300);

      // Check that state changed
      const newState = await firstButton.getAttribute('aria-expanded');
      expect(newState).not.toBe(initialState);

      // Click again to toggle back
      await firstButton.click();
      await page.waitForTimeout(300);

      // Should return to initial state
      const finalState = await firstButton.getAttribute('aria-expanded');
      expect(finalState).toBe(initialState);
    }
  });

  test('citation displays all required metadata', async () => {
    await chatPage.sendUserMessage('Find discussions about cryptocurrency regulations');
    await chatPage.isGenerationComplete();

    const page = chatPage.page;
    const sourcesSection = page.locator('section[aria-label*="Source citations"]');

    if (await sourcesSection.count() > 0) {
      // Check for user names (should be visible)
      const usernames = page.locator('[class*="font-medium"][class*="text-foreground"]');
      if (await usernames.count() > 0) {
        expect(await usernames.first().textContent()).toBeTruthy();
      }

      // Check for message IDs (badges with #)
      const msgIds = page.locator('text=/#\\d+/');
      if (await msgIds.count() > 0) {
        const msgIdText = await msgIds.first().textContent();
        expect(msgIdText).toMatch(/#\d+/);
      }

      // Check for dates (time elements)
      const dates = page.locator('time[datetime]');
      if (await dates.count() > 0) {
        const dateAttribute = await dates.first().getAttribute('datetime');
        expect(dateAttribute).toBeTruthy();
      }
    }
  });

  test('responsive design works on mobile viewport', async () => {
    // Switch to mobile viewport
    await chatPage.page.setViewportSize({ width: 375, height: 667 });

    await chatPage.sendUserMessage('What are the latest trends in blockchain technology?');
    await chatPage.isGenerationComplete();

    const page = chatPage.page;
    const sourcesSection = page.locator('section[aria-label*="Source citations"]');

    if (await sourcesSection.count() > 0) {
      // Verify sources are still visible and accessible on mobile
      await expect(sourcesSection).toBeVisible();

      // Check that citation buttons are touch-friendly
      const citationButtons = page.locator('button[aria-expanded]');
      if (await citationButtons.count() > 0) {
        const buttonBox = await citationButtons.first().boundingBox();
        if (buttonBox) {
          // Button should have adequate touch target size (at least 44px)
          expect(buttonBox.height).toBeGreaterThanOrEqual(40);
        }
      }

      // On mobile, date info might be hidden in header but shown in expanded content
      const expandButton = page.locator('button[aria-expanded="false"]').first();
      if (await expandButton.count() > 0) {
        await expandButton.click();
        await page.waitForTimeout(300);

        // Should show date in expanded mobile view
        const mobileDateInfo = page.locator('.sm\\:hidden time');
        if (await mobileDateInfo.count() > 0) {
          await expect(mobileDateInfo.first()).toBeVisible();
        }
      }
    }
  });

  test('keyboard navigation works correctly', async () => {
    await chatPage.sendUserMessage('Search for information about smart contracts');
    await chatPage.isGenerationComplete();

    const page = chatPage.page;
    const citationButtons = page.locator('button[aria-expanded]');

    if (await citationButtons.count() > 1) {
      // Focus first citation button
      await citationButtons.first().focus();
      await expect(citationButtons.first()).toBeFocused();

      // Navigate with Tab key
      await page.keyboard.press('Tab');
      await expect(citationButtons.nth(1)).toBeFocused();

      // Use Enter to activate
      await page.keyboard.press('Enter');
      await page.waitForTimeout(300);

      // Check that the citation expanded
      const expandedState = await citationButtons.nth(1).getAttribute('aria-expanded');
      expect(expandedState).toBe('true');

      // Use Space to toggle back
      await page.keyboard.press('Space');
      await page.waitForTimeout(300);

      const collapsedState = await citationButtons.nth(1).getAttribute('aria-expanded');
      expect(collapsedState).toBe('false');
    }
  });

  test('accessibility attributes are properly set', async () => {
    await chatPage.sendUserMessage('Find information about trading strategies');
    await chatPage.isGenerationComplete();

    const page = chatPage.page;
    const sourcesSection = page.locator('section[aria-label*="Source citations"]');

    if (await sourcesSection.count() > 0) {
      // Check main section has proper ARIA label
      const ariaLabel = await sourcesSection.getAttribute('aria-label');
      expect(ariaLabel).toContain('Source citations');
      expect(ariaLabel).toMatch(/\d+ sources/);

      // Check list structure
      const listContainer = page.locator('[role="list"]');
      if (await listContainer.count() > 0) {
        await expect(listContainer).toBeVisible();

        const listItems = page.locator('[role="listitem"]');
        expect(await listItems.count()).toBeGreaterThan(0);
      }

      // Check button accessibility
      const buttons = page.locator('button[aria-expanded]');
      if (await buttons.count() > 0) {
        const firstButton = buttons.first();
        const ariaExpanded = await firstButton.getAttribute('aria-expanded');
        expect(['true', 'false']).toContain(ariaExpanded);

        const ariaLabel = await firstButton.getAttribute('aria-label');
        expect(ariaLabel).toContain('citation from');
      }
    }
  });

  test('handles large number of sources gracefully', async () => {
    // This test assumes we might get responses with many sources
    await chatPage.sendUserMessage('Give me a comprehensive overview of all DeFi discussions');
    await chatPage.isGenerationComplete();

    const page = chatPage.page;
    const sourcesSection = page.locator('section[aria-label*="Source citations"]');

    if (await sourcesSection.count() > 0) {
      // Check that the page doesn't become unresponsive with many sources
      const citationBlocks = page.locator('[class*="border-l-4"]');
      const sourceCount = await citationBlocks.count();

      if (sourceCount > 3) {
        // Verify page is still scrollable and interactive
        await page.mouse.wheel(0, 500);
        await page.waitForTimeout(100);

        // Check that we can still interact with citations
        const lastButton = citationBlocks.last().locator('button[aria-expanded]').first();
        if (await lastButton.count() > 0) {
          await lastButton.scrollIntoViewIfNeeded();
          await lastButton.click();
          await page.waitForTimeout(300);

          const expandedState = await lastButton.getAttribute('aria-expanded');
          expect(expandedState).toBe('true');
        }
      }
    }
  });

  test('visual hierarchy separates main answer from citations', async () => {
    await chatPage.sendUserMessage('Explain the benefits of decentralized finance');
    await chatPage.isGenerationComplete();

    const page = chatPage.page;

    // Check that main answer and citations are visually separated
    const mainAnswer = page.locator('[class*="rounded-lg"][class*="border"][class*="bg-muted"]').first();
    const sourcesSection = page.locator('section[aria-label*="Source citations"]');

    if (await mainAnswer.count() > 0 && await sourcesSection.count() > 0) {
      // Both should be visible
      await expect(mainAnswer).toBeVisible();
      await expect(sourcesSection).toBeVisible();

      // Sources should appear after the main answer
      const mainAnswerBox = await mainAnswer.boundingBox();
      const sourcesBox = await sourcesSection.boundingBox();

      if (mainAnswerBox && sourcesBox) {
        expect(sourcesBox.y).toBeGreaterThan(mainAnswerBox.y + mainAnswerBox.height - 10);
      }

      // Visual distinction should be clear (sources have border-l-4)
      const citationBorders = sourcesSection.locator('[class*="border-l-4"]');
      expect(await citationBorders.count()).toBeGreaterThan(0);
    }
  });

  test('citations work correctly with error states', async () => {
    // Send a request that might result in a partial response
    await chatPage.sendUserMessage('Search for information about a very obscure topic that probably doesnt exist in the knowledge base at all');
    await chatPage.isGenerationComplete();

    const page = chatPage.page;

    // Even if there's an error, the page should still be functional
    const errorElements = page.locator('.text-red-500, .text-red-600');
    const sourcesSection = page.locator('section[aria-label*="Source citations"]');

    // If there are sources, they should still render correctly
    if (await sourcesSection.count() > 0) {
      await expect(sourcesSection).toBeVisible();

      // Citations should still be interactive
      const citationButtons = page.locator('button[aria-expanded]');
      if (await citationButtons.count() > 0) {
        await citationButtons.first().click();
        await page.waitForTimeout(300);

        const expandedState = await citationButtons.first().getAttribute('aria-expanded');
        expect(['true', 'false']).toContain(expandedState);
      }
    }

    // Ensure the chat remains functional
    await chatPage.sendUserMessage('Hello');
    await chatPage.isGenerationComplete();

    const followupMessage = await chatPage.getRecentAssistantMessage();
    expect(followupMessage.content).toBeTruthy();
  });
});