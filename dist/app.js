"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const body_parser_1 = __importDefault(require("body-parser"));
const lusca_1 = __importDefault(require("lusca"));
const passport_1 = __importDefault(require("passport"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./endpoints/auth"));
const status_1 = __importDefault(require("./endpoints/status"));
const users_1 = __importDefault(require("./endpoints/users"));
const domains_1 = __importDefault(require("./endpoints/payouts/domains"));
const payouts_1 = __importDefault(require("./endpoints/payouts"));
const csrf_1 = require("./middleware/csrf");
const constants_1 = require("./constants");
const auth_2 = require("./middleware/auth");
// Create Express server
const app = express_1.default();
// Express configuration
app.set('port', constants_1.PORT);
app.set('env', constants_1.ENV);
app.use(compression_1.default());
const corsOptions = {
    origin: constants_1.DOMAIN_FRONTEND,
    credentials: true,
    exposedHeaders: [csrf_1.CSRF_HEADER],
};
app.use(cors_1.default(corsOptions));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Session management
app.use(passport_1.default.initialize());
app.use(cookie_parser_1.default());
// Security settings
app.use(lusca_1.default.xssProtection(true));
app.use(lusca_1.default.xframe('SAMEORIGIN'));
app.use(lusca_1.default.nosniff());
app.disable('x-powered-by');
/**
 * Routes
 */
app.use('/users', auth_2.checkSession, csrf_1.checkCSRF, users_1.default);
app.use('/domains', auth_2.checkSession, csrf_1.checkCSRF, domains_1.default);
app.use('/payouts', auth_2.checkSession, csrf_1.checkCSRF, payouts_1.default);
app.use('/auth', auth_1.default);
// This endpoint must be the last one
app.get('/', status_1.default(app));
exports.default = app;
//# sourceMappingURL=app.js.map