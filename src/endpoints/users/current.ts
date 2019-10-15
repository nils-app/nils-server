import { Response, Request, NextFunction } from 'express'

import db from '../../db'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rows } = await db.query('SELECT * FROM users')
    console.log('query returned', rows);
    res.json(rows)
  } catch (e) {
    res.status(500).send('Unable to get users')
  }
}
