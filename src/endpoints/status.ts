import { Response, Request } from "express";

/**
 * @swagger
 * /:
 *    get:
 *      description: Get info about this API
 */
export default (req: Request, res: Response) => {
    res.json({
        version: '0.0.1',
    });
};