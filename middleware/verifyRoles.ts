import {ROLES_LIST} from '../config/parameters/roles-list'
import { NextFunction, Request, Response } from 'express';


interface AuthenticatedRequest extends Request {
    user?: any; 
    roles?: string[]; 
}

const verifyRoles = (...alloedRoles: any) => {
    return (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
        const rolesArray = [...alloedRoles];
        if(!req?.roles) return res.status(401);
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        if(!result) return res.status(401).json({error: "unauthorized", customeStatus: "1007"});
        next();
    };
};
export {verifyRoles, ROLES_LIST};