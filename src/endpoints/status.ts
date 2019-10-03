import { Response, Request } from "express";
import listEndpoints from "express-list-endpoints";

export default (app: any) => (req: Request, res: Response) => {
    res.json({
        version: '0.0.1',
        endpoints: listEndpoints(app),
    });
};