import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import lusca from "lusca";
import passport from "passport";

import auth from "./endpoints/auth";
import status from "./endpoints/status";
import users from "./endpoints/users";

// API keys and Passport configuration
// import * as passportConfig from "./config/passport";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use(passport.initialize());
app.use(passport.session());

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
app.get("/", status);
app.use("/users", users);
app.use("/auth", auth);

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

export default app;