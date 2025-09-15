import { test, expect } from '@playwright/test';

test.describe('useToolSelection Hook Integration Tests', () => {
  test('tool selection state persists across page interactions', async ({ page }) => {
    await page.goto('/');

    // Start a new chat to ensure we have a fresh session
    await page.getByText('New Chat').click();

    // Change tool selection to "No Knowledge Base"
    const toolSelector = page.getByTestId('tool-selector');
    await toolSelector.click();
    await page.getByTestId('tool-selector-item-no-knowledge-base').click();

    // Send a message and verify the selection persists
    const messageInput = page.getByTestId('message-input');
    await messageInput.fill('Test message');
    await page.keyboard.press('Enter');

    // Wait for response and verify tool selection is still "No Knowledge Base"
    await expect(toolSelector).toContainText('No Knowledge Base');
  });

  test('tool selection is chat-specific', async ({ page, context }) => {
    await page.goto('/');

    // Create first chat and set to "No Knowledge Base"
    const toolSelector = page.getByTestId('tool-selector');
    await toolSelector.click();
    await page.getByTestId('tool-selector-item-no-knowledge-base').click();

    // Open new chat in same session
    await page.getByText('New Chat').click();

    // Verify new chat defaults to "All Tools"
    await expect(toolSelector).toContainText('All Tools');

    // Verify state is independent between chats by going back
    await page.goBack();
    await expect(toolSelector).toContainText('No Knowledge Base');
  });

  test('tool selection affects API calls correctly', async ({ page }) => {
    await page.goto('/');

    // Set up request interception to check API calls
    let capturedRequestBody: any = null;

    await page.route('**/api/chat', async (route) => {
      const request = route.request();
      if (request.method() === 'POST') {
        capturedRequestBody = JSON.parse(request.postData() || '{}');
      }
      await route.continue();
    });

    // Change to "No Knowledge Base" mode
    const toolSelector = page.getByTestId('tool-selector');
    await toolSelector.click();
    await page.getByTestId('tool-selector-item-no-knowledge-base').click();

    // Send a message to trigger API call
    const messageInput = page.getByTestId('message-input');
    await messageInput.fill('Test message');
    await page.keyboard.press('Enter');

    // Wait a moment for the API call
    await page.waitForTimeout(1000);

    // Verify the API request includes the correct tool selection
    expect(capturedRequestBody?.selectedToolOption).toBe('no-knowledge-base');
  });
});
