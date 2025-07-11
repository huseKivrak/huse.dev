/**
 * Advanced logging system for development and production
 * Provides structured logging with different levels and contexts
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  agent?: string;
  sessionId?: string;
  userId?: string;
  timestamp: string;
  [key: string]: unknown;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  context: LogContext;
  error?: Error;
  stack?: string;
}

class Logger {
  private static instance: Logger;
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logBuffer: LogEntry[] = [];
  private maxBufferSize = 1000;

  private constructor() {
    // Set up global error handlers
    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
      window.addEventListener('error', this.handleGlobalError);
    }
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    this.error('Unhandled Promise Rejection', {
      reason: event.reason,
      promise: event.promise,
    });
  };

  private handleGlobalError = (event: ErrorEvent) => {
    this.error('Global Error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  };

  private formatMessage(entry: LogEntry): string {
    const { level, message, context, error } = entry;
    const timestamp = new Date(context.timestamp).toISOString();

    let formatted = `[${timestamp}] [${level.toUpperCase()}]`;

    if (context.agent) {
      formatted += ` [${context.agent}]`;
    }

    formatted += ` ${message}`;

    if (error) {
      formatted += `\n${error.stack || error.message}`;
    }

    return formatted;
  }

  private log(level: LogLevel, message: string, context: Partial<LogContext> = {}, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      context: {
        timestamp: new Date().toISOString(),
        ...context,
      },
      error,
      stack: error?.stack,
    };

    // Add to buffer for debugging
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }

    // Console output in development
    if (this.isDevelopment) {
      const formatted = this.formatMessage(entry);

      switch (level) {
        case 'debug':
          console.debug(formatted, context);
          break;
        case 'info':
          console.info(formatted, context);
          break;
        case 'warn':
          console.warn(formatted, context);
          break;
        case 'error':
          console.error(formatted, context, error);
          break;
      }
    }

    // Send critical errors to monitoring service in production
    if (!this.isDevelopment && level === 'error') {
      this.sendToMonitoring(entry);
    }
  }

    private sendToMonitoring(entry: LogEntry) {
    // Integration with error monitoring service (e.g., Sentry)
    // This is where you'd send errors to your monitoring service
    if (typeof window !== 'undefined' && 'navigator' in window && typeof navigator.sendBeacon === 'function') {
      // const payload = JSON.stringify({
      //   ...entry,
      //   userAgent: navigator.userAgent,
      //   url: window.location.href,
      // });

      // navigator.sendBeacon('/api/errors', payload);

      // TODO: Implement error monitoring integration
      void entry; // Prevent unused parameter warning
    }
  }

  debug(message: string, context?: Partial<LogContext>) {
    this.log('debug', message, context);
  }

  info(message: string, context?: Partial<LogContext>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Partial<LogContext>) {
    this.log('warn', message, context);
  }

  error(message: string, context?: Partial<LogContext>, error?: Error) {
    this.log('error', message, context, error);
  }

  // Get recent logs for debugging
  getRecentLogs(count: number = 50): LogEntry[] {
    return this.logBuffer.slice(-count);
  }

  // Clear log buffer
  clearLogs() {
    this.logBuffer = [];
  }

  // Export logs for debugging
  exportLogs(): string {
    return this.logBuffer.map(entry => this.formatMessage(entry)).join('\n');
  }

  // Get user-friendly error message
  getUserFriendlyError(error: Error): string {
    // Common error patterns and their user-friendly messages
    const errorPatterns: Array<[RegExp, string]> = [
      [/microphone|getUserMedia/i, 'Microphone access is required. Please allow microphone permissions and try again.'],
      [/agent.*not.*configured|No ElevenLabs agent ID/i, 'This agent is not properly configured. Please try another agent or contact support.'],
      [/network|fetch|connection/i, 'Connection error. Please check your internet connection and try again.'],
      [/session.*failed|startSession/i, 'Failed to start conversation. Please refresh the page and try again.'],
      [/permission.*denied/i, 'Permission denied. Please check your browser settings.'],
      [/rate.*limit/i, 'Too many requests. Please wait a moment and try again.'],
      [/unauthorized|401/i, 'Authentication failed. Please check your credentials.'],
      [/server.*error|500|502|503/i, 'Server error. The service may be temporarily unavailable.'],
    ];

    const errorMessage = error.message || error.toString();

    for (const [pattern, friendlyMessage] of errorPatterns) {
      if (pattern.test(errorMessage)) {
        return friendlyMessage;
      }
    }

    // Default message for unknown errors
    return 'An unexpected error occurred. Please try again or contact support if the issue persists.';
  }

  // Create a child logger with preset context
  child(context: Partial<LogContext>) {
    return {
      debug: (message: string, additionalContext?: Partial<LogContext>) =>
        this.debug(message, { ...context, ...additionalContext }),
      info: (message: string, additionalContext?: Partial<LogContext>) =>
        this.info(message, { ...context, ...additionalContext }),
      warn: (message: string, additionalContext?: Partial<LogContext>) =>
        this.warn(message, { ...context, ...additionalContext }),
      error: (message: string, additionalContext?: Partial<LogContext>, error?: Error) =>
        this.error(message, { ...context, ...additionalContext }, error),
    };
  }
}

export const logger = Logger.getInstance();

// Convenience export for creating child loggers
export const createLogger = (context: Partial<LogContext>) => logger.child(context);