import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    currentUsername?: string; 
    currentRole?: number; 
}