import { ROLES_LIST } from "../config/parameters/roles-list";
import { NextFunction, Request, Response } from "express";
import { LOG_TYPE, logger } from "./logEvents";
import { AuthenticatedRequest } from "../interfaces/requests/IAuthenticatedRequest";

const verifyRoles = (...alloedRoles: any) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const rolesArray = [...alloedRoles];
    if (!req.currentRole) {
      logger(
        LOG_TYPE.Error,
        "user have no roles",
        "middleware",
        "middleware/verifyRoles/line-15"
      );
      return res.status(401);
    }
    const result = rolesArray.includes(req.currentRole);
    if (!result) {
      logger(
        LOG_TYPE.Error,
        "user have no access",
        "middleware",
        "middleware/verifyRoles/line-20"
      );
      return res.status(403).json({ message: "user have no access" });
    }
    next();
  };
};
export { verifyRoles, ROLES_LIST };
