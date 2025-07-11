/**
 * Performance monitoring utilities
 * Lightweight wrapper around browser Performance API
 */

interface PerformanceMark {
  startTime: number;
  duration?: number;
}

class PerformanceMonitor {
  private marks = new Map<string, PerformanceMark>();
  private enabled = process.env.NODE_ENV === 'development';
  private maxMarks = 100;

  mark(name: string) {
    if (!this.enabled) return;

    // Clean up old marks if we hit the limit
    if (this.marks.size >= this.maxMarks) {
      const oldestKey = this.marks.keys().next().value;
      if (oldestKey) this.marks.delete(oldestKey);
    }

    this.marks.set(name, {
      startTime: performance.now(),
    });
  }

  measure(name: string): number | undefined {
    if (!this.enabled) return;

    const mark = this.marks.get(name);
    if (!mark) return;

    const duration = performance.now() - mark.startTime;
    mark.duration = duration;

    // Log slow operations
    if (duration > 1000) {
      console.warn(`[Performance] ${name} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  clear(name?: string) {
    if (name) {
      this.marks.delete(name);
    } else {
      this.marks.clear();
    }
  }

  getMetrics() {
    return Array.from(this.marks.entries()).map(([name, mark]) => ({
      name,
      startTime: mark.startTime,
      duration: mark.duration,
    }));
  }

  // Track API calls with minimal overhead
  async trackAPICall<T>(
    endpoint: string,
    fn: () => Promise<T>
  ): Promise<T> {
    if (!this.enabled) return fn();

    const markName = `api-${endpoint}-${Date.now()}`;
    this.mark(markName);

    try {
      const result = await fn();
      const duration = this.measure(markName);

      if (duration && duration > 500) {
        console.warn(`[API] ${endpoint} took ${duration.toFixed(2)}ms`);
      }

      return result;
    } catch (error) {
      this.measure(markName);
      throw error;
    } finally {
      // Clean up after a delay to allow inspection
      setTimeout(() => this.clear(markName), 5000);
    }
  }

  // Web Vitals monitoring
  observeWebVitals() {
    if (typeof window === 'undefined' || !this.enabled) return;

    // First Contentful Paint
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          console.log(`[Web Vitals] FCP: ${entry.startTime.toFixed(2)}ms`);
        }
      }
    });

    try {
      paintObserver.observe({ entryTypes: ['paint'] });
    } catch {
      // Observer not supported
    }

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log(`[Web Vitals] LCP: ${lastEntry.startTime.toFixed(2)}ms`);
    });

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch {
      // Observer not supported
    }
  }

  // Export metrics for debugging
  exportMetrics() {
    return {
      marks: Array.from(this.marks.entries()),
      vitals: this.getWebVitals(),
    };
  }

  private getWebVitals() {
    if (typeof window === 'undefined') return {};

    const vitals: Record<string, number> = {};

    // Get navigation timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      vitals.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
      vitals.loadComplete = navigation.loadEventEnd - navigation.loadEventStart;
    }

    return vitals;
  }
}

export const performanceMonitor = new PerformanceMonitor();

// React Profiler callback
export const onRenderCallback = (
  id: string,
  phase: 'mount' | 'update' | 'nested-update',
  actualDuration: number,
  _baseDuration: number,
  _startTime: number,
  _commitTime: number,
  _interactions: Set<unknown>
) => {
  // Explicitly mark unused parameters
  void _baseDuration;
  void _startTime;
  void _commitTime;
  void _interactions;

  if (process.env.NODE_ENV !== 'development') return;

  // Only log slow renders
  if (actualDuration > 16) { // 16ms = 60fps threshold
    console.warn(
      `[React Profiler] ${id} (${phase}) took ${actualDuration.toFixed(2)}ms`
    );
  }
};