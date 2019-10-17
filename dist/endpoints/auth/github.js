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
const passport_github2_1 = require("passport-github2");
const auth_1 = require("./util/auth");
const middleware_1 = require("./util/middleware");
const constants_1 = require("../../constants");
exports.router = express_1.default.Router();
exports.default = exports.router;
exports.PROVIDER = 'github';
if (constants_1.GITHUB_CLIENT_ID) {
    passport_1.default.use(new passport_github2_1.Strategy({
        clientID: constants_1.GITHUB_CLIENT_ID,
        clientSecret: constants_1.GITHUB_CLIENT_SECRET,
        callbackURL: `${constants_1.DOMAIN}/auth/${exports.PROVIDER}/callback`,
        scope: ['user:email'],
    }, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
        let email = null;
        if (profile.emails && profile.emails[0]) {
            email = profile.emails[0].value;
        }
        const user_id = yield auth_1.authWithProvider(exports.PROVIDER, profile.id, email);
        return done(null, user_id);
    })));
    exports.router.get('/', (req, res, next) => {
        const { returnTo } = req.query;
        const state = returnTo
            ? Buffer.from(JSON.stringify({ returnTo })).toString('base64')
            : undefined;
        passport_1.default.authenticate(exports.PROVIDER, { scope: ['user:email'], state })(req, res, next);
    });
    exports.router.get("/callback", passport_1.default.authenticate(exports.PROVIDER, { failureRedirect: "/" }), middleware_1.storeSession);
}
//# sourceMappingURL=github.js.map