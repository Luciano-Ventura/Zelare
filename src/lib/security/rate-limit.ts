export const rateLimitStore = new Map<string, { count: number; expiresAt: number }>();

export function checkRateLimit(ip: string, limit: number = 10, windowMs: number = 60000): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  // Limpeza de cache antiga a cada acesso (MVP approach, evite se o store for gigante)
  if (rateLimitStore.size > 10000) {
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.expiresAt < now) {
        rateLimitStore.delete(key);
      }
    }
  }

  if (!record || record.expiresAt < now) {
    rateLimitStore.set(ip, {
      count: 1,
      expiresAt: now + windowMs,
    });
    return { success: true, remaining: limit - 1, resetTime: now + windowMs };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0, resetTime: record.expiresAt };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count, resetTime: record.expiresAt };
}
