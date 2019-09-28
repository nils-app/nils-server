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
// API keys and Passport configuration
// import * as passportConfig from "./config/passport";
// Create Express server
const app = express_1.default();
// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression_1.default());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(lusca_1.default.xframe("SAMEORIGIN"));
app.use(lusca_1.default.xssProtection(true));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// app.use((req, res, next) => {
//     res.locals.user = req.user;
//     next();
// });
// app.use((req, res, next) => {
//     // After successful login, redirect back to the intended page
//     if (!req.user &&
//     req.path !== "/login" &&
//     req.path !== "/signup" &&
//     !req.path.match(/^\/auth/) &&
//     !req.path.match(/\./)) {
//         req.session.returnTo = req.path;
//     } else if (req.user &&
//     req.path == "/account") {
//         req.session.returnTo = req.path;
//     }
//     next();
// });
/**
 * Primary app routes.
 */
app.get("/", status_1.default);
app.use("/users", users_1.default);
app.use("/auth", auth_1.default);
// /**
//  * API examples routes.
//  */
// app.get("/api", apiController.getApi);
// app.get("/api/facebook", passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);
// /**
//  * OAuth authentication routes. (Sign in)
//  */
// app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email", "public_profile"] }));
// app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
//     res.redirect(req.session.returnTo || "/");
// });
exports.default = app;
//# sourceMappingURL=app.js.map