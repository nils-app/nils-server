import { Response, Request, NextFunction } from 'express'

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
        return next();
    }

    res.status(401).send('You must login to use this resource.');
};
