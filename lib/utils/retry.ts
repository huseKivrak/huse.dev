/**
 * Retry utility with exponential backoff
 * Handles transient failures gracefully
 */

import { logger } from './logger';

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  onRetry?: (attempt: number, error: Error) => void;
  shouldRetry?: (error: Error) => boolean;
  signal?: AbortSignal;
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, 'onRetry' | 'shouldRetry' | 'signal'>> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 30000,
  backoffFactor: 2,
};

// Default retry condition - retry on network errors and 5xx status codes
const defaultShouldRetry = (error: Error): boolean => {
  const message = error.message.toLowerCase();

  // Network errors
  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('connection') ||
    message.includes('timeout')
  ) {
    return true;
  }

  // Server errors (5xx)
  if (message.includes('500') || message.includes('502') || message.includes('503')) {
    return true;
  }

  // Rate limiting
  if (message.includes('429') || message.includes('rate limit')) {
    return true;
  }

  return false;
};

/**
 * Execute a function with retry logic and exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const shouldRetry = opts.shouldRetry || defaultShouldRetry;

  let lastError: Error;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      // Check if aborted
      if (opts.signal?.aborted) {
        throw new Error('Operation aborted');
      }

      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry if this is the last attempt
      if (attempt === opts.maxRetries) {
        break;
      }

      // Check if we should retry this error
      if (!shouldRetry(lastError)) {
        throw lastError;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        opts.initialDelay * Math.pow(opts.backoffFactor, attempt),
        opts.maxDelay
      );

      // Log retry attempt
      logger.info('Retrying operation', {
        attempt: attempt + 1,
        maxRetries: opts.maxRetries,
        delay,
        error: lastError.message,
      });

      // Call retry callback if provided
      opts.onRetry?.(attempt + 1, lastError);

      // Wait before retrying
      await sleep(delay, opts.signal);
    }
  }

  // All retries exhausted
  throw lastError!;
}

/**
 * Sleep for a specified duration with abort support
 */
function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error('Sleep aborted'));
      return;
    }

    const timeout = setTimeout(resolve, ms);

    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timeout);
        reject(new Error('Sleep aborted'));
      }, { once: true });
    }
  });
}

/**
 * Create a retry wrapper with preset options
 */
export function createRetryWrapper(defaultOptions: RetryOptions) {
  return <T>(fn: () => Promise<T>, overrides?: RetryOptions): Promise<T> => {
    return withRetry(fn, { ...defaultOptions, ...overrides });
  };
}

/**
 * Retry wrapper specifically for API calls
 */
export const retryAPI = createRetryWrapper({
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  shouldRetry: (error) => {
    // Don't retry client errors (4xx) except 429
    if (error.message.includes('400') ||
        error.message.includes('401') ||
        error.message.includes('403') ||
        error.message.includes('404')) {
      return false;
    }
    return defaultShouldRetry(error);
  },
});

/**
 * Retry wrapper for voice/audio operations
 */
export const retryVoice = createRetryWrapper({
  maxRetries: 2,
  initialDelay: 2000,
  maxDelay: 5000,
  shouldRetry: (error) => {
    // Don't retry permission errors
    if (error.message.includes('permission') || error.message.includes('denied')) {
      return false;
    }
    return defaultShouldRetry(error);
  },
});