import express, { Request, Response, NextFunction } from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import lusca from 'lusca'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import auth from './endpoints/auth'
import status from './endpoints/status'
import users from './endpoints/users'
import domains from './endpoints/payouts/domains'
import payouts from './endpoints/payouts'
import { checkCSRF, CSRF_HEADER } from './middleware/csrf'
import { PORT, ENV, DOMAIN_FRONTEND } from './constants'
import { checkSession } from './middleware/auth'

// Create Express server
const app = express()

// Express configuration
app.set('port', PORT)
app.set('env', ENV)

app.use(compression())

const corsOptions: cors.CorsOptions = {
  origin: DOMAIN_FRONTEND,
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

app.use((req, res, next) => {
  console.log(req.method, req.path, JSON.stringify(req.body));
  next();
});

/**
 * Routes
 */
app.use('/users', checkSession, checkCSRF, users)
app.use('/domains', checkSession, checkCSRF, domains)
app.use('/payouts', checkSession, checkCSRF, payouts)
app.use('/auth', auth)

// This endpoint must be the last one
app.get('/', status(app))

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  if (err && err.status) {
    return res.status(err.status).json({
      errors: err.message,
    });
  }
  res.status(500).json({
    errors: 'An error occurred',
  });
});

export default app
