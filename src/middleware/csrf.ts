import { Response, Request, NextFunction } from 'express'
import jwt from 'jsonwebtoken';
import { JWT_SECRET, CSRF_EXPIRATION_MS } from '../constants';

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
    return res.status(401).send({
      error: 'Invalid CSRF Token (E.1)'
    });
  }

  // Verify the token
  try {
    const verified: any = jwt.verify(csrfToken, JWT_SECRET);
    if (verified.uuid != req.user.uuid || verified.expires > Date.now()) {
      return res.status(401).send({
        error: 'Invalid or expired CSRF Token (E.3)'
      });
    }
    next();
  } catch (e) {
    return res.status(401).send({
      error: 'Invalid CSRF Token (E.2)'
    });
  }  
};
