export interface JwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}

export interface RateLimitOptions {
  window: number; // seconds
  max: number;
  keyPrefix: string;
}
