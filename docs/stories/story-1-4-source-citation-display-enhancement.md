# Story 1.4: Source Citation Display Enhancement

**Jira Key:** TKB-4
**Status:** To Do
**Priority:** Medium

## User Story

As a **user**,
I want **clear, accessible source citations for Knowledge Base results**,
so that **I can verify and explore the original context of information**.

## Story Context

**Existing System Integration:**
- Integrates with: Existing message rendering components and shadcn/ui component library
- Technology: React 19.0.0-rc, shadcn/ui components, Tailwind CSS 4.1.13, Framer Motion 11.3.19
- Follows pattern: Existing message formatting and collapsible content patterns
- Touch points: Message display components, responsive design system, accessibility standards

**Enhancement Details:**
This story creates a sophisticated source citation display system that renders Telegram message sources in an accessible, user-friendly format. Citations will be visually distinct from the main LLM response while providing full context about each source message including author, date, and content.

## Acceptance Criteria

### Functional Requirements

1. **Source Citation Blocks**: Sources render as visually distinct citation blocks below the main LLM answer

2. **Expandable Interface**: Citation blocks are collapsible/expandable to manage screen space and information density

3. **Complete Source Metadata**: Each source displays:
   - User name (author)
   - Message date (formatted for readability)
   - Full message text content
   - Message ID for reference

4. **Visual Hierarchy**: Clear visual distinction between main LLM answer and supporting source citations

### Integration Requirements

5. **Component Integration**: Citation display uses existing shadcn/ui components and follows current design patterns

6. **Responsive Design**: Citations display appropriately on mobile and desktop devices with proper responsive behavior

7. **Message Rendering**: Citation blocks integrate seamlessly with existing message rendering system

8. **Performance**: Rendering multiple sources doesn't impact message rendering performance

### Quality Requirements

9. **Accessibility Standards**: Citation blocks meet existing accessibility requirements with proper ARIA labels and keyboard navigation

10. **Animation**: Smooth expand/collapse animations using existing Framer Motion patterns

11. **Typography**: Source content maintains readability while being visually subordinate to main response

12. **Loading States**: Graceful handling of partial source data or loading states

## Technical Notes

**Integration Approach:**
- Create reusable citation component using shadcn/ui primitives
- Integrate with existing message rendering without breaking current layouts
- Use existing responsive design patterns and breakpoints

**Existing Pattern Reference:**
- Follow existing collapsible content patterns in the codebase
- Use same typography scale and spacing as other message elements
- Match existing animation patterns for expand/collapse behavior

**Key Constraints:**
- Must not interfere with existing message rendering performance
- Citation display should be scannable and not overwhelm the main response
- Mobile experience should be optimized for limited screen space

## Component Structure

```typescript
interface SourceCitation {
  msg_id: number;
  reply_to_msg_id: number | null;
  user_name: string;
  msg_date: string;
  msg_text: string;
}

interface SourceCitationsProps {
  sources: SourceCitation[];
  className?: string;
}

// Main citation display component
const SourceCitations: React.FC<SourceCitationsProps>;

// Individual citation block component
const CitationBlock: React.FC<{
  source: SourceCitation;
  index: number;
  defaultExpanded?: boolean;
}>;
```

## Visual Design Specifications

```typescript
// Tailwind classes following existing design system
const citationStyles = {
  container: "mt-4 border-l-4 border-muted-foreground/20 pl-4 space-y-2",
  header: "flex items-center justify-between text-sm text-muted-foreground",
  author: "font-medium text-foreground",
  date: "text-xs",
  content: "text-sm leading-relaxed",
  expandButton: "hover:text-foreground transition-colors",
  collapsedIndicator: "text-xs text-muted-foreground italic"
};
```

## User Experience Flow

1. **Initial Display**: Sources appear collapsed with author name and truncated preview
2. **Expansion**: Click/tap to expand full message content
3. **Scanning**: Multiple sources can be expanded simultaneously for comparison
4. **Accessibility**: Keyboard navigation supports expand/collapse operations
5. **Mobile**: Touch-friendly interaction with appropriate spacing

## Definition of Done

- [ ] Source citation component implemented using shadcn/ui primitives
- [ ] Citations render below RAG responses with proper visual hierarchy
- [ ] Expand/collapse functionality works smoothly with animations
- [ ] All source metadata displays correctly (author, date, content, ID)
- [ ] Responsive design works on mobile and desktop devices
- [ ] Accessibility standards met with proper ARIA labels
- [ ] Keyboard navigation supports all citation interactions
- [ ] Visual design matches existing message component styling
- [ ] Performance testing confirms no impact on message rendering
- [ ] Unit tests for citation component functionality
- [ ] Integration tests for citation display within message flow
- [ ] Visual regression tests for different source count scenarios

## Risk Mitigation

**Primary Risk:** Citation display could interfere with existing message rendering or overwhelm the user interface

**Mitigation:**
- Thoughtful visual design that keeps citations secondary to main content
- Collapsible interface to manage information density
- Performance testing to ensure smooth rendering with many sources

**Rollback Plan:**
- Citation component can be easily disabled or hidden
- Fallback to simple text list of sources if needed
- No existing message functionality depends on citation display

## Integration Verification

- **IV1:** Citation display doesn't interfere with existing message rendering
- **IV2:** Source blocks maintain accessibility standards consistent with current UI
- **IV3:** Performance impact of rendering multiple sources remains within acceptable limits

## Dependencies

- **Requires:**
  - Story 1.1 (RAG API Client Infrastructure) completed
  - Story 1.2 (Knowledge Base Tool Definition) completed
  - Story 1.3 (Streaming Response Integration) completed
- **Completes:** Full Knowledge Base Search tool integration

## Estimated Effort

**Development:** 8-10 hours
**Testing:** 4-5 hours
**Design/Polish:** 2-3 hours
**Total:** 14-18 hours

## Accessibility Requirements

- **Screen Readers**: Source citations announce properly with context
- **Keyboard Navigation**: Tab order includes citation expand/collapse controls
- **Focus Management**: Proper focus indicators for all interactive elements
- **Color Contrast**: Citation text meets WCAG contrast requirements
- **Responsive Text**: Citations remain readable at all zoom levels

## Animation Specifications

- **Expand/Collapse**: Smooth height transition using Framer Motion
- **Duration**: 200-300ms for responsiveness
- **Easing**: Use existing easing functions from design system
- **Reduced Motion**: Respect user preference for reduced motion

## Edge Cases to Handle

- **No Sources**: Graceful handling when RAG returns empty sources array
- **Long Content**: Proper text wrapping and truncation for very long messages
- **Special Characters**: Proper rendering of emojis and special characters in source text
- **Date Formatting**: Consistent date formatting across different locales
- **Error States**: Handling when source metadata is incomplete or malformed