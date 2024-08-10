import { Op } from "sequelize";
import { NextFunction, Request, Response } from "express";
import { Product } from "../interfaces/product/IProduct";
import { MulterRequest } from "../interfaces/requests/IMulterRequest";
import { LOG_TYPE, logger } from "../middleware/logEvents";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { ProductInfo } from "../interfaces/product/IProductInfo";
import { PRODUCT_STATUS } from "../config/parameters/products-status";
import { ProductFilter } from "../interfaces/product/IProductFilter";
const Products = require("../models/products");
const ImageUrls = require("../models/imageUrls");

const createProduct = async (req: Request, res: Response) => {
  const { description, title }: Product = req.body;
  const files = (req as MulterRequest).files;

  // Check for required fields
  const message = !description
    ? "Description is Empty"
    : !title
    ? "Title is Empty"
    : null;
  if (message) return res.status(400).json({ message: message });

  // Check for duplicate product title
  const duplicateByName = await Products.findOne({ where: { title: title } });
  if (duplicateByName)
    return res.status(409).json({ message: "This Title already exists" });

  try {
    // First, create the Products record
    const id = uuidv4();
    const result = await Products.create({
      id: id,
      title: title,
      description: description,
    });

    if (!result) return res.status(500).json({ message: "Server error" });

    // Then, handle the file uploads and insert into ProductImageUrls
    if (files) {
      for (const key of Object.keys(files)) {
        const imageId = uuidv4();
        // const fileUrl = `${files[key].name}`.replace(/\s/g, "");
        // const filepath = path.join(__dirname, "..", "images", fileUrl);
        const originalFileName = files[key].name.replace(/\s/g, ""); // Remove spaces
        const fileExtension = path.extname(originalFileName); // Get file extension
        const uniqueFileName = `${path.basename(originalFileName, fileExtension)}-${imageId}${fileExtension}`;
        const filepath = path.join(__dirname, "..", "images", uniqueFileName);

        // Move the file
        await new Promise<void>((resolve, reject) => {
          files[key].mv(filepath, (err: never) => {
            if (err) {
              reject(res.status(500).json({ data: "Server error!" }));
            } else {
              resolve();
            }
          });
        });

        // Insert the ProductImageUrls record
        await ImageUrls.create({
          id: imageId,
          productId: id,
          imageUrl: `images/${uniqueFileName}`,
        });
      }
    }

    return res.status(201).json({ data: `New Product ${result.title} created!` });
  } catch (error) {
    // Log and handle the error
    logger(
      LOG_TYPE.Error,
      `${error}`,
      "errors",
      "ProductController/createProduct"
    );
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getProducts = async (req: Request, res: Response) => {
  const {
    title,
    id,
    productStatus,
    isAscending = true,
    sortOn = "title",
    itemPerPage = 0,
    currentPage = 0,
  }: ProductFilter = req.query as unknown as ProductFilter;

  const direction = isAscending ? "ASC" : "DESC";

  try {
    let conditions: any = {};
    if (title) {
      conditions.title = {
        [Op.like]: `%${title}%`,
      };
    }
    if (id) {
      conditions.id = {
        [Op.eq]: Number(id),
      };
    }
    if (productStatus) {
      conditions.productStatus = {
        [Op.eq]: Number(productStatus),
      };
    }
    const { rows, count } = await Products.findAndCountAll({
      where: conditions,
      order: [[sortOn, direction]],
      offset:
        itemPerPage && currentPage
          ? (Number(currentPage) - 1) * Number(itemPerPage)
          : undefined,
      limit: itemPerPage ? Number(itemPerPage) : undefined,
      include: [
        {
          model: ImageUrls,
          as: "productImages",
          attributes: ["imageUrl"],
        },
      ],
    });
    // if (!rows.length) return res.status(404).json({ message: "no item found" });

    return res.status(200).json({ data: rows, count: count });
  } catch (error) {
    logger(
      LOG_TYPE.Error,
      `${error}`,
      "errors",
      "ProductController/getProducts"
    );
    console.log(error);
  }
};
const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "id is Empty" });
  try {
    const foundProcuts = await Products.findOne({
      where: { id: id },
      include: [
        {
          model: ImageUrls,
          as: "productImages",
          attributes: ["imageUrl"],
        },
      ],
    });
    if (!foundProcuts)
      return res.status(404).json({ message: "no item found" });
    const ProductInfo: ProductInfo = {
      description: foundProcuts.description,
      id: foundProcuts.id,
      title: foundProcuts.title,
    };
    return res.status(200).json({ data: ProductInfo });
  } catch (error) {
    console.log(error);
    logger(
      LOG_TYPE.Error,
      `${error}`,
      "errors",
      "ProductController/getProductById"
    );
  }
};
const changeProductStatus = async (req: Request, res: Response) => {
  const { id, productStatus } = req.body;
  if (!id) return res.status(400).json({ message: "id is Empty" });
  if (!productStatus)
    return res.status(400).json({ message: "productStatus is Empty" });

  const validProductStatusTochange = Object.entries(PRODUCT_STATUS).map(
    ([key, value]) => value
  );
  if (!validProductStatusTochange.includes(productStatus) && productStatus)
    return res.status(400).json({ message: "UserStatus is invalid" });

  try {
    const foundProcuts = await Products.findOne({ where: { id: id } });
    if (!foundProcuts)
      return res.status(404).json({ message: "no item found" });

    foundProcuts.productStatus = productStatus;
    const result = await foundProcuts.save();
    if (!result) return res.status(500).json({ message: "server error" });
    return res
      .status(200)
      .json({ data: `user by this id : ${result.id} updated!` });
  } catch (error) {
    console.log(error);
    logger(
      LOG_TYPE.Error,
      `${error}`,
      "errors",
      "ProductController/changeProductStatus"
    );
  }
};
const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "id is Emnpty" });

  try {
    const foundProcuts = await Products.findOne({ where: { id: id } });
    if (!foundProcuts)
      return res.status(201).json({ message: "no item found" });
    foundProcuts.productStatus = PRODUCT_STATUS.Deleted;

    const result = await foundProcuts.save();
    if (!result) return res.status(500).json({ message: "server error" });
    return res
      .status(200)
      .json({ data: `user by this id : ${result.id} deleted` });
  } catch (error) {
    console.log(error);
    logger(
      LOG_TYPE.Error,
      `${error}`,
      "errors",
      "ProductController/changeProductStatus"
    );
  }
};
const editProduct = async (req: Request, res: Response) => {
  const { description, title, price, id }: Product = req.body;
  if (!id) return res.status(400).json({ message: "id is Empty" });
  try {
    const foundProcuts = await Products.findOne({ where: { id: id } });
    if (!foundProcuts)
      return res.status(404).json({ message: "no item found" });
    if (title) foundProcuts.title = title;
    if (description) foundProcuts.description = description;

    const result = await foundProcuts.save();
    if (!result) return res.status(500).json({ message: "server error" });
    return res
      .status(200)
      .json({ data: `user by this id : ${result.id} updated` });
  } catch (error) {
    console.log(error);
    logger(
      LOG_TYPE.Error,
      `${error}`,
      "errors",
      "ProductController/editProduct"
    );
  }
};

export default {
  createProduct,
  getProducts,
  getProductById,
  editProduct,
  changeProductStatus,
  deleteProduct,
};
