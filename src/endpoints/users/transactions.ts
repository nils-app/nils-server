import { Response, Request } from 'express'

import db from '../../db';

export default async (req: Request, res: Response) => {
  const data = await db.query('SELECT domains.domain, transactions.amount_nils, transactions.created_on FROM transactions LEFT JOIN domains ON domains.uuid = transactions.domain_id WHERE transactions.user_id = $1', [req.user.uuid]);
  res.json(data.rows)
}
