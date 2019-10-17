import passport = require("passport");
import { Response, Request } from 'express'
import { Strategy as JWTstrategy, StrategyOptions as JWTStrategyOptions } from 'passport-jwt';

import db from '../db'
import { JWT_SECRET } from "../constants";
import { JWT_COOKIE } from "../endpoints/auth/util/middleware";

export type JWT_PAYLOAD = {
  expires: number,
  uuid: string,
};
export const JWT_MIDDLEWARE = 'jwt';
export const checkSession = passport.authenticate(JWT_MIDDLEWARE, {session: false});

const opts: JWTStrategyOptions = {
  jwtFromRequest: (req: Request) => req.cookies ? req.cookies[JWT_COOKIE] : null,
  secretOrKey: JWT_SECRET,
};

passport.use(
  JWT_MIDDLEWARE,
  new JWTstrategy(opts, async (jwtPayload: JWT_PAYLOAD, done) => {
    if (Date.now() > jwtPayload.expires) {
      return done('Session expired');
    }
    const uuid = jwtPayload.uuid;
    if (!uuid) {
      return done('Invalid user, please login again');
    }

    try {
      const data = await db.query('SELECT uuid, balance, created_on FROM users WHERE uuid = $1', [uuid]);

      if (data.rows.length < 1) {
        done(null, 'Please login again');
        return;
      }

      const user = data.rows[0];
      done(null, user);
    } catch (err) {
      done(err);
    }
  }),
);
