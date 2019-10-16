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
const auth_1 = __importDefault(require("./endpoints/auth"));
const status_1 = __importDefault(require("./endpoints/status"));
const users_1 = __importDefault(require("./endpoints/users"));
const auth_2 = require("./middleware/auth");
const constants_1 = require("./constants");
// Create Express server
const app = express_1.default();
// Express configuration
app.set('port', constants_1.PORT);
app.set('env', constants_1.ENV);
app.use(compression_1.default());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Session management
app.use(passport_1.default.initialize());
app.use(cookie_parser_1.default());
// Security settings
app.use(lusca_1.default.xssProtection(true));
app.use(lusca_1.default.xframe('SAMEORIGIN'));
app.use(lusca_1.default.nosniff());
/**
 * Primary app routes.
 */
app.use('/users', auth_2.checkSession, users_1.default);
app.use('/auth', auth_1.default);
// This endpoint must be the last one
app.get('/', status_1.default(app));
exports.default = app;
//# sourceMappingURL=app.js.map