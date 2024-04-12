// require('dotenv').config();
const Feedbacks = require("../models/feedbacks");
import { Request, Response } from "express";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { Feedback } from "../interfaces/feedback/IFeedback";
import { FeedbackFilter } from "../interfaces/feedback/IFeedbackFilter";
import { LOG_TYPE, logger } from "../middleware/logEvents";

const createFeedback = async (req: Request, res: Response) => {
  const { senderName, companyName, email, phoneNumber, text }: Feedback =
    req.body;
  if (!senderName) return res.status(400).json({ message: "name is required" });
  if (!companyName)
    return res.status(400).json({ message: "company name is required" });
  if (!email) return res.status(400).json({ message: "email is required" });
  if (!phoneNumber)
    return res.status(400).json({ message: "phoneNumber is required" });
  if (!text) return res.status(400).json({ message: "text is required" });
  try {
    const result = await Feedbacks.create({
      id: uuidv4(),
      senderName: senderName,
      companyName: companyName,
      email: email,
      phoneNumber: phoneNumber,
      text: text,
    });
    if (!result) return res.status(500).json({ message: "server error" });
    return res
      .status(201)
      .json({ data: `feedback by this id: ${result.id} created` });
  } catch (error) {
    console.log(error);
    logger(
      LOG_TYPE.Error,
      `${error}`,
      "error",
      "feedbackController/createFeedback"
    );
  }
};

const getFeedbacks = async (req: Request, res: Response) => {
  const {
    senderName,
    companyName,
    email,
    phoneNumber,
    text,
    isAscending = true,
    sortOn = "senderName",
    itemPerPage = 0,
    currentPage = 0,
  } = req.query as unknown as FeedbackFilter;

  const direction = isAscending ? "ASC" : "DESC";
  try {
    const conditions: any = {};
    if (senderName) {
      conditions.senderName = {
        [Op.like]: `%${senderName}%`,
      };
    }
    if (companyName) {
      conditions.companyName = {
        [Op.like]: `%${companyName}%`,
      };
    }
    if (email) {
      conditions.email = {
        [Op.like]: `%${email}%`,
      };
    }
    if (phoneNumber) {
      conditions.phoneNumber = {
        [Op.like]: `%${phoneNumber}%`,
      };
    }
    if (text) {
      conditions.text = {
        [Op.like]: `%${text}%`,
      };
    }
    const { count, rows } = await Feedbacks.findAndCountAll({
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
      "feedbackController/getFeedbacks"
    );
  }
};

export default { createFeedback, getFeedbacks };
