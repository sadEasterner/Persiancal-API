import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { logger, LOG_TYPE } from "./logEvents";
import { AuthenticatedRequest } from "../src/interfaces/requests/IAuthenticatedRequest";

export const verifyJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  let authHeader: string | undefined;
  if (
    req.headers.authorization &&
    typeof req.headers.authorization === "string"
  ) {
    authHeader = req.headers.authorization;
  } else if (
    req.headers.Authorization &&
    typeof req.headers.Authorization === "string"
  ) {
    authHeader = req.headers.Authorization;
  }
  if (!authHeader?.startsWith("Bearer")) {
    logger(
      LOG_TYPE.Error,
      "token does not exist in header",
      "middleware",
      "middleware/verifyJWT/line-19"
    );
    return res.sendStatus(401);
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err, decoded) => {
      if (err) {
        logger(
          LOG_TYPE.Error,
          "token is not valid",
          "middleware",
          "middleware/verifyJWT/line-29"
        );
        return res.status(403).json({ message: "invalid token" }); //invalid token
        // return res.sendStatus(403); //invalid token
      }
      req.currentUsername = (decoded as any).UserInfo.username;
      req.currentRole = (decoded as any).UserInfo.role;
      next();
    }
  );
};
