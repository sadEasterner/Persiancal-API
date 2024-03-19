import { Request } from "express";
export interface MulterRequest extends Request {
    files: any;
}