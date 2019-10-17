import { Response, Request } from 'express'
import jwt from 'jsonwebtoken';

import { JWT_SECRET, JWT_EXPIRATION_MS, ENV } from '../../../constants';
import { JWT_PAYLOAD } from '../../../middleware/auth';

export const JWT_COOKIE = 'jwt';

export const storeSession = (req: Request, res: Response) => {
  const uuid: any = req.user;
  const payload: JWT_PAYLOAD = {
    uuid,
    expires: Date.now() + parseInt(JWT_EXPIRATION_MS, 10),
  };

  const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
  const secure = ENV === 'production';
  res.cookie(JWT_COOKIE, token, { httpOnly: true, secure, });

  // Check for any redirection path set when logging in
  try {
    const { state } = req.query
    const { returnTo } = JSON.parse(new Buffer(state, 'base64').toString())
    if (typeof returnTo === 'string') {
      return res.redirect(returnTo)
    }
  } catch {}
  res.redirect('/')
};
