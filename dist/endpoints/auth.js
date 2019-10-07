'use strict'
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { default: mod }
}
Object.defineProperty(exports, '__esModule', { value: true })
const express_1 = __importDefault(require('express'))
const passport_1 = __importDefault(require('passport'))
const passport_google_oauth_1 = require('passport-google-oauth')
exports.router = express_1.default.Router()
exports.default = exports.router
passport_1.default.use(new passport_google_oauth_1.OAuth2Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/callback'
}, function (token, tokenSecret, profile, done) {
  console.log('User logged in!', profile)
  const verifiedEmails = profile.emails.filter((email) => email.verified)
  if (verifiedEmails.length < 1) {
    return done(new Error('No verified emails'), null)
  }
  // TODO Get/Generate a user id from the DB
  const userId = 1234
  return done(null, userId)
}))
passport_1.default.serializeUser(function (user, done) {
  done(null, user)
  // if you use Model.id as your idAttribute maybe you'd want
  // done(null, user.id);
})
passport_1.default.deserializeUser(function (id, done) {
  // I guess get the user email?
  done(null, id)
})
// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
exports.router.get('/google', passport_1.default.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.email'] }))
// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
exports.router.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/login' }), function (req, res) {
  res.redirect('/')
})
// # sourceMappingURL=auth.js.map
