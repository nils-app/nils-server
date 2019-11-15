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
const passport = require("passport");
const passport_jwt_1 = require("passport-jwt");
const db_1 = __importDefault(require("../db"));
const constants_1 = require("../constants");
const middleware_1 = require("../endpoints/auth/util/middleware");
exports.JWT_MIDDLEWARE = 'jwt';
/**
 * Middleware to check whether the user is authenticated with a JWT cookie
 */
exports.checkSession = passport.authenticate(exports.JWT_MIDDLEWARE, {
    session: false,
    failWithError: true,
});
const opts = {
    jwtFromRequest: (req) => req.cookies ? req.cookies[middleware_1.JWT_COOKIE] : null,
    secretOrKey: constants_1.JWT_SECRET,
};
passport.use(exports.JWT_MIDDLEWARE, new passport_jwt_1.Strategy(opts, (jwtPayload, done) => __awaiter(void 0, void 0, void 0, function* () {
    if (Date.now() > jwtPayload.expires) {
        return done('Session expired');
    }
    const uuid = jwtPayload.uuid;
    if (!uuid) {
        return done('Invalid user, please login again');
    }
    try {
        const data = yield db_1.default.query('SELECT uuid, balance, transferwise_id, currency, created_on FROM users WHERE uuid = $1', [uuid]);
        if (data.rows.length < 1) {
            done(null, 'Please login again');
            return;
        }
        const user = data.rows[0];
        done(null, user);
    }
    catch (err) {
        console.error(err);
        done(err);
    }
})));
//# sourceMappingURL=auth.js.map