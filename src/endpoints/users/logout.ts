import { Response, Request } from 'express'

import { JWT_COOKIE } from '../auth/util/middleware'

export default (req: Request, res: Response) => {
  res.clearCookie(JWT_COOKIE);
  res.status(204).send();
}
