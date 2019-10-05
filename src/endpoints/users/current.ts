import { Response, Request } from "express";

export default (req: Request, res: Response) => {
    res.json({
        uuid: 123,
        email: 'something@gmail.com',
    });
};