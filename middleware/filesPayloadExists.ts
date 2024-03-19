import { NextFunction , Request ,Response} from "express";
import { MulterRequest } from "../interfaces/IMulterRequest";

const filesPayloadExists = (req: Request, res: Response, next: NextFunction) => {
    if(!(req as MulterRequest).files) return res.status(400).json({message: "Missing files"});
    next();
}
module.exports = filesPayloadExists;