import { Response, Request, NextFunction } from 'express'

import { CSRF_HEADER, generateCSRFToken } from '../../middleware/csrf';

export default async (req: Request, res: Response, next: NextFunction) => {
  const user: any = req.user;
  const csrf = generateCSRFToken(user.uuid);
  const payload = {
    user,
    csrf,
  };
  res.header(CSRF_HEADER, csrf).json(payload);
}
