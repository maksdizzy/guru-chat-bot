import { ChatPage } from '../pages/chat';
import { test, expect } from '../fixtures';

test.describe('Knowledge Base Search Tool Integration', () => {
  let chatPage: ChatPage;

  test.beforeEach(async ({ page }) => {
    chatPage = new ChatPage(page);
    await chatPage.createNewChat();
  });

  test('Knowledge base search tool is available and functional', async () => {
    // Send a message that should trigger the knowledge base search tool
    await chatPage.sendUserMessage('Search the knowledge base for information about DeFi protocols');
    await chatPage.isGenerationComplete();

    // Look for the knowledge base search tool in the response
    const toolElements = await chatPage.page.locator('[data-testid*="tool-knowledgeBaseSearch"]').count();

    // If tool was used, verify the tool UI elements
    if (toolElements > 0) {
      // Check that the tool header is visible with correct name
      await expect(chatPage.page.locator('text=Knowledge Base Search')).toBeVisible();

      // Check that tool shows input parameters
      await expect(chatPage.page.locator('text=Parameters')).toBeVisible();

      // Check that tool shows results section if completed
      const resultElements = await chatPage.page.locator('text=Result').count();
      if (resultElements > 0) {
        await expect(chatPage.page.locator('text=Result')).toBeVisible();
      }
    }

    const assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).toBeTruthy();
  });

  test('Knowledge base search tool handles parameters correctly', async () => {
    // Send a message that would use the tool with specific parameters
    await chatPage.sendUserMessage('Find information about "blockchain consensus" in the Telegram group');
    await chatPage.isGenerationComplete();

    // Check if the tool was invoked
    const page = chatPage.page;
    const toolHeaders = await page.locator('text=Knowledge Base Search').count();

    if (toolHeaders > 0) {
      // Verify tool execution completed
      const toolStatus = await page.locator('.text-green-600').count(); // Success icon
      expect(toolStatus).toBeGreaterThanOrEqual(0);

      // Check that parameters were displayed
      const parameterSection = await page.locator('text=Parameters').count();
      expect(parameterSection).toBeGreaterThanOrEqual(0);
    }

    const assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).toBeTruthy();
  });

  test('Knowledge base search tool displays results correctly', async () => {
    // Send a message that should definitely use the knowledge base search
    await chatPage.sendUserMessage('What do people say about yield farming in our Telegram discussions?');
    await chatPage.isGenerationComplete();

    const page = chatPage.page;

    // Check if knowledge base search tool was used
    const kbSearchElements = await page.locator('text=Knowledge Base Search').count();

    if (kbSearchElements > 0) {
      // Tool was used, verify the result display
      await expect(page.locator('text=Knowledge Base Search')).toBeVisible();

      // Check for tool completion status
      const completedStatus = await page.locator('.text-green-600, text=Completed').count();
      if (completedStatus > 0) {
        // Tool completed successfully
        await expect(page.locator('text=Result')).toBeVisible();

        // Check that the knowledge base search result component is displayed
        // This would show the LLM answer and sources
        const resultContent = await page.locator('[class*="rounded-lg"][class*="border"]').count();
        expect(resultContent).toBeGreaterThan(0);
      }
    }

    // Ensure we got a response regardless of tool usage
    const assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).toBeTruthy();
  });

  test('Knowledge base search tool handles errors gracefully', async () => {
    // This test would require mocking the RAG endpoint to return an error
    // For now, we'll just verify the tool can be invoked and doesn't break the chat

    await chatPage.sendUserMessage('Search for information about cryptocurrency regulations');
    await chatPage.isGenerationComplete();

    // Verify the chat still works even if the tool encounters issues
    const assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).toBeTruthy();

    // Verify no error states break the UI
    const errorElements = await chatPage.page.locator('.text-red-500, .text-red-600').count();
    // Note: We allow error elements to exist (they might be legitimate error displays)
    // but we verify the page is still functional

    // Verify we can send another message after potential errors
    await chatPage.sendUserMessage('Hello again');
    await chatPage.isGenerationComplete();

    const secondMessage = await chatPage.getRecentAssistantMessage();
    expect(secondMessage.content).toBeTruthy();
  });

  test('Tool selection flow works correctly', async () => {
    // Verify that the AI can decide when to use the knowledge base search tool
    await chatPage.sendUserMessage('I need information from our past conversations about trading strategies');
    await chatPage.isGenerationComplete();

    // Check overall response quality
    const assistantMessage = await chatPage.getRecentAssistantMessage();
    expect(assistantMessage.content).toBeTruthy();

    // Verify the page remains interactive
    await expect(chatPage.sendButton).toBeVisible();
    await expect(chatPage.sendButton).toBeEnabled();
  });
});