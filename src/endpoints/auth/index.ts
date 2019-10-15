import express from 'express'
import passport from "passport";

import google from './google'
import github from './github'

export const router = express.Router()
export default router

router.use('/google', google)
router.use('/github', github)

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  done(null, id);
});
