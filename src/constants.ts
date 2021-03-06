export const PORT = process.env.PORT || 3000;
export const ENV = process.env.ENV || 'development';
export const DOMAIN = process.env.DOMAIN || 'http://nils.local';
export const DOMAIN_FRONTEND = process.env.DOMAIN_FRONTEND || 'http://localhost:3000';

export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const JWT_SECRET = process.env.JWT_SECRET || Math.random().toString(36).substring(10);
export const AUTH_EXPIRATION_MS: any = process.env.AUTH_EXPIRATION_MS || 7 * 24 * 60 * 60 * 1000;
export const CSRF_EXPIRATION_MS: any = process.env.CSRF_EXPIRATION_MS || 24 * 60 * 60 * 1000;

export const TRANSFERWISE_API_KEY = process.env.TRANSFERWISE_API_KEY;
export const TRANSFERWISE_BASE = process.env.TRANSFERWISE_BASE || 'https://api.transferwise.com';

export const MIN_HOURS_DOMAIN: number = process.env.MIN_HOURS_DOMAIN ? parseInt(process.env.MIN_HOURS_DOMAIN, 10) : 24;
export const MIN_NILS_PAYMENT: number = process.env.MIN_NILS_PAYMENT ? parseFloat(process.env.MIN_NILS_PAYMENT) : 1;
export const NILS_GBP_RATIO: number = process.env.NILS_GBP_RATIO ? parseFloat(process.env.NILS_GBP_RATIO) : 0.001;
