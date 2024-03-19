import { NextFunction, Request, Response } from 'express';
export const verifyEventResponse = (req: Request, res: Response, next: NextFunction) => {
    const {readBy} = req.body;
    const thisServiceKey = process.env.SERVICE_KEY;
    if(!readBy.includes(thisServiceKey)) return res.status(409).json({error: "this event is not authorized by this service."});
    next();
};
