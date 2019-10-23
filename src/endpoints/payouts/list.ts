import { Response, Request } from 'express'

import db from '../../db';

export default async (req: Request, res: Response) => {
  const data = await db.query('SELECT uuid, amount_nils, amount_fiat, currency, created_on FROM payouts WHERE user_id = $1', [req.user.uuid]);
  res.json(data.rows)
}
