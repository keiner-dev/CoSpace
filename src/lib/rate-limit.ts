interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// Almacenamiento en memoria para registrar intentos fallidos por IP
const rateLimitMap = new Map<string, RateLimitRecord>();

// Limpieza periódica para evitar acumulación de memoria
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 60 * 1000);
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function checkRateLimit(
  key: string,
  maxAttempts: number = 5
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    return { allowed: true, remaining: maxAttempts, retryAfterSeconds: 0 };
  }

  if (record.count >= maxAttempts) {
    const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  return {
    allowed: true,
    remaining: maxAttempts - record.count,
    retryAfterSeconds: 0,
  };
}

export function recordFailedAttempt(
  key: string,
  windowMs: number = 15 * 60 * 1000 // 15 minutos por defecto
): void {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
  } else {
    record.count += 1;
  }
}

export function resetRateLimit(key: string): void {
  rateLimitMap.delete(key);
}