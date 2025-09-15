import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import '@testing-library/jest-dom';

// Import components to test
import type { RAGToolForm, } from '@/components/rag-tool-form';
import type { EnhancedSourceCitations } from '@/components/enhanced-source-citations';
import type { KnowledgeBaseSearchResult } from '@/components/knowledge-base-search-result';
import type {
  RAGSearchSkeleton,
  RAGStreamingLoading,
  RAGErrorState
} from '@/components/rag-loading-states';
import type {
  ScreenReaderOnly,
  AccessibleLoading,
  AccessibleButton,
  AccessibleFormField
} from '@/components/accessibility-utils';

// Extend jest matchers
expect.extend(toHaveNoViolations);

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    span: 'span',
    button: 'button'
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe('RAGToolForm Component', () => {
  const mockOnSubmit = vi.fn();
  const mockOnVariantChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders simple form variant correctly', () => {
    render(
      <RAGToolForm
        variant="simple"
        onVariantChange={mockOnVariantChange}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByRole('search')).toBeInTheDocument();
    expect(screen.getByLabelText(/search knowledge base/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ask about trading strategies/i)).toBeInTheDocument();
    expect(screen.getByText(/show advanced options/i)).toBeInTheDocument();
  });

  it('expands to advanced form when advanced options clicked', async () => {
    const user = userEvent.setup();
    render(
      <RAGToolForm
        variant="simple"
        onVariantChange={mockOnVariantChange}
        onSubmit={mockOnSubmit}
      />
    );

    const advancedButton = screen.getByText(/show advanced options/i);
    await user.click(advancedButton);

    expect(mockOnVariantChange).toHaveBeenCalledWith('advanced');
  });

  it('validates required query field', async () => {
    const user = userEvent.setup();
    render(
      <RAGToolForm
        variant="simple"
        onVariantChange={mockOnVariantChange}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: /search knowledge base/i });
    expect(submitButton).toBeDisabled();

    const queryInput = screen.getByLabelText(/search knowledge base/i);
    await user.type(queryInput, 'test query');

    expect(submitButton).toBeEnabled();
  });

  it('submits form with correct parameters', async () => {
    const user = userEvent.setup();
    render(
      <RAGToolForm
        variant="advanced"
        onVariantChange={mockOnVariantChange}
        onSubmit={mockOnSubmit}
        initialValues={{ query: '', group_id: 123456 }}
      />
    );

    const queryInput = screen.getByLabelText(/search knowledge base/i);
    const groupIdInput = screen.getByLabelText(/telegram group id/i);
    const submitButton = screen.getByRole('button', { name: /search knowledge base/i });

    await user.type(queryInput, 'test search');
    await user.clear(groupIdInput);
    await user.type(groupIdInput, '987654');
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      query: 'test search',
      group_id: 987654
    });
  });

  it('is accessible and has no accessibility violations', async () => {
    const { container } = render(
      <RAGToolForm
        variant="simple"
        onVariantChange={mockOnVariantChange}
        onSubmit={mockOnSubmit}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(
      <RAGToolForm
        variant="simple"
        onVariantChange={mockOnVariantChange}
        onSubmit={mockOnSubmit}
      />
    );

    const queryInput = screen.getByLabelText(/search knowledge base/i);
    const advancedButton = screen.getByText(/show advanced options/i);

    await user.tab();
    expect(queryInput).toHaveFocus();

    await user.tab();
    expect(advancedButton).toHaveFocus();

    // Test Enter key activation
    await user.keyboard('{Enter}');
    expect(mockOnVariantChange).toHaveBeenCalledWith('advanced');
  });
});

