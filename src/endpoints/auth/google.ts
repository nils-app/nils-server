import express from "express";
import passport from "passport";

import { OAuth2Strategy } from "passport-google-oauth";

import { authWithProvider } from '../../lib/auth';
import { storeSession } from '../../middleware/auth';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../../constants';

export const router = express.Router();
export default router;

passport.use(
  new OAuth2Strategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback"
    },
    async (token, tokenSecret, profile, done) => {
      const verifiedEmails = profile.emails
        .filter((email: any) => email.verified)
        .map((email: any) => email.value);

      if (verifiedEmails.length < 1) {
        return done(new Error('No verified emails'), null);
      }

      const user_id = await authWithProvider('google', profile.id, verifiedEmails[0]);
      
      return done(null, user_id);
    }
  )
);

router.get(
  "/",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/userinfo.email"]
  })
);

// TODO Update redirect URL
router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  storeSession,
);
