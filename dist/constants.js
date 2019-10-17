"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = process.env.PORT || 3000;
exports.ENV = process.env.ENV || 'development';
exports.DOMAIN = process.env.DOMAIN || 'http://nils.local';
exports.DOMAIN_FRONTEND = process.env.DOMAIN_FRONTEND || 'http://localhost:3000';
exports.GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
exports.GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
exports.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
exports.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
exports.JWT_SECRET = process.env.JWT_SECRET || Math.random().toString(36).substring(10);
exports.AUTH_EXPIRATION_MS = process.env.AUTH_EXPIRATION_MS || 7 * 24 * 60 * 60 * 1000;
exports.CSRF_EXPIRATION_MS = process.env.CSRF_EXPIRATION_MS || 24 * 60 * 60 * 1000;
//# sourceMappingURL=constants.js.map