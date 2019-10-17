import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import lusca from 'lusca'
import passport from 'passport'
import cookieParser from 'cookie-parser'

import auth from './endpoints/auth'
import status from './endpoints/status'
import users from './endpoints/users'
import { checkCSRF } from './middleware/csrf'
import { PORT, ENV } from './constants'
import { checkSession } from './middleware/auth'

// Create Express server
const app = express()

// Express configuration
app.set('port', PORT)
app.set('env', ENV)

app.use(compression())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Session management
app.use(passport.initialize())
app.use(cookieParser())

// Security settings
app.use(lusca.xssProtection(true))
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.nosniff());

/**
 * Primary app routes.
 */
app.use('/users', checkSession, checkCSRF, users)
app.use('/auth', auth)

// This endpoint must be the last one
app.get('/', status(app))

export default app
