// require('dotenv').config();
const Labs = require('../models/users');
import { Op, where } from "sequelize";
import { NextFunction , Request ,Response} from "express";
import { MulterRequest } from "../interfaces/requests/IMulterRequest";
import { LOG_TYPE, logger } from "../middleware/logEvents";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import jwt from 'jsonwebtoken';
import { ROLES_LIST } from "../config/parameters/roles-list";
import { AuthenticatedRequest } from "../interfaces/requests/IAuthenticatedRequest";
import { Lab } from "../interfaces/lab/ILab";
import { LAB_STATUS } from "../config/parameters/lab-status";
import { LabFilter } from "../interfaces/lab/ILabFilter";


const createLab = async(req:Request , res: Response) => {
    const { name, description }: Lab = req.body;
    if(!name) return res.status(400).json({message: 'name is required'});
    if(!description) return res.status(400).json({message: 'description is required'});
    const duplicate = await Labs.findOne({ where: { name: name } });
    if(duplicate)  return res.status(409).json({ message: 'Lab by this name already exists'});
    try {
        const result = await Labs.create({
            id:uuidv4(),
            name: name,
            description: description,
            labStatus: LAB_STATUS.Active,
        })
        if(!result) return res.status(500).json({message: "server error"});
        return res.status(201).json({data: `lab by this id: ${result.id} created`});
    } catch (error) {
        console.log(error);
        logger(LOG_TYPE.Error, `${error}`, "error",'labController/createLab');
    }
};
const editLab = async(req:Request , res: Response) => {
    const {id, name, description,labStatus }: Lab = req.body;
 
    const foundLab = await Labs.findOne({ where: { id: id } });
    if(!foundLab) return res.status(401).json({message: "id does not exist"});
    try {
        if(name) foundLab.name = name;
        if(description) foundLab.description = description;
        if(labStatus){
            const validLabStatusTochange = Object.entries(LAB_STATUS).map(([key, value]) => value );
            if(!validLabStatusTochange.includes(labStatus) && labStatus) return res.status(400).json({message: 'LabStatus is invalid'});
            foundLab.labStatus = labStatus;
        } 
        const result = await foundLab.save();
        if(!result) return res.status(500).json({message: "server error"});
        return res.status(201).json({data: `lab by this id: ${result.id} updated`});
    } catch (error) {
        console.log(error);
        logger(LOG_TYPE.Error, `${error}`, "error",'labController/editLab');
    }
};

const getLabById = async(req:AuthenticatedRequest , res: Response) => {
    const { id } = req.params;

    if(!id) return res.status(400).json({message: 'id is required'});
 
    try {
        const foundLab = await Labs.findOne({
            where: {id: id},
            // attributes: { exclude: ['password', 'refreshToken', 'role'] },
        });
        if(!foundLab) return res.status(401).json({message: "id does not exist"});

        return res.status(200).json({data: foundLab});
    } catch (error) {
        console.log(error);        
        logger(LOG_TYPE.Error, `${error}`, "error",'userController/getUserByUsername');
    }

};
const getLabs = async(req:Request , res: Response) => {
    const { 
        name, 
        labStatus,
        isAscending = true, 
        sortOn = "name", 
        itemPerPage = 0, 
        currentPage = 0
    } = req.query as unknown as  LabFilter;
    
    const direction = isAscending ? "ASC" : "DESC";
    try {
        const conditions: any = {}
        if(name){
            conditions.name = {
                [Op.like]: `%${name}%`
            }
        };
        if(labStatus){
            conditions.labStatus = {
                [Op.eq]: Number(labStatus)
            }
        };
        const { count, rows } = await Labs.findAndCountAll({
            where: conditions,
            // attributes: { exclude: ['password', 'refreshToken'] }, 
            order: sortOn ? [[sortOn, direction]] : [],
            offset: itemPerPage && currentPage ? (Number(currentPage) - 1) * Number(itemPerPage) : undefined,
            limit: itemPerPage ? Number(itemPerPage) : undefined
        });
        return res.status(200).json({data: rows, count: count});

    } catch (error) {
        console.log(error);
        logger(LOG_TYPE.Error, `${error}`, "error",'labController/getLabs');
    }
};
const deleteLab = async(req:Request , res: Response) => {
    const { id }: any = req.params;
    if(!id) return res.status(400).json({message: "id is Empty"});

    try {
        const foundLab = await Labs.findOne({ where: { id: id }});

        if(!foundLab) return res.status(401).json({message: "id does not exist"});
        foundLab.labStatus = LAB_STATUS.Deleted;
        
        const result = await foundLab.save();
        if(!result) return res.status(500).json({message: "server error"});

        return res.status(201).json({data: `lab by this id: ${result.id} deleted`});
    } catch (error) {
        console.log(error);
        logger(LOG_TYPE.Error, `${error}`, "error",'labController/deleteLab');
    }
};

export default { createLab, getLabById, getLabs, editLab, deleteLab };