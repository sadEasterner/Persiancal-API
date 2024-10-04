// require('dotenv').config();
const Articles = require("../models/articles");
import { Request, Response } from "express";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { ARTICLE_STATUS } from "../config/parameters/article-status";
import path from "path";
// import { Course } from "../interfaces/course/ICourse";
import { Article } from "../interfaces/article/IArticle";
import { ArticleFilter } from "../interfaces/article/IArticleFilter";
import { AuthenticatedRequest } from "../interfaces/requests/IAuthenticatedRequest";
import { LOG_TYPE, logger } from "../middleware/logEvents";
import { MulterRequest } from "../interfaces/requests/IMulterRequest";

const createArticle = async (req: Request, res: Response) => {
  const { title, text, provider }: Article = req.body;
  if (!title)
    return res.status(400).json({ message: "article title is required" });
  if (!text) return res.status(400).json({ message: "text is required" });
  if (!provider)
    return res.status(400).json({ message: "provider is required" });
  let attachmentPath = "";
  const file = (req as MulterRequest).files?.attachment;

  if (file) {
    const id = uuidv4();
    const originalFileName = file.name.replace(/\s/g, "");
    const fileExtension = path.extname(originalFileName);
    const uniqueFileName = `${path.basename(
      originalFileName,
      fileExtension
    )}-${id}${fileExtension}`;
    const filepath = path.join(__dirname, "..", "attachments", uniqueFileName);

    attachmentPath = `attachments/${uniqueFileName}`;

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
    const result = await Articles.create({
      id: uuidv4(),
      title: title,
      text: text,
      provider: provider,
      articleStatus: ARTICLE_STATUS.Active,
      attachmentUrl: attachmentPath,
    });
    if (!result) return res.status(500).json({ message: "server error" });
    return res
      .status(201)
      .json({ data: `article by this id: ${result.id} created` });
  } catch (error) {
    console.log(error);
    logger(
      LOG_TYPE.Error,
      `${error}`,
      "error",
      "articleController/createArticle"
    );
  }
};
// const editCourse = async (req: Request, res: Response) => {
//   const { id, title, courseStatus, description }: Course = req.body;

//   const foundCourse = await Courses.findOne({ where: { id: id } });
//   if (!foundCourse)
//     return res.status(401).json({ message: "id does not exist" });
//   try {
//     if (title) foundCourse.title = title;
//     if (description) foundCourse.description = description;
//     if (courseStatus) {
//       const validCourseStatusTochange = Object.entries(COURSE_STATUS).map(
//         ([key, value]) => value
//       );
//       if (!validCourseStatusTochange.includes(courseStatus) && courseStatus)
//         return res.status(400).json({ message: "CourseStatus is invalid" });
//       foundCourse.courseStatus = courseStatus;
//     }
//     const result = await foundCourse.save();
//     if (!result) return res.status(500).json({ message: "server error" });
//     return res
//       .status(201)
//       .json({ data: `course by this id: ${result.id} updated` });
//   } catch (error) {
//     console.log(error);
//     logger(LOG_TYPE.Error, `${error}`, "error", "courseController/editCourse");
//   }
// };

// const getCourseById = async (req: AuthenticatedRequest, res: Response) => {
//   const { id } = req.params;

//   if (!id) return res.status(400).json({ message: "id is required" });

//   try {
//     const foundCourse = await Courses.findOne({
//       where: { id: id },
//       // attributes: { exclude: ['password', 'refreshToken', 'role'] },
//     });
//     if (!foundCourse)
//       return res.status(401).json({ message: "id does not exist" });

//     return res.status(200).json({ data: foundCourse });
//   } catch (error) {
//     console.log(error);
//     logger(
//       LOG_TYPE.Error,
//       `${error}`,
//       "error",
//       "courseController/getCourseById"
//     );
//   }
// };
const getArticles = async (req: Request, res: Response) => {
  const {
    title,
    articleStatus,
    provider,
    isAscending = true,
    sortOn = "title",
    itemPerPage = 0,
    currentPage = 0,
  } = req.query as unknown as ArticleFilter;

  const direction = isAscending ? "ASC" : "DESC";
  try {
    const conditions: any = {};
    if (title) {
      conditions.title = {
        [Op.like]: `%${title}%`,
      };
    }
    if (provider) {
      conditions.provider = {
        [Op.like]: `%${provider}%`,
      };
    }
    if (articleStatus) {
      conditions.articleStatus = {
        [Op.eq]: Number(articleStatus),
      };
    }
    const { count, rows } = await Articles.findAndCountAll({
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
      "articleController/getArticles"
    );
  }
};
const deleteArticle = async (req: Request, res: Response) => {
  const { id }: any = req.params;
  if (!id) return res.status(400).json({ message: "id is Empty" });

  try {
    const foundArticle = await Articles.findOne({ where: { id: id } });

    if (!foundArticle)
      return res.status(401).json({ message: "id does not exist" });
    foundArticle.articleStatus = ARTICLE_STATUS.Deleted;

    const result = await foundArticle.save();
    if (!result) return res.status(500).json({ message: "server error" });

    return res
      .status(201)
      .json({ data: `article by this id: ${result.id} deleted` });
  } catch (error) {
    console.log(error);
    logger(
      LOG_TYPE.Error,
      `${error}`,
      "error",
      "articleController/deleteArticle"
    );
  }
};

export default {
  createArticle,
  //   getCourseById,
  getArticles,
  //   editCourse,
  deleteArticle,
};
