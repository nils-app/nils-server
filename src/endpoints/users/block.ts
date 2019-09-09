import { Response, Request } from "express";

export default (req: Request, res: Response) => {
    res.json({
        done: true,
    });
};