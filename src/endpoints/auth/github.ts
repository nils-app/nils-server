import express from "express";
import passport from "passport";

import { Strategy as GitHubStrategy } from "passport-github2";

import { authWithProvider } from '../../lib/auth';

export const router = express.Router();
export default router;

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
      scope: [ 'user:email' ], // fetches non-public emails as well
    },
    (accessToken: string, refreshToken: string, profile: any, done: any) => {
      let email = null;
      if (profile.emails && profile.emails[0]) {
        email = profile.emails[0].value;
      }
      const user_id = authWithProvider('github', profile.id, email);
      
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
  passport.authenticate("github", {
    scope: [ 'user:email' ]
  })
);

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get(
  "/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);
