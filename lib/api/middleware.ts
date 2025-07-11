import { logger } from '@/lib/utils/logger';
import { NextRequest, NextResponse } from 'next/server';

type ApiHandler = (request: NextRequest) => Promise<NextResponse> | NextResponse;

interface ApiErrorResponse {
  error: string;
  message?: string;
  statusCode: number;
  timestamp: string;
  path?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Wraps an API handler with error handling and logging
 */
export function withErrorHandler(
  handler: ApiHandler,
  options: {
    name: string;
    logRequest?: boolean;
    requireAuth?: boolean;
  }
): ApiHandler {
  return async (request: NextRequest) => {
    const startTime = performance.now();
    const requestId = crypto.randomUUID();
    const log = logger.child({
      api: options.name,
      requestId,
      method: request.method,
      url: request.url,
    });

    try {
      // Log request if enabled
      if (options.logRequest) {
        log.info('API Request', {
          headers: Object.fromEntries(request.headers.entries()),
          query: Object.fromEntries(request.nextUrl.searchParams.entries()),
        });
      }

      // Check authentication if required
      if (options.requireAuth) {
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
          throw new ApiError('Unauthorized', 401, 'AUTH_REQUIRED');
        }
        // Add your auth validation logic here
      }

      // Execute handler
      const response = await handler(request);

      // Log response
      const duration = performance.now() - startTime;
      log.info('API Response', {
        status: response.status,
        duration,
      });

      // Add request ID to response headers
      response.headers.set('X-Request-ID', requestId);
      response.headers.set('X-Response-Time', `${duration}ms`);

      return response;
    } catch (error) {
      const duration = performance.now() - startTime;

      // Handle known API errors
      if (error instanceof ApiError) {
        log.warn('API Error', {
          error: error.message,
          code: error.code,
          statusCode: error.statusCode,
          duration,
        });

        const errorResponse: ApiErrorResponse = {
          error: error.code || 'API_ERROR',
          message: error.message,
          statusCode: error.statusCode,
          timestamp: new Date().toISOString(),
          path: request.url,
        };

        return NextResponse.json(errorResponse, {
          status: error.statusCode,
          headers: {
            'X-Request-ID': requestId,
            'X-Response-Time': `${duration}ms`,
          }
        });
      }

      // Handle unexpected errors
      log.error('Unexpected API Error', { duration }, error as Error);

      const errorResponse: ApiErrorResponse = {
        error: 'INTERNAL_SERVER_ERROR',
        message: process.env.NODE_ENV === 'development'
          ? (error as Error).message
          : 'An unexpected error occurred',
        statusCode: 500,
        timestamp: new Date().toISOString(),
        path: request.url,
      };

      return NextResponse.json(errorResponse, {
        status: 500,
        headers: {
          'X-Request-ID': requestId,
          'X-Response-Time': `${duration}ms`,
        }
      });
    }
  };
}

/**
 * Validates request body against a schema
 */
interface ValidationRule {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required?: boolean;
  validator?: (value: unknown) => boolean;
  message?: string;
}

export async function validateBody<T extends Record<string, unknown>>(
  request: NextRequest,
  schema: {
    [K in keyof T]: ValidationRule;
  }
): Promise<T> {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    throw new ApiError('Invalid JSON body', 400, 'INVALID_JSON');
  }

  const validated: Record<string, unknown> = {};

  for (const [key, rules] of Object.entries(schema) as [string, ValidationRule][]) {
    const value = body[key];

    // Check required fields
    if (rules.required && (value === undefined || value === null)) {
      throw new ApiError(
        rules.message || `Missing required field: ${key}`,
        400,
        'MISSING_FIELD'
      );
    }

    // Skip optional undefined fields
    if (value === undefined) continue;

    // Type validation
    const actualType = Array.isArray(value) ? 'array' : typeof value;
    if (actualType !== rules.type) {
      throw new ApiError(
        `Invalid type for ${key}: expected ${rules.type}, got ${actualType}`,
        400,
        'INVALID_TYPE'
      );
    }

    // Custom validation
    if (rules.validator && !rules.validator(value)) {
      throw new ApiError(
        rules.message || `Invalid value for ${key}`,
        400,
        'INVALID_VALUE'
      );
    }

    validated[key] = value;
  }

  return validated as T;
}

/**
 * Rate limiting middleware
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function withRateLimit(
  maxRequests: number = 10,
  windowMs: number = 60000
): (request: NextRequest) => void {
  return (request: NextRequest) => {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();

    const record = rateLimitMap.get(ip);

    if (!record || record.resetTime < now) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      return;
    }

    if (record.count >= maxRequests) {
      throw new ApiError('Too many requests', 429, 'RATE_LIMIT_EXCEEDED');
    }

    record.count++;
  };
}