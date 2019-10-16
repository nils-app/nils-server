import express from "express";
import passport from "passport";

import { Strategy as GitHubStrategy } from "passport-github2";

import { authWithProvider } from '../../lib/auth';
import { storeSession } from '../../middleware/auth';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, DOMAIN } from '../../constants';

export const router = express.Router();
export default router;

export const PROVIDER = 'github';

if (GITHUB_CLIENT_ID) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: `${DOMAIN}/auth/${PROVIDER}/callback`,
        scope: [ 'user:email' ],
      },
      async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        let email = null;
        if (profile.emails && profile.emails[0]) {
          email = profile.emails[0].value;
        }
        const user_id = await authWithProvider(PROVIDER, profile.id, email);
        
        return done(null, user_id);
      }
    )
  );
  
  router.get(
    "/",
    passport.authenticate(PROVIDER, {
      scope: [ 'user:email' ]
    })
  );
  
  router.get(
    "/callback",
    passport.authenticate(PROVIDER, { failureRedirect: "/login" }),
    storeSession,
  );
  
}
