import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';


interface AuthenticatedRequest extends Request {
    user?: any; 
    roles?: string[]; 
}

export const verifyJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let authHeader: string | undefined;
    if (req.headers.authorization && typeof req.headers.authorization === 'string') {
        authHeader = req.headers.authorization;
    } else if (req.headers.Authorization && typeof req.headers.Authorization === 'string') {
        authHeader = req.headers.Authorization;
    }
    if (!authHeader?.startsWith('Bearer')) return res.sendStatus(401);

    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
        (err, decoded) => {
            if(err) return res.sendStatus(403); //invalid token
            req.user = (decoded as any).UserInfo.username;
            req.roles = (decoded as any).UserInfo.roles;
            next();
        }
    )
};
