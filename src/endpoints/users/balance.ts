import { Response, Request } from 'express'

import errors from '../../endpoints/auth/lib/error';
import db from '../../db';

export default async (req: Request, res: Response) => {
  let data = await db.query('SELECT balance FROM users WHERE uuid = $1', [req.user.uuid]);
  if (data.rows.length < 1) {
    return errors(res)(404, 'Balance not found!');
  }
  const balances: any = {
    personal: data.rows[0].balance,
    domains: [],
  };

  data = await db.query('SELECT uuid, domain, balance FROM domains WHERE user_id = $1', [req.user.uuid]);
  balances.domains = data.rows;

  res.json(balances)
}
