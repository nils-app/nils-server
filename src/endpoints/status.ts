import { Response, Request } from "express";
import listEndpoints from "express-list-endpoints";

var pjson = require('../../package.json');

export default (app: any) => (req: Request, res: Response) => {
    res.json({
        version: pjson.version,
        endpoints: listEndpoints(app),
    });
};