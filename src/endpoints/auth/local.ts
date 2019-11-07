import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import { demoAuth } from "./util/auth";
import { storeSession } from "./util/middleware";

export const router = express.Router();
export default router;

const PROVIDER = 'local';

passport.use(new LocalStrategy(
  async (username: string, password: string, done) => {
    if (username !== 'demo' || password !== 'demo') {
      return done('Invalid username/password');
    }
    const user_id = await demoAuth();
    return done(null, user_id);
  }
));

router.get('/demo', (req, res, next) => {
    req.body.username = 'demo';
    req.body.password = 'demo';

    const { returnTo } = req.query
    const state = returnTo
      ? Buffer.from(JSON.stringify({ returnTo })).toString('base64')
      : undefined
    
    passport.authenticate(PROVIDER, { failureRedirect: '/', state })(req, res, next);
  },
  storeSession,
);

router.post('/', 
  (req, res, next) => {
    const { returnTo } = req.query
    const state = returnTo
      ? Buffer.from(JSON.stringify({ returnTo })).toString('base64')
      : undefined

    passport.authenticate(PROVIDER, { failureRedirect: '/', state })(req, res, next);
  },
  storeSession,
);
