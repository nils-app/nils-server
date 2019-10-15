import express from "express";
import passport from "passport";

import { OAuth2Strategy } from "passport-google-oauth";

import { authWithProvider } from '../../lib/auth';

export const router = express.Router();
export default router;

passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback"
    },
    (token, tokenSecret, profile, done) => {
      const verifiedEmails = profile.emails
        .filter((email: any) => email.verified)
        .map((email: any) => email.value);

      if (verifiedEmails.length < 1) {
        return done(new Error('No verified emails'), null);
      }

      const user_id = authWithProvider('google', profile.id, verifiedEmails[0]);
      
      return done(null, user_id);
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get(
  "/",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/userinfo.email"]
  })
);

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);
