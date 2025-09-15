'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Screen reader only text component for accessibility
export function ScreenReaderOnly({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        '-inset-1 clip-[rect(0,0,0,0)] sr-only absolute m-0 h-px w-px overflow-hidden whitespace-nowrap border-0 p-0',
        className
      )}
    >
      {children}
    </span>
  );
}

// Skip link component for keyboard navigation
export function SkipLink({
  href,
  children,
  className
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4",
        'focus:z-50 focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground',
        "focus:rounded focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "transition-all duration-200",
        className
      )}
    >
      {children}
    </a>
  );
}

// Focus trap for modals and dialogs
export function FocusTrap({
  children,
  active = true,
  className
}: {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}) {
  useEffect(() => {
    if (!active) return;

    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const container = document.querySelector('.focus-trap') as HTMLElement;

    if (!container) return;

    const firstFocusableElement = container.querySelectorAll(focusableElements)[0] as HTMLElement;
    const focusableContent = container.querySelectorAll(focusableElements);
    const lastFocusableElement = focusableContent[focusableContent.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstFocusableElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [active]);

  return (
    <div className={cn("focus-trap", className)}>
      {children}
    </div>
  );
}

// Accessible loading indicator with screen reader announcements
export function AccessibleLoading({
  isLoading,
  loadingText = "Loading...",
  completedText = "Loading completed",
  children,
  className
}: {
  isLoading: boolean;
  loadingText?: string;
  completedText?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [announced, setAnnounced] = useState(false);

  useEffect(() => {
    if (!isLoading && !announced) {
      // Announce completion to screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = completedText;
      document.body.appendChild(announcement);

      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);

      setAnnounced(true);
    }

    if (isLoading) {
      setAnnounced(false);
    }
  }, [isLoading, completedText, announced]);

  return (
    <div
      className={className}
      role="status"
      aria-live="polite"
      aria-label={isLoading ? loadingText : undefined}
    >
      {children}
      {isLoading && (
        <ScreenReaderOnly>
          {loadingText}
        </ScreenReaderOnly>
      )}
    </div>
  );
}

// Accessible error boundary with proper ARIA attributes
export function AccessibleErrorBoundary({
  error,
  onRetry,
  children,
  className
}: {
  error?: Error | null;
  onRetry?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  if (error) {
    return (
      <div
        role="alert"
        aria-live="assertive"
        className={cn(
          "rounded-lg border border-destructive/20 bg-destructive/5 p-4",
          "focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2",
          className
        )}
        tabIndex={-1}
      >
        <h3 className='mb-2 font-medium text-destructive text-sm'>
          An error occurred
        </h3>
        <p className='mb-3 text-muted-foreground text-sm'>
          {error.message || 'Something went wrong. Please try again.'}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1 text-sm",
              'rounded bg-destructive text-destructive-foreground',
              "hover:bg-destructive/90 focus:outline-none focus:ring-2",
              "focus:ring-destructive focus:ring-offset-2",
              "transition-colors duration-200"
            )}
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}

// High contrast mode detector
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isHighContrast;
}

// Reduced motion detector
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// Accessible button with proper ARIA attributes
export function AccessibleButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  loadingText = "Loading...",
  ariaLabel,
  ariaDescribedBy,
  className,
  variant = 'default',
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'outline';
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variantClasses = {
    default: 'bg-background text-foreground border border-border hover:bg-accent',
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    outline: 'border border-border bg-transparent hover:bg-accent'
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      className={cn(
        'inline-flex items-center gap-2 rounded-md px-4 py-2',
        'font-medium text-sm transition-colors duration-200',
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
      {loading && (
        <ScreenReaderOnly>
          {loadingText}
        </ScreenReaderOnly>
      )}
    </button>
  );
}

// Accessible heading component with proper hierarchy
export function AccessibleHeading({
  level,
  children,
  className,
  id,
  ...props
}: {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  id?: string;
} & React.HTMLAttributes<HTMLHeadingElement>) {
  const commonProps = {
    id,
    className: cn(
      "font-semibold text-foreground focus:outline-none focus:ring-2",
      "focus:ring-ring focus:ring-offset-2 rounded-sm",
      {
        'text-3xl': level === 1,
        'text-2xl': level === 2,
        'text-xl': level === 3,
        'text-lg': level === 4,
        'text-base': level === 5,
        'text-sm': level === 6,
      },
      className
    ),
    tabIndex: -1 as const,
    ...props
  };

  switch (level) {
    case 1:
      return <h1 {...commonProps}>{children}</h1>;
    case 2:
      return <h2 {...commonProps}>{children}</h2>;
    case 3:
      return <h3 {...commonProps}>{children}</h3>;
    case 4:
      return <h4 {...commonProps}>{children}</h4>;
    case 5:
      return <h5 {...commonProps}>{children}</h5>;
    case 6:
      return <h6 {...commonProps}>{children}</h6>;
    default:
      return <h1 {...commonProps}>{children}</h1>;
  }
}

// Accessible form field wrapper
export function AccessibleFormField({
  label,
  helperText,
  error,
  required = false,
  children,
  className
}: {
  label: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode | ((props: { id: string; describedBy?: string }) => React.ReactNode);
  className?: string;
}) {
  const id = `field-${Math.random().toString(36).substr(2, 9)}`;
  const helperId = helperText ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn("space-y-1", className)}>
      <label
        htmlFor={id}
        className='flex items-center gap-1 font-medium text-foreground text-sm'
      >
        {label}
        {required && (
          <span className="text-destructive" aria-label="required">
            *
          </span>
        )}
      </label>

      <div className="relative">
        {typeof children === 'function'
          ? (children as (props: { id: string; describedBy?: string }) => React.ReactNode)({ id, describedBy })
          : React.isValidElement(children)
          ? React.cloneElement(children, {
              id,
              'aria-describedby': describedBy,
              'aria-invalid': error ? 'true' : undefined,
              'aria-required': required
            } as any)
          : children
        }
      </div>

      {helperText && (
        <p
          id={helperId}
          className='text-muted-foreground text-xs'
        >
          {helperText}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          role="alert"
          className='text-destructive text-xs'
        >
          {error}
        </p>
      )}
    </div>
  );
}