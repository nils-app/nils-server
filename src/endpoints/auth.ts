import express from "express";
import passport from "passport";

import { OAuth2Strategy } from "passport-google-oauth";

export const router = express.Router();
export default router;

passport.use(new OAuth2Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(token, tokenSecret, profile, done) {
      console.log('User logged in!', profile);
      const verifiedEmails = profile.emails.filter((email: any) => email.verified);
      if (verifiedEmails.length < 1) {
          return done(new Error("No verified emails"), null);
      }
      // TODO Get/Generate a user id from the DB
      const userId = 1234;
      return done(null, userId);
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
    // if you use Model.id as your idAttribute maybe you'd want
    // done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // I guess get the user email?
  done(null, id);
});

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get('/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.email'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });