import { Response, Request, NextFunction } from 'express'

import { CSRF_HEADER, generateCSRFToken } from '../../middleware/csrf';

export default (req: Request, res: Response, next: NextFunction) => {
  const csrf = generateCSRFToken(req.user.uuid);
  const payload = {
    user: req.user,
    csrf,
  };
  res.header(CSRF_HEADER, csrf).json(payload);
}
