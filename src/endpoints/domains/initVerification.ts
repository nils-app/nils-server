import { Response, Request } from 'express'
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../../constants';

export default (req: Request, res: Response) => {
  const domain: string = req.params.domain;
  const token = jwt.sign(JSON.stringify(domain), JWT_SECRET);
  res.json({
    token,
  })
}
