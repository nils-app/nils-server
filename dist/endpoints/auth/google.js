"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth_1 = require("passport-google-oauth");
const auth_1 = require("../../lib/auth");
exports.router = express_1.default.Router();
exports.default = exports.router;
passport_1.default.use(new passport_google_oauth_1.OAuth2Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
}, (token, tokenSecret, profile, done) => {
    const verifiedEmails = profile.emails
        .filter((email) => email.verified)
        .map((email) => email.value);
    if (verifiedEmails.length < 1) {
        return done(new Error('No verified emails'), null);
    }
    const user_id = auth_1.authWithProvider('google', profile.id, verifiedEmails[0]);
    return done(null, user_id);
}));
exports.router.get("/", passport_1.default.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/userinfo.email"]
}));
// TODO Update redirect URL
exports.router.get("/callback", passport_1.default.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
    res.redirect("/");
});
//# sourceMappingURL=google.js.map