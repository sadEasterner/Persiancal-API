// require('dotenv').config();
const Users = require('../models/users');
import { Op, where } from "sequelize";
import { NextFunction , Request ,Response} from "express";
import { MulterRequest } from "../interfaces/requests/IMulterRequest";
import { User } from "../interfaces/user/IUser";
import { Filter, Paging, sortItem } from "../interfaces/filtering/IFilter";
import { LOG_TYPE, logger } from "../middleware/logEvents";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import jwt from 'jsonwebtoken';
import { ROLES_LIST } from "../config/parameters/roles-list";
import { UserInfo } from "../interfaces/user/IUserInfo";
import { USER_STATUS } from "../config/parameters/user-status";
import { AuthenticatedRequest } from "../interfaces/requests/IAuthenticatedRequest";


const createUser = async(req:Request , res: Response) => {
    const { address, email, name, password, username }: User = req.body;
    if(!username) return res.status(400).json({message: 'Username is required'});
    if(!password) return res.status(400).json({message: 'Password is required'});
    if(!email) return res.status(400).json({message: 'Email is required'});
    if(!address) return res.status(400).json({message: 'Address is required'});
    if(!name) return res.status(400).json({message: 'Name is required'});
    const duplicate = await Users.findOne({ where: { username: username } });
    if(duplicate)  return res.status(409).json({ message: 'User by this username already exists'});
    try {
        const result = await Users.create({
            username: username,
            email: email,
            password: password,
            address: address,
            name: name,
            refreshToken: ""
        })
        if(!result) return res.status(500).json({message: "server error"});
        return res.status(201).json({data: `user name by this username: ${result.username} created`});
    } catch (error) {
        console.log(error);
        logger(LOG_TYPE.Error, `${error}`, "error",'userController/createUser');
    }
};
const editUser = async(req:Request , res: Response) => {
    const { address, email, name, password, username }: User = req.body;
 
    const foundUser = await Users.findOne({ where: { username: username } });
    if(!foundUser) return res.status(401).json({message: "Username does not exist"});
    try {
        //if(username) foundUser.username = username;
        if(password) foundUser.password = password;
        if(email) foundUser.email = email;
        if(address) foundUser.address = address;
        if(name) foundUser.name = name;
        const result = await foundUser.save();
        if(!result) return res.status(500).json({message: "server error"});
        return res.status(201).json({data: `user name by this username: ${result.username} updated`});
    } catch (error) {
        console.log(error);
        logger(LOG_TYPE.Error, `${error}`, "error",'userController/editUser');
    }
};
const changeUserStatus = async(req:Request , res: Response) => {
    const { username, userStatus }: UserInfo = req.body;
    const validUserStatusTochange = Object.entries(USER_STATUS).map(([key, value]) => value );
    if(!validUserStatusTochange.includes(userStatus) && userStatus) return res.status(400).json({message: 'UserStatus is invalid'});
    const httpMethod = req.method;

    try {

        const foundUser = await Users.findOne({ where: { username: username }});

        if(!foundUser) return res.status(401).json({message: "Username does not exist"});
        if(userStatus) foundUser.userStatus = userStatus;
        if(httpMethod === "DELETE") foundUser.userStatus = USER_STATUS.Deleted;
        
        const result = await foundUser.save();
        if(!result) return res.status(500).json({message: "server error"});

        return res.status(201).json({data: `user name by this username: ${result.username} updated`});
    } catch (error) {
        console.log(error);
        logger(LOG_TYPE.Error, `${error}`, "error",'userController/changeUserStatus');
    }
};
const getUserByUsername = async(req:AuthenticatedRequest , res: Response) => {
    const { username } = req.params;

    if(!username) return res.status(400).json({message: 'Username is required'});
    if(!(req.currentRole === ROLES_LIST.Admin || req.currentUsername === username)) return res.status(403).json({message: 'Forbidden requset'});
    try {
        const foundUser = await Users.findOne({
            where: {username: username},
            attributes: { exclude: ['password', 'refreshToken', 'role'] },
        });
        if(!foundUser) return res.status(401).json({message: "Username does not exist"});

        return res.status(200).json({data: foundUser});
    } catch (error) {
        console.log(error);        
        logger(LOG_TYPE.Error, `${error}`, "error",'userController/getUserByUsername');
    }

};
const getUsers = async(req:Request , res: Response) => {
    const { 
        model = { address: "", email: "", name: "", username: "" }, 
        sortItem = { sortOn: "username", isAscending: true }, 
        paging = {itemPerPage: null, currentPage: null} 
    }: Filter = req.body;

    const { itemPerPage, currentPage }: Paging = paging;
    const { sortOn, isAscending }: sortItem = sortItem;
    const direction = isAscending ? "ASC" : "DESC";
    const { address, email, name, username }: User = model;
    try {
        const conditions: any = {}
        if(username){
            conditions.username = {
                [Op.like]: `%${username}%`
            }
        };
        if(name){
            conditions.name = {
                [Op.like]: `%${name}%` 
            }
        };
        if(email){
            conditions.email = {
                [Op.like]: `%${email}%` 
            }
        };
        if(address){
            conditions.address = {
                [Op.like]: `%${address}%` 
            }
        };
        const foundItems = await Users.findAll({
            where: conditions,
            attributes: { exclude: ['password', 'refreshToken', 'role'] }, 
            order: sortOn ? [[sortOn, direction]] : [],
            offset: itemPerPage && currentPage ? (currentPage - 1) * itemPerPage : undefined,
            limit: itemPerPage ? itemPerPage : undefined
        });
        return res.status(201).json({data: foundItems});

    } catch (error) {
        console.log(error);
        logger(LOG_TYPE.Error, `${error}`, "error",'userController/getUsers');
    }
};

export default { createUser, getUserByUsername, getUsers, editUser, changeUserStatus };