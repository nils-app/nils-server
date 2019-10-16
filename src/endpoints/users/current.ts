import { Response, Request, NextFunction } from 'express'
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../../constants';

export default async (req: Request, res: Response, next: NextFunction) => {
  const user: any = req.user;
  const csrf = jwt.sign(JSON.stringify({ uuid: user.uuid, type: 'csrf'  }), JWT_SECRET);
  const payload = {
    user,
    csrf,
  };
  res.json(payload);
}
