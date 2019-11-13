import { Response, Request } from 'express'

import db from '../../db';

export default async (req: Request, res: Response) => {
  const data = await db.query('UPDATE users SET balance = balance + 10 WHERE uuid = $1 RETURNING *', [req.user.uuid]);
  res.json(data.rows)
}
