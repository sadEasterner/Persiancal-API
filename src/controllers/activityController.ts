// require('dotenv').config();
const Activities = require("../models/activities");
import { Request, Response } from "express";
import { Op } from "sequelize";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { Activity } from "../interfaces/activity/IActivity";
import { ActivityFilter } from "../interfaces/activity/IActivityFilter";
import { AuthenticatedRequest } from "../interfaces/requests/IAuthenticatedRequest";
import { LOG_TYPE, logger } from "../middleware/logEvents";
import { MulterRequest } from "../interfaces/requests/IMulterRequest";

const createActivity = async (req: Request, res: Response) => {
  const { text, providerTitle }: Activity = req.body;

  if (!text) return res.status(400).json({ message: "text is required" });
  if (!providerTitle)
    return res.status(400).json({ message: "providerTitle is required" });

  let imagePath = "";
  const file = (req as MulterRequest).files?.image;

  if (file) {
    const id = uuidv4();
    const originalFileName = file.name.replace(/\s/g, "");
    const fileExtension = path.extname(originalFileName);
    const uniqueFileName = `${path.basename(
      originalFileName,
      fileExtension
    )}-${id}${fileExtension}`;
    const filepath = path.join(__dirname, "..",'..', "images", uniqueFileName);

    imagePath = `images/${uniqueFileName}`;

    await new Promise<void>((resolve, reject) => {
      file.mv(filepath, (err: never) => {
        if (err) {
          reject(
            res
              .status(500)
              .json({ message: "Server error while saving the image!" })
          );
        } else {
          resolve();
        }
      });
    });
  }

  try {
    const result = await Activities.create({
      id: uuidv4(),
      text: text,
      providerTitle: providerTitle,
      imagePath: imagePath,
    });

    if (!result) return res.status(500).json({ message: "server error" });

    return res
      .status(201)
      .json({ data: `Activity by this id: ${result.id} created` });
  } catch (error) {
    console.log(error);
    logger(
      LOG_TYPE.Error,
      `${error}`,
      "error",
      "activityController/createActivity"
    );
  }
};

const getActivities = async (req: Request, res: Response) => {
  const {
    providerTitle,
    isAscending = true,
    sortOn = "text",
    itemPerPage = 0,
    currentPage = 0,
  } = req.query as unknown as ActivityFilter;

  const direction = isAscending ? "ASC" : "DESC";
  try {
    const conditions: any = {};

    if (providerTitle) {
      conditions.providerTitle = {
        [Op.like]: `%${providerTitle}%`,
      };
    }

    const { count, rows } = await Activities.findAndCountAll({
      where: conditions,
      // attributes: { exclude: ['password', 'refreshToken'] },
      order: sortOn ? [[sortOn, direction]] : [],
      offset:
        itemPerPage && currentPage
          ? (Number(currentPage) - 1) * Number(itemPerPage)
          : undefined,
      limit: itemPerPage ? Number(itemPerPage) : undefined,
    });
    return res.status(200).json({ data: rows, count: count });
  } catch (error) {
    console.log(error);
    logger(
      LOG_TYPE.Error,
      `${error}`,
      "error",
      "activityController/getActivities"
    );
  }
};
const deleteActivity = async (req: Request, res: Response) => {
  const { id }: any = req.params;
  if (!id) return res.status(400).json({ message: "id is Empty" });

  try {
    const activity = await Activities.findByPk(id);

    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }

    // If there is an associated image, delete it from the file system
    const imagePath = activity.imagePath;
    if (imagePath) {
      const fullImagePath = path.join(__dirname, "..", '..', imagePath);

      // Unlink (delete) the image file from the /images directory
      fs.unlink(fullImagePath, (err) => {
        if (err) {
          console.error(`Failed to delete image file: ${imagePath}`, err);
        }
      });
    }

    // Delete the activity record from the database
    await activity.destroy();

    return res
      .status(201)
      .json({ data: `Activity with ID: ${id} and its image (if any) deleted` });
  } catch (error) {
    console.log(error);
    logger(
      LOG_TYPE.Error,
      `${error}`,
      "error",
      "activityController/deleteActivity"
    );
    return res.status(500).json({ message: "Server error" });
  }
};

export default {
  createActivity,
  getActivities,
  deleteActivity,
};
