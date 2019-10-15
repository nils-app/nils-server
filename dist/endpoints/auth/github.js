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
exports.router.get("/", passport_1.default.authenticate("github", {
    scope: ['user:email']
}));
exports.router.get("/callback", passport_1.default.authenticate("github", { failureRedirect: "/login" }), (req, res) => {
    res.redirect("/");
});
//# sourceMappingURL=github.js.map