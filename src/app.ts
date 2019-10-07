import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import lusca from 'lusca'
import passport from 'passport'

import auth from './endpoints/auth'
import status from './endpoints/status'
import users from './endpoints/users'

// Create Express server
const app = express()

// Express configuration
app.set('port', process.env.PORT || 3000)

app.use(compression())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))

app.use(passport.initialize())
app.use(passport.session())

/**
 * Primary app routes.
 */
app.use('/users', users)
app.use('/auth', auth)

// This endpoint must be the last one
app.get('/', status(app))

export default app
