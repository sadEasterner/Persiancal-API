import { Op, where } from "sequelize";
import { NextFunction , Request ,Response} from "express";
import { User } from "../interfaces/user/IUser";
import { MulterRequest } from "../interfaces/requests/IMulterRequest";
import { Filter, Paging, sortItem } from "../interfaces/filtering/IFilter";
import { LOG_TYPE, logger } from "../middleware/logEvents";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';


const signup = async(req:Request , res: Response) => {
    const { address, emial, name, password, username }: User = req.body;

}
const login = async(req:Request , res: Response) => {
    const { password, username }: User = req.body;

}
const logout = async(req:Request , res: Response) => {
    const { username }: User = req.body;

}
const forgetPassword = async(req:Request , res: Response) => {
    const { emial, password, username }: User = req.body;
    
}
export default {signup, login, logout, forgetPassword};