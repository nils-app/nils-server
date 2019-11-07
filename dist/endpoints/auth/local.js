"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const auth_1 = require("./util/auth");
const middleware_1 = require("./util/middleware");
exports.router = express_1.default.Router();
exports.default = exports.router;
const PROVIDER = 'local';
passport_1.default.use(new passport_local_1.Strategy((username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    if (username !== 'demo' || password !== 'demo') {
        return done('Invalid username/password');
    }
    const user_id = yield auth_1.demoAuth();
    return done(null, user_id);
})));
exports.router.get('/demo', (req, res, next) => {
    req.body.username = 'demo';
    req.body.password = 'demo';
    const { returnTo } = req.query;
    const state = returnTo
        ? Buffer.from(JSON.stringify({ returnTo })).toString('base64')
        : undefined;
    passport_1.default.authenticate(PROVIDER, { failureRedirect: '/', state })(req, res, next);
}, middleware_1.storeSession);
exports.router.post('/', (req, res, next) => {
    const { returnTo } = req.query;
    const state = returnTo
        ? Buffer.from(JSON.stringify({ returnTo })).toString('base64')
        : undefined;
    passport_1.default.authenticate(PROVIDER, { failureRedirect: '/', state })(req, res, next);
}, middleware_1.storeSession);
//# sourceMappingURL=local.js.map