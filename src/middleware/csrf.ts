import { Response, Request, NextFunction } from 'express'
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../constants';

const CSRF_HEADER = 'X-CSRF-Token';
const CSRF_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

export const checkCSRF = (req: Request, res: Response, next: NextFunction) => {
  const csrfToken = req.header(CSRF_HEADER);
  const user: any = req.user;
  if (CSRF_METHODS.indexOf(req.method) < 0) {
    next();
    return;
  }

  if (!csrfToken || !user) {
    res.status(401).send({
      error: 'Invalid CSRF Token (E.1)'
    });
    return;
  }

  // Verify the token
  try {
    const verified = jwt.verify(csrfToken, JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).send({
      error: 'Invalid CSRF Token (E.2)'
    });
    return;
  }  
};
