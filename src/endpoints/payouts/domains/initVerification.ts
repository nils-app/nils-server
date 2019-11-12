import { Response, Request } from 'express'

import db from '../../../db';
import errors from '../../../lib/error';
import { genToken } from './util/token';

export default async (req: Request, res: Response) => {
  const domain: string = req.params.domain;
  const data = await db.query('SELECT uuid FROM domains WHERE domain = $1', [domain]);
  if (data.rows.length > 0) {
    return errors(res)(400, 'Domain already added, please get in touch if this is your domain');
  }
  const token = genToken(req.user.uuid, domain);
  res.json({
    token,
  })
}
