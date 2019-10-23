import { Response, Request } from 'express'

import db from '../../db';
import errors from '../../lib/error';


export default async (req: Request, res: Response) => {
  const domain: string = req.params.uuid;
  const data = await db.query('DELETE FROM domains WHERE user_id = $1 AND uuid = $2 RETURNING uuid', [req.user.uuid, domain]);
  if (data.rows.length < 1) {
    return errors(res)(400, 'Domain not deleted, please try again later');
  }
  return res.status(204).send();
}
