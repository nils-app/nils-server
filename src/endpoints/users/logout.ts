import { Response, Request } from 'express'

import { JWT_COOKIE } from '../auth/util/middleware'
import { DOMAIN_FRONTEND } from '../../constants';

export default (req: Request, res: Response) => {
  res.clearCookie(JWT_COOKIE);
  res.redirect(DOMAIN_FRONTEND);
}
