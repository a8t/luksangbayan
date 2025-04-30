interface RateLimitStore {
  [key: string]: {
    attempts: number;
    lastAttempt: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  private cleanup() {
    const now = Date.now();
    for (const key in this.store) {
      if (now - this.store[key].lastAttempt > this.windowMs) {
        delete this.store[key];
      }
    }
  }

  isLimited(key: string): boolean {
    this.cleanup();
    const entry = this.store[key];

    if (!entry) {
      return false;
    }

    return entry.attempts >= this.maxAttempts;
  }

  increment(key: string): void {
    this.cleanup();
    const now = Date.now();

    if (!this.store[key]) {
      this.store[key] = {
        attempts: 1,
        lastAttempt: now,
      };
    } else {
      this.store[key].attempts++;
      this.store[key].lastAttempt = now;
    }
  }

  reset(key: string): void {
    delete this.store[key];
  }
}

export const rateLimiter = new RateLimiter();
