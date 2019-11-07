import express from "express";
import passport from "passport";

import { OAuth2Strategy } from "passport-google-oauth";

import { authWithProvider, setupRoutes } from './util/auth';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, DOMAIN } from '../../constants';

export const router = express.Router();
export default router;

const PROVIDER = 'google';
const SCOPE = ["https://www.googleapis.com/auth/userinfo.email"];

if (GOOGLE_CLIENT_ID) {
  passport.use(
    new OAuth2Strategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: `${DOMAIN}/auth/${PROVIDER}/callback`
      },
      async (token, tokenSecret, profile, done) => {
        const verifiedEmails = profile.emails
          .filter((email: any) => email.verified)
          .map((email: any) => email.value);
  
        if (verifiedEmails.length < 1) {
          return done(new Error('No verified emails'), null);
        }
  
        const user_id = await authWithProvider(PROVIDER, profile.id, verifiedEmails[0]);
        
        return done(null, user_id);
      }
    )
  );

  setupRoutes(router, PROVIDER, SCOPE);
}
