import path from "path";
import { NextFunction , Request ,Response} from "express";
import { MulterRequest } from "../interfaces/IMulterRequest";

const fileExtLimiter = (allowedExtArray: string | string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const files = (req as MulterRequest).files;
        const fileExtentions: string[] = [];

        Object.keys(files).forEach(key => {
            fileExtentions.push(path.extname(files[key].name));
        });
        const isFileExtentionAllowed = fileExtentions.every(ext => allowedExtArray.includes(ext));
        if(!isFileExtentionAllowed) {
            return res.status(415).json({message: "Unsupported media type"});
        }
        next();
    }
}
export default fileExtLimiter