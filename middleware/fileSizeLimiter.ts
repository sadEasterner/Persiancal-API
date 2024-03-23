import { NextFunction , Request ,Response} from "express";
import { MulterRequest } from "../interfaces/requests/IMulterRequest";

const MB = 5;
const FILE_SIZE_LIMIT = MB * 1024 * 1024;

const fileSizeLimiter = (req: Request, res: Response, next: NextFunction) => {
    const files = (req as MulterRequest).files;
    const fileOverLismit: string[]= [];
    Object.keys(files).forEach(key => {
        if(files[key].size > FILE_SIZE_LIMIT) fileOverLismit.push(files[key].name);
    }); 

    if(fileOverLismit.length) {
        const properVerb = fileOverLismit.length > 1 ? 'are' : 'is';
        const sentece = (`Upload failed. ${fileOverLismit.toString() + " " + properVerb} over the  file size limit of ${MB} MB.` as any).replaceAll(',', ', ');
        const message = fileOverLismit.length < 3 
            ? sentece.replace(',',' and')
            : sentece.replace(/,(?=[^,]*$)/, " and");
            
        return res.status(413).json({message: message});
    }
    next();
}

module.exports = fileSizeLimiter