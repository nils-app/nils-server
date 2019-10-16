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
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const constants_1 = require("../constants");
exports.JWT_COOKIE = 'jwt';
const JWT_MIDDLEWARE = 'jwt';
const opts = {
    jwtFromRequest: (req) => req.cookies ? req.cookies[exports.JWT_COOKIE] : null,
    secretOrKey: constants_1.JWT_SECRET,
};
passport_1.default.use(JWT_MIDDLEWARE, new passport_jwt_1.Strategy(opts, (jwtPayload, done) => __awaiter(void 0, void 0, void 0, function* () {
    if (Date.now() > jwtPayload.expires) {
        return done('Session expired');
    }
    const uuid = jwtPayload.uuid;
    if (!uuid) {
        return done('Invalid user, please login again');
    }
    try {
        const data = yield db_1.default.query('SELECT uuid, balance, created_on FROM users WHERE uuid = $1', [uuid]);
        if (data.rows.length < 1) {
            done(null, false);
            return;
        }
        const user = data.rows[0];
        done(null, user);
    }
    catch (err) {
        done(err);
    }
})));
exports.checkSession = passport_1.default.authenticate(JWT_MIDDLEWARE, { session: false });
exports.storeSession = (req, res) => {
    const uuid = req.user;
    const payload = {
        uuid,
        expires: Date.now() + parseInt(constants_1.JWT_EXPIRATION_MS, 10),
    };
    const token = jsonwebtoken_1.default.sign(JSON.stringify(payload), constants_1.JWT_SECRET);
    const secure = constants_1.ENV === 'production';
    res.cookie(exports.JWT_COOKIE, token, { httpOnly: true, secure, });
    res.status(200).send({ payload });
};
//# sourceMappingURL=auth.js.map