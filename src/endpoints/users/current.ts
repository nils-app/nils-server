import { Response, Request, NextFunction } from 'express'

export default async (req: Request, res: Response, next: NextFunction) => {
  res.json(req.user);
}
