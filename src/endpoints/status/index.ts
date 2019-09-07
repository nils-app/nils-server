import { Response, Request } from "express";

export default (req: Request, res: Response) => {
    res.json({
        version: '0.0.1',
    });
};