import { NextFunction , Request ,Response} from "express";

import { ALLOWED_ORIGINS } from "../config/parameters/allowed-origins";

export const credentials = (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin as string;
    if (ALLOWED_ORIGINS.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    next();
}
