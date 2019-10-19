import { Response, Request } from 'express'
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../../constants';
import db from '../../db';
import errors from '../auth/lib/error';

export default async (req: Request, res: Response) => {
  const domain: string = req.params.domain;
  const data = await db.query('SELECT uuid FROM domains WHERE domain = $1', [domain]);
  if (data.rows.length > 0) {
    return errors(res)(400, 'Domain already added, please get in touch if this is your domain');
  }
  const token = jwt.sign(JSON.stringify(domain), JWT_SECRET);
  res.json({
    token,
  })
}
