// rate-limit.decorator.ts

import { SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_METADATA_KEY = 'rateLimitInterval';

export const RateLimit = (intervalMs: number) => {
  return SetMetadata(RATE_LIMIT_METADATA_KEY, intervalMs);
};
