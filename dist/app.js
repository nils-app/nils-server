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
const auth_1 = __importDefault(require("./endpoints/auth"));
const status_1 = __importDefault(require("./endpoints/status"));
const users_1 = __importDefault(require("./endpoints/users"));
// Create Express server
const app = express_1.default();
// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(compression_1.default());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(lusca_1.default.xframe('SAMEORIGIN'));
app.use(lusca_1.default.xssProtection(true));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
/**
 * Primary app routes.
 */
app.use('/users', users_1.default);
app.use('/auth', auth_1.default);
// This endpoint must be the last one
app.get('/', status_1.default(app));
exports.default = app;
//# sourceMappingURL=app.js.map