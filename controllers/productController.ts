import { Op, where } from "sequelize";
import { NextFunction , Request ,Response} from "express";
import { Products } from "../interfaces/IProduct";
import { MulterRequest } from "../interfaces/IMulterRequest";
import { Filter, Paging, sortItem } from "../interfaces/filtering/IFilter";
import { LOG_TYPE, logger } from "../middleware/logEvents";
import path from 'path';
const Product = require('../models/products');



const createProduct = async(req:Request , res: Response) => {
    const { description, title, price, id }: Products = req.body;
    const files  = (req as MulterRequest).files;
    const message = 
    !price ? 'Price is Empty' :
    !description ? 'Description is Emnpty' :
    !title? 'Title is Empty' : null;

    const duplicateByName = await Product.findOne({ where: { title: title } });
    if(duplicateByName) return res.status(409).json({data: 'This Title already exist'})
    if(message) return res.status(400).json({data: message});
    try {
        let fileUrls: string = "";
        if(files){
            Object.keys(files).forEach(key => {
                const filepath = path.join(__dirname,'..', 'images',`${title}_${files[key].name}`);
                files[key].mv(filepath, (err: never) => {
                    if(err) return res.status(500).json({data : "server error!"});
                });
                fileUrls =`images/${title}_${files[key].name}`
            })
        }
        const result = await Product.create({
            title: title,
            imageUrl: fileUrls,
            description: description,
            price: price
        })
        if(result)
            return res.status(201).json({data: `New Product ${result.title} created!`});
    } catch (error) {
        console.log(error);

    }                
}
const getProducts = async(req:Request , res: Response) => {
    const {model,sortItem, paging,isExact }: Filter = req.body;
    const { itemPerPage, currentPage }: Paging = paging;
    const { sortOn, isAscending }: sortItem = sortItem;
    const {description, title, price, id}: Products = model;

    try {
        let conditions: any = {}

        if (title) {
            conditions.title = {
                [Op.like]: title 
            };
        }
        if (id) {
            conditions.id = {
                [Op.eq]: Number(id) 
            };
        }
        if (price) {
            conditions.price = {
                [Op.eq]: price 
            };
        }
        const foundItems = await Product.findAll({
            where: conditions
        })
        res.status(201).json({data: foundItems});
    } catch (error) {
        
    }
}
export default {createProduct, getProducts}