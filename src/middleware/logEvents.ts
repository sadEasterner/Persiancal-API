import { NextFunction, Request, Response } from "express";
import { format } from "date-fns";
import { LOG_TYPE } from "../config/parameters/log-types";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
const fsPromises = require("fs").promises;

const logger = async (
  type: number,
  message: string,
  logName: string,
  location = "Unknown location"
) => {
  const date = format(new Date(), "yyyyMMdd\tHH:mm:ss").toString();
  let logType: string;
  switch (type) {
    default:
      logType = "Unknown --- ";
    case LOG_TYPE.Error:
      logType = "Erro --- ";
    case LOG_TYPE.Info:
      logType = "Info --- ";
  }
  const fileName = logName + ".txt";
  const logItem = `${logType} from ${location} at ${date}:\t${message}\n`;
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "..", "logs", fileName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};
const reqLogger = (req: Request, res: Response, next: NextFunction) => {
  logger(
    LOG_TYPE.Info,
    `${req.method}\t${req.headers.origin}\t${req.url}`,
    "reqLog"
  );
  console.log(`${req.method}\t${req.path}`);
  next();
};
export { logger, LOG_TYPE, reqLogger };
