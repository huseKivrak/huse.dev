'use client';

import { logger } from '@/lib/utils/logger';
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  isolate?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): State {
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError } = this.props;
    const { errorId } = this.state;

    // Log error with full context
    logger.error('React Error Boundary Caught Error', {
      errorId,
      componentStack: errorInfo.componentStack,
      errorBoundary: this.constructor.name,
      props: this.props.isolate ? 'isolated' : 'global',
    }, error);

    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }
  }

  reset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorId: '',
    });
  };

  render() {
    const { hasError, error, errorId } = this.state;
    const { children, fallback, isolate } = this.props;

    if (hasError && error) {
      // Custom fallback
      if (fallback) {
        return <>{fallback(error, this.reset)}</>;
      }

      // Default fallback UI
      return (
        <div className={`
          ${isolate ? 'p-4' : 'min-h-screen flex items-center justify-center'}
          bg-black text-stone-300 font-mono
        `}>
          <div className="max-w-2xl w-full space-y-4">
            <div className="text-red-500 text-sm">
              error: {errorId}
            </div>

            <h1 className="text-xl text-stone-100">
              something went wrong
            </h1>

            <div className="text-sm space-y-2">
              <p className="text-stone-400">
                {error.message || 'an unexpected error occurred'}
              </p>

              {process.env.NODE_ENV === 'development' && (
                <details className="mt-4">
                  <summary className="cursor-pointer text-stone-500 hover:text-stone-300">
                    technical details
                  </summary>
                  <pre className="mt-2 text-xs bg-stone-900 p-4 rounded overflow-auto">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={this.reset}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded transition-colors"
              >
                try again
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-400 rounded transition-colors"
              >
                go home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

// Convenience hook for error handling
export function useErrorHandler() {
  return (error: Error, errorInfo?: { componentStack?: string }) => {
    logger.error('Manual Error Report', {
      componentStack: errorInfo?.componentStack,
    }, error);
  };
}