export const PORT = process.env.PORT || 3000;
export const ENV = process.env.ENV || 'development';

export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

export const JWT_SECRET = process.env.JWT_SECRET || Math.random().toString(36).substring(10);
export const JWT_EXPIRATION_MS: any = process.env.JWT_EXPIRATION_MS || 24 * 60 * 60 * 1000;
