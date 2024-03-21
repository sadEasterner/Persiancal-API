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


const createUser = async(req:Request , res: Response) => {
    const { address, emial, name, password, username }: User = req.body;
    if(!username) return res.status(400).json({error: 'Username is required'});
    if(!password) return res.status(400).json({error: 'Password is required'});
    if(!emial) return res.status(400).json({error: 'Emial is required'});
    if(!address) return res.status(400).json({error: 'Address is required'});
    if(!name) return res.status(400).json({error: 'Name is required'});
    const duplicate = await Users.findOne({ where: { username: username } });
    if(duplicate)  return res.status(409).json({ error: 'User by this username already exists'});
    try {
        const result = await Users.create({
            username: username,
            emial: emial,
            password: password,
            address: address,
            name: name,
            refreshToken: ""
        })
        if(!result) return res.status(500).json({message: "server error"});
        return res.status(201).json({data: `user name by this username: ${result.username} created`});
    } catch (error) {
        console.log(error);
        // logger(LOG_TYPE.Error, error.toString(), "Controller",'AuthController/signup');
    }
};
const editUser = async(req:Request , res: Response) => {
    const { address, emial, name, password, username }: User = req.body;
 
    const foundUser = await Users.findOne({ where: { username: username } });
    if(!foundUser) return res.status(401).json({error: "Username does not exist"});
    try {
        //if(username) foundUser.username = username;
        if(password) foundUser.password = password;
        if(emial) foundUser.emial = emial;
        if(address) foundUser.address = address;
        if(name) foundUser.name = name;
        const result = await foundUser.save();
        if(!result) return res.status(500).json({message: "server error"});
        return res.status(201).json({data: `user name by this username: ${result.username} updated`});
    } catch (error) {
        console.log(error);
        // logger(LOG_TYPE.Error, error.toString(), "Controller",'AuthController/signup');
    }
};

const getUserByUsername = async(req:Request , res: Response) => {
    const { username }: User = req.body;
    if(!username) return res.status(400).json({error: 'Username is required'});
    try {
        const foundUser = await Users.findOne({where: {username: username}});
        if(!foundUser) return res.status(401).json({message: "Username does not exist"});
        let userInfo: UserInfo = {
            username: foundUser.username,
            emial: foundUser.emial,
            name: foundUser.name,
            address: foundUser.address,
            userStatus: foundUser.userStatus
        }
        return res.status(200).json({data: userInfo});
    } catch (error) {
        
    }

};

const getUsers = async(req:Request , res: Response) => {
    const { model, sortItem, paging }: Filter = req.body;
    const { itemPerPage, currentPage }: Paging = paging;
    const { sortOn, isAscending }: sortItem = sortItem;
    const direction = isAscending ? "ASC" : "DESC";
    const { address, emial, name, username }: User = model;
    try {
        const conditions: any = {}
        if(username){
            conditions.username = {
                [Op.like]: username 
            }
        };

        if(name){
            conditions.name = {
                [Op.like]: name 
            }
        };

        if(emial){
            conditions.emial = {
                [Op.like]: emial 
            }
        };

        if(address){
            conditions.address = {
                [Op.like]: address 
            }
        };

        const foundItems = await Users.findAll({
            where: conditions,
            order: sortOn ? [[sortOn, direction]] : [],
            offset: itemPerPage && currentPage ? (currentPage - 1) * itemPerPage : undefined,
            limit: itemPerPage ? itemPerPage : undefined
        });

        const usersList: UserInfo[] = foundItems.map((item: User) => {
            let userToShow:UserInfo = {
                username: item.username,
                emial: item.emial,
                name: item.name,
                address: item.address,
                userStatus: item.userStatus
            };
            return userToShow;
        })

        return res.status(201).json({data: usersList});
    } catch (error) {
        console.log(error);
    }
};

export default { createUser, getUserByUsername, getUsers };