describe('EnhancedSourceCitations Component', () => {
  const mockSources = [
    {
      msg_id: 1,
      reply_to_msg_id: null,
      user_name: 'John Doe',
      msg_date: '2024-01-01T12:00:00Z',
      msg_text: 'This is a test message about trading strategies and DeFi protocols.',
      relevance_score: 0.85
    },
    {
      msg_id: 2,
      reply_to_msg_id: 1,
      user_name: 'Jane Smith',
      msg_date: '2024-01-02T14:00:00Z',
      msg_text: 'Great point about protocols. I agree with the analysis.',
      relevance_score: 0.92
    }
  ];

  const mockSearchTerms = ['trading', 'protocols'];

  it('renders source citations correctly', () => {
    render(
      <EnhancedSourceCitations
        sources={mockSources}
        searchTerms={mockSearchTerms}
      />
    );

    expect(screen.getByText('Sources')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Source count badge
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('highlights search terms in source text', () => {
    render(
      <EnhancedSourceCitations
        sources={mockSources}
        searchTerms={mockSearchTerms}
      />
    );

    // Check for highlighted terms (they should be wrapped in mark elements)
    const sourceText = screen.getByText(/trading strategies/i).closest('.search-highlighted-text');
    expect(sourceText).toBeInTheDocument();
  });

  it('shows confidence scores when enabled', () => {
    render(
      <EnhancedSourceCitations
        sources={mockSources}
        searchTerms={mockSearchTerms}
        showConfidence={true}
      />
    );

    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('92%')).toBeInTheDocument();
  });

  it('expands and collapses citations correctly', async () => {
    const user = userEvent.setup();
    render(
      <EnhancedSourceCitations
        sources={mockSources}
        searchTerms={mockSearchTerms}
      />
    );

    const expandButton = screen.getByLabelText(/expand citation from john doe/i);
    await user.click(expandButton);

    await waitFor(() => {
      expect(screen.getByText(/This is a test message about trading/i)).toBeVisible();
    });

    await user.click(expandButton);
    // Citation should collapse
  });

  it('handles empty sources gracefully', () => {
    render(
      <EnhancedSourceCitations
        sources={[]}
        searchTerms={mockSearchTerms}
      />
    );

    expect(screen.queryByText('Sources')).not.toBeInTheDocument();
  });

  it('calls onSourceExplore when explore button clicked', async () => {
    const mockOnSourceExplore = vi.fn();
    const user = userEvent.setup();

    render(
      <EnhancedSourceCitations
        sources={mockSources}
        searchTerms={mockSearchTerms}
        onSourceExplore={mockOnSourceExplore}
      />
    );

    // First expand a citation
    const expandButton = screen.getByLabelText(/expand citation from john doe/i);
    await user.click(expandButton);

    // Then click explore
    const exploreButton = await screen.findByText(/explore context/i);
    await user.click(exploreButton);

    expect(mockOnSourceExplore).toHaveBeenCalledWith(mockSources[0]);
  });

  it('is accessible and has no accessibility violations', async () => {
    const { container } = render(
      <EnhancedSourceCitations
        sources={mockSources}
        searchTerms={mockSearchTerms}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('RAG Loading States', () => {
  describe('RAGSearchSkeleton', () => {
    it('renders loading skeleton correctly', () => {
      render(<RAGSearchSkeleton />);

      // Check for skeleton elements
      expect(screen.getByText(/knowledge base search/i)).toBeInTheDocument();
      const skeletonElements = document.querySelectorAll('.animate-pulse');
      expect(skeletonElements.length).toBeGreaterThan(0);
    });
  });

  describe('RAGStreamingLoading', () => {
    it('renders streaming loading with correct stage', () => {
      render(
        <RAGStreamingLoading
          stage="searching"
          query="test query"
        />
      );

      expect(screen.getByText(/searching knowledge base/i)).toBeInTheDocument();
      expect(screen.getByText(/retrieving relevant sources/i)).toBeInTheDocument();
      expect(screen.getByText('Step 2 of 4')).toBeInTheDocument();
    });

    it('shows progress correctly for each stage', () => {
      const { rerender } = render(
        <RAGStreamingLoading
          stage="validating"
          query="test"
        />
      );

      expect(screen.getByText('25%')).toBeInTheDocument();

      rerender(
        <RAGStreamingLoading
          stage="processing"
          query="test"
        />
      );

      expect(screen.getByText('75%')).toBeInTheDocument();
    });
  });

  describe('RAGErrorState', () => {
    const mockOnRetry = vi.fn();

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('renders timeout error correctly', () => {
      render(
        <RAGErrorState
          errorType="timeout"
          query="test query"
          onRetry={mockOnRetry}
        />
      );

      expect(screen.getByText('Search Timeout')).toBeInTheDocument();
      expect(screen.getByText(/took too long to complete/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /retry search/i })).toBeInTheDocument();
    });

    it('renders no results error with suggestions', () => {
      render(
        <RAGErrorState
          errorType="no-results"
          query="nonexistent query"
        />
      );

      expect(screen.getByText('No Results Found')).toBeInTheDocument();
      expect(screen.getByText(/try different search terms/i)).toBeInTheDocument();
      expect(screen.getByText(/use broader or more general keywords/i)).toBeInTheDocument();
    });

    it('calls onRetry when retry button clicked', async () => {
      const user = userEvent.setup();
      render(
        <RAGErrorState
          errorType="network"
          onRetry={mockOnRetry}
        />
      );

      const retryButton = screen.getByRole('button', { name: /retry search/i });
      await user.click(retryButton);

      expect(mockOnRetry).toHaveBeenCalledTimes(1);
    });

    it('has proper ARIA attributes for error state', () => {
      render(
        <RAGErrorState
          errorType="server-error"
          errorMessage="Custom error message"
        />
      );

      const errorContainer = screen.getByRole('alert');
      expect(errorContainer).toHaveAttribute('aria-live', 'assertive');
    });
  });
});

describe('Accessibility Utils', () => {
  describe('ScreenReaderOnly', () => {
    it('renders content for screen readers only', () => {
      render(<ScreenReaderOnly>Hidden content</ScreenReaderOnly>);

      const element = screen.getByText('Hidden content');
      expect(element).toHaveClass('sr-only');
    });
  });

  describe('AccessibleLoading', () => {
    it('announces loading state to screen readers', () => {
      render(
        <AccessibleLoading isLoading={true} loadingText=<div>Content<
          "Custom loading..." </div>
        </AccessibleLoading>
      );

      const container = screen.getByRole('status');
      expect(container).toHaveAttribute('aria-live', 'polite');
      expect(container).toHaveAttribute('aria-label', 'Custom loading...');
    });

    it('announces completion when loading finishes', async () => {
      const { rerender } = render(
        <AccessibleLoading isLoading={true}>
          <div>Content</div>
        </AccessibleLoading>
      );

      rerender(
        <AccessibleLoading isLoading={false}>
          <div>Content</div>
        </AccessibleLoading>
      );

      // Check that completion announcement is added to DOM temporarily
      await waitFor(() => {
        const announcements = document.querySelectorAll('[aria-live="polite"]');
        expect(announcements.length).toBeGreaterThan(0);
      });
    });
  });

  describe('AccessibleButton', () => {
    it('renders with proper ARIA attributes', () => {
      render(
        <AccessibleButton
          ariaLabel="Custom button"
          ariaDescribedBy="description-id"
          loading={true}
        >
          Click me
        </AccessibleButton>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom button');
      expect(button).toHaveAttribute('aria-describedby', 'description-id');
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('applies correct variant styles', () => {
      const { rerender } = render(
        <AccessibleButton variant=Primary<"primary" </AccessibleButton>
      );

      let button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary');

      rerender(
        <AccessibleButton variant=Outline<"outline" </AccessibleButton>
      );

      button = screen.getByRole('button');
      expect(button).toHaveClass('border-border');
    });
  });

  describe('AccessibleFormField', () => {
    it('renders form field with proper labels and descriptions', () => {
      render(
        <AccessibleFormField
          label="Test Field"
          helperText="This is helper text"
          error="This is an error"
          required={true}
        >
          <input type="text" />
        </AccessibleFormField>
      );

      const input = screen.getByRole('textbox');
      const label = screen.getByText('Test Field');
      const helper = screen.getByText('This is helper text');
      let error = screen.getByRole('alert');

      expect(label).toBeInTheDocument();
      expect(helper).toBeInTheDocument();
      expect(error).toBeInTheDocument();
      expect(input).toHaveAttribute('aria-required', 'true');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby');
    });

    it('shows required indicator', () => {
      render(
        <AccessibleFormField label="Required Field" required={true}>
          <input type="text" />
        </AccessibleFormField>
      );

      expect(screen.getByLabelText('required')).toBeInTheDocument();
    });
  });
});

describe('Responsive Design', () => {
  // Mock window.matchMedia for responsive tests
  const mockMatchMedia = (matches: boolean) => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  };

  it('adapts layout for mobile screens', () => {
    mockMatchMedia(true); // Mobile

    render(
      <KnowledgeBaseSearchResult
        result={{
          llm_answer: 'Test answer',
          sources: [mockSources[0]],
          query: 'test',
          group_id: 123
        }}
      />
    );

    // Check mobile-specific classes are applied
    const badges = screen.getAllByText(/group/i);
    badges.forEach(badge => {
      expect(badge).toBeInTheDocument();
    });
  });

  it('respects reduced motion preferences', () => {
    // Mock prefers-reduced-motion: reduce
    mockMatchMedia(true);

    const { container } = render(
      <EnhancedSourceCitations
        sources={mockSources}
        searchTerms={'test'}
      />
    );

    // Check that animation classes are not present or handled properly
    const animatedElements = container.querySelectorAll('.motion-reduce\\:transition-none');
    expect(animatedElements.length).toBeGreaterThan(0);
  });
});

describe('Performance', () => {
  it('handles large numbers of sources efficiently', () => {
    const largeSources = Array.from({ length: 100 }, (_, i) => ({
      msg_id: i + 1,
      reply_to_msg_id: null,
      user_name: `User ${i + 1}`,
      msg_date: new Date().toISOString(),
      msg_text: `Message ${i + 1} content`,
      relevance_score: Math.random()
    }));

    const startTime = performance.now();
    render(
      <EnhancedSourceCitations
        sources={largeSources}
        searchTerms={'test'}
        maxInitiallyVisible={5}
      />
    );
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(100); // Should render quickly

    // Should only show limited sources initially
    expect(screen.getByText('+95 more')).toBeInTheDocument();
  });
});