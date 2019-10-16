import express from "express";
import passport from "passport";

import { Strategy as GitHubStrategy } from "passport-github2";

import { authWithProvider } from '../../lib/auth';
import { storeSession } from '../../middleware/auth';

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
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      let email = null;
      if (profile.emails && profile.emails[0]) {
        email = profile.emails[0].value;
      }
      const user_id = await authWithProvider('github', profile.id, email);
      
      return done(null, user_id);
    }
  )
);

router.get(
  "/",
  passport.authenticate("github", {
    scope: [ 'user:email' ]
  })
);

router.get(
  "/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  storeSession,
);
