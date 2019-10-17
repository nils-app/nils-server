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
const passport_google_oauth_1 = require("passport-google-oauth");
const auth_1 = require("./util/auth");
const middleware_1 = require("./util/middleware");
const constants_1 = require("../../constants");
exports.router = express_1.default.Router();
exports.default = exports.router;
const PROVIDER = 'google';
if (constants_1.GOOGLE_CLIENT_ID) {
    passport_1.default.use(new passport_google_oauth_1.OAuth2Strategy({
        clientID: constants_1.GOOGLE_CLIENT_ID,
        clientSecret: constants_1.GOOGLE_CLIENT_SECRET,
        callbackURL: `${constants_1.DOMAIN}/auth/${PROVIDER}/callback`
    }, (token, tokenSecret, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
        const verifiedEmails = profile.emails
            .filter((email) => email.verified)
            .map((email) => email.value);
        if (verifiedEmails.length < 1) {
            return done(new Error('No verified emails'), null);
        }
        const user_id = yield auth_1.authWithProvider(PROVIDER, profile.id, verifiedEmails[0]);
        return done(null, user_id);
    })));
    exports.router.get("/", passport_1.default.authenticate(PROVIDER, {
        scope: ["https://www.googleapis.com/auth/userinfo.email"]
    }));
    // TODO Update redirect URL
    exports.router.get("/callback", passport_1.default.authenticate(PROVIDER, { failureRedirect: "/login" }), middleware_1.storeSession);
}
//# sourceMappingURL=google.js.map