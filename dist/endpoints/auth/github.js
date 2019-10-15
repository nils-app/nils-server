"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const passport_github2_1 = require("passport-github2");
const auth_1 = require("../../lib/auth");
exports.router = express_1.default.Router();
exports.default = exports.router;
passport_1.default.use(new passport_github2_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback",
    scope: ['user:email'],
}, (accessToken, refreshToken, profile, done) => {
    let email = null;
    if (profile.emails && profile.emails[0]) {
        email = profile.emails[0].value;
    }
    const user_id = auth_1.authWithProvider('github', profile.id, email);
    return done(null, user_id);
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((id, done) => {
    done(null, id);
});
// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
exports.router.get("/", passport_1.default.authenticate("github", {
    scope: ['user:email']
}));
// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
exports.router.get("/callback", passport_1.default.authenticate("github", { failureRedirect: "/login" }), (req, res) => {
    res.redirect("/");
});
//# sourceMappingURL=github.js.map