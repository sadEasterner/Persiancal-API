import { Op } from "sequelize";
import { NextFunction , Request ,Response} from "express";
import { Product } from "../interfaces/product/IProduct";
import { MulterRequest } from "../interfaces/requests/IMulterRequest";
import { Filter, Paging, sortItem } from "../interfaces/filtering/IFilter";
import { LOG_TYPE, logger } from "../middleware/logEvents";
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
const ProductImageUrl = require('../models/productImageUrls');
const Products = require('../models/products');

const createProduct = async(req:Request , res: Response) => {
    const { description, title, price }: Product = req.body;
    const files  = (req as MulterRequest).files;
    
    const message = 
    !price ? 'Price is Empty' :
    !description ? 'Description is Emnpty' :
    !title? 'Title is Empty' : null;
    if(message) return res.status(400).json({message: message});

    const duplicateByName = await Products.findOne({ where: { title: title } });
    if(duplicateByName) return res.status(409).json({message: 'This Title already exist'})
    try {
        const id = uuidv4();
        if(files){
            Object.keys(files).forEach(async(key) => {
                const imageId = uuidv4();
                const filepath = path.join(__dirname,'..', 'images',`${title}_${files[key].name}`);
                files[key].mv(filepath, (err: never) => {
                    if(err) return res.status(500).json({data : "server error!"});
                });
                const fileUrl =`images/${title}_${files[key].name}`;
                const resultforImage = await ProductImageUrl.create({
                    id: imageId,
                    productId: id,
                    imageUrl: fileUrl
                })
            })
        }
        const result = await Products.create({
            id: id,
            title: title,
            description: description,
            price: price
        })
        if(result)
            return res.status(201).json({data: `New Product ${result.title} created!`});
    } catch (error) {
        logger(LOG_TYPE.Error, `${error}`, "Controller",'ProductController/createProduct/line-50');
        console.log(error);
    }                
}

const getProducts = async(req:Request , res: Response) => {
    const { model, sortItem, paging, isExact }: Filter = req.body;
    const { itemPerPage, currentPage }: Paging = paging;
    const { sortOn, isAscending }: sortItem = sortItem;
    const direction = isAscending ? "ASC" : "DESC";
    const { title, price, id }: Product = model;
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
        const foundItems = await Products.findAll({
            where: conditions,
            order: sortOn ? [[sortOn, direction]] : [],
            offset: itemPerPage && currentPage ? (currentPage - 1) * itemPerPage : undefined,
            limit: itemPerPage ? itemPerPage : undefined
        })
        return res.status(201).json({data: foundItems});
    } catch (error) {
        logger(LOG_TYPE.Error, `${error}`, "Controller",'ProductController/getProducts/line-86');
        console.log(error);
    }
}
export default {createProduct, getProducts}