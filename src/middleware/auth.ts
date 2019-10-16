import { Response, Request } from 'express'
import passport from 'passport';
import { Strategy as JWTstrategy, StrategyOptions as JWTStrategyOptions } from 'passport-jwt';
import jwt from 'jsonwebtoken';

import db from '../db'
import { JWT_SECRET, JWT_EXPIRATION_MS, ENV } from '../constants';

export const JWT_COOKIE = 'jwt';
const JWT_MIDDLEWARE = 'jwt';

export type JWT_PAYLOAD = {
  expires: number,
  uuid: string,
};

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
        done(null, false);
        return;
      }

      const user = data.rows[0];
      done(null, user);
    } catch (err) {
      done(err);
    }
  }),
);

export const checkSession = passport.authenticate(JWT_MIDDLEWARE, {session: false});

export const storeSession = (req: Request, res: Response) => {
  const uuid: any = req.user;
  const payload: JWT_PAYLOAD = {
    uuid,
    expires: Date.now() + parseInt(JWT_EXPIRATION_MS, 10),
  };

  const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
  const secure = ENV === 'production';
  res.cookie(JWT_COOKIE, token, { httpOnly: true, secure, });
  
  res.status(200).send({ payload });
};
