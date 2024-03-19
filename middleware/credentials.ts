import { NextFunction , Request ,Response} from "express";

const ALLOWED_ORIGINS = require("../config/parameters/allowed-origins");


export const credentials = (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin as string;
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    next();
}
