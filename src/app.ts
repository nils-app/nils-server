import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import lusca from 'lusca'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import auth from './endpoints/auth'
import status from './endpoints/status'
import users from './endpoints/users'
import domains from './endpoints/domains'
import { checkCSRF, CSRF_HEADER } from './middleware/csrf'
import { PORT, ENV } from './constants'
import { checkSession } from './middleware/auth'

// Create Express server
const app = express()

// Express configuration
app.set('port', PORT)
app.set('env', ENV)

app.use(compression())

const corsOptions: cors.CorsOptions = {
  origin: true,
  credentials: true,
  exposedHeaders: [CSRF_HEADER],
}
app.use(cors(corsOptions))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Session management
app.use(passport.initialize())
app.use(cookieParser())

// Security settings
app.use(lusca.xssProtection(true))
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.nosniff())
app.disable('x-powered-by')

/**
 * Primary app routes.
 */
app.use('/users', checkSession, checkCSRF, users)
app.use('/domains', checkSession, checkCSRF, domains)
app.use('/auth', auth)

// This endpoint must be the last one
app.get('/', status(app))

export default app
