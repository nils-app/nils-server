import { Response, Request, NextFunction } from 'express'
import jwt from 'jsonwebtoken';

import { JWT_SECRET, CSRF_EXPIRATION_MS } from '../constants';
import errors from '../endpoints/auth/lib/error';

export const CSRF_HEADER = 'X-CSRF-Token';
const CSRF_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

type CSRFPayload = {
  uuid: string,
  type: 'csrf',
  expires: number,
};

export const generateCSRFToken = (uuid: string): string => {
  const payload: CSRFPayload = {
    uuid,
    type: 'csrf',
    expires: Date.now() + parseInt(CSRF_EXPIRATION_MS, 10),
  };
  return jwt.sign(JSON.stringify(payload), JWT_SECRET);
};

export const checkCSRF = (req: Request, res: Response, next: NextFunction) => {
  const csrfToken = req.header(CSRF_HEADER);
  if (CSRF_METHODS.indexOf(req.method) < 0) {
    next();
    return;
  }

  if (!csrfToken || !req.user) {
    return errors(res)(401, 'Invalid CSRF Token (E.1)');
  }

  // Verify the token
  try {
    const verified: any = jwt.verify(csrfToken, JWT_SECRET);
    if (verified.uuid != req.user.uuid || verified.expires > Date.now()) {
      return errors(res)(401, 'Invalid CSRF Token (E.2)');
    }
    next();
  } catch (e) {
    return errors(res)(401, 'Invalid CSRF Token (E.3)');
  }  
};
