import { test, expect } from '@playwright/test';

test.describe('ToolSelector Component', () => {
  test('renders tool selector with default "All Tools" selection', async ({ page }) => {
    // Navigate to a chat page to test the component
    await page.goto('/');

    // Wait for the tool selector to be visible (should be in chat header)
    const toolSelector = page.getByTestId('tool-selector');
    await expect(toolSelector).toBeVisible();
    await expect(toolSelector).toContainText('All Tools');
  });

  test('opens dropdown when clicked and shows both options', async ({ page }) => {
    await page.goto('/');

    const toolSelector = page.getByTestId('tool-selector');
    await toolSelector.click();

    // Check both options are visible
    await expect(page.getByTestId('tool-selector-item-all-tools')).toBeVisible();
    await expect(page.getByTestId('tool-selector-item-no-knowledge-base')).toBeVisible();
  });

  test('shows correct descriptions for options', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('tool-selector').click();

    await expect(page.getByText('Use all available tools including knowledge base')).toBeVisible();
    await expect(page.getByText('Use only internal AI knowledge')).toBeVisible();
  });

  test('updates selection when option is clicked', async ({ page }) => {
    await page.goto('/');

    const toolSelector = page.getByTestId('tool-selector');
    await toolSelector.click();

    // Click on "No Knowledge Base" option
    await page.getByTestId('tool-selector-item-no-knowledge-base').click();

    // Verify the button text changed
    await expect(toolSelector).toContainText('No Knowledge Base');
  });

  test('persists selection across dropdown toggles', async ({ page }) => {
    await page.goto('/');

    const toolSelector = page.getByTestId('tool-selector');

    // Change to "No Knowledge Base"
    await toolSelector.click();
    await page.getByTestId('tool-selector-item-no-knowledge-base').click();

    // Open dropdown again and verify selection is maintained
    await toolSelector.click();
    const selectedOption = page.getByTestId('tool-selector-item-no-knowledge-base');
    await expect(selectedOption).toHaveAttribute('data-active', 'true');
  });
});
