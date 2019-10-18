import express from 'express'
import passport from "passport";

import google from './google'
import github from './github'

export const router = express.Router()
export default router

router.use('/google', google)
router.use('/github', github)

passport.serializeUser((userId: string, done) => {
  done(null, userId);
});

passport.deserializeUser((userId: string, done) => {
  done(null, userId);
});
