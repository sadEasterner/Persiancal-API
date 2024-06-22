// require('dotenv').config();
const Courses = require("../models/courses");
import { Request, Response } from "express";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { COURSE_STATUS } from "../config/parameters/course-status";
import { Course } from "../interfaces/course/ICourse";
import { CourseFilter } from "../interfaces/course/ICourseFilter";
import { AuthenticatedRequest } from "../interfaces/requests/IAuthenticatedRequest";
import { LOG_TYPE, logger } from "../middleware/logEvents";

const createCourse = async (req: Request, res: Response) => {
  const { title, description, provider, duration }: Course =
    req.body;
  if (!title)
    return res.status(400).json({ message: "course title is required" });
  if (!description)
    return res.status(400).json({ message: "description is required" });
  if (!provider)
    return res.status(400).json({ message: "provider is required" });
  if (!duration)
    return res.status(400).json({ message: "duration is required" });
  try {
    const result = await Courses.create({
      id: uuidv4(),
      title: title,
      description: description,
      provider: provider,
      duration: duration,
      courseStatus: COURSE_STATUS.Active,
    });
    if (!result) return res.status(500).json({ message: "server error" });
    return res
      .status(201)
      .json({ data: `course by this id: ${result.id} created` });
  } catch (error) {
    console.log(error);
    logger(
      LOG_TYPE.Error,
      `${error}`,
      "error",
      "courseController/createCourse"
    );
  }
};
const editCourse = async (req: Request, res: Response) => {
  const { id, title, courseStatus, description }: Course = req.body;

  const foundCourse = await Courses.findOne({ where: { id: id } });
  if (!foundCourse)
    return res.status(401).json({ message: "id does not exist" });
  try {
    if (title) foundCourse.title = title;
    if (description) foundCourse.description = description;
    if (courseStatus) {
      const validCourseStatusTochange = Object.entries(COURSE_STATUS).map(
        ([key, value]) => value
      );
      if (!validCourseStatusTochange.includes(courseStatus) && courseStatus)
        return res.status(400).json({ message: "CourseStatus is invalid" });
      foundCourse.courseStatus = courseStatus;
    }
    const result = await foundCourse.save();
    if (!result) return res.status(500).json({ message: "server error" });
    return res
      .status(201)
      .json({ data: `course by this id: ${result.id} updated` });
  } catch (error) {
    console.log(error);
    logger(LOG_TYPE.Error, `${error}`, "error", "courseController/editCourse");
  }
};

const getCourseById = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "id is required" });

  try {
    const foundCourse = await Courses.findOne({
      where: { id: id },
      // attributes: { exclude: ['password', 'refreshToken', 'role'] },
    });
    if (!foundCourse)
      return res.status(401).json({ message: "id does not exist" });

    return res.status(200).json({ data: foundCourse });
  } catch (error) {
    console.log(error);
    logger(
      LOG_TYPE.Error,
      `${error}`,
      "error",
      "courseController/getCourseById"
    );
  }
};
const getCourses = async (req: Request, res: Response) => {
  const {
    title,
    courseStatus,
    provider,
    isAscending = true,
    sortOn = "title",
    itemPerPage = 0,
    currentPage = 0,
  } = req.query as unknown as CourseFilter;

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
    if (courseStatus) {
      conditions.courseStatus = {
        [Op.eq]: Number(courseStatus),
      };
    }
    const { count, rows } = await Courses.findAndCountAll({
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
    logger(LOG_TYPE.Error, `${error}`, "error", "courseController/getCourses");
  }
};
const deleteCourse = async (req: Request, res: Response) => {
  const { id }: any = req.params;
  if (!id) return res.status(400).json({ message: "id is Empty" });

  try {
    const foundCourse = await Courses.findOne({ where: { id: id } });

    if (!foundCourse)
      return res.status(401).json({ message: "id does not exist" });
    foundCourse.courseStatus = COURSE_STATUS.Deleted;

    const result = await foundCourse.save();
    if (!result) return res.status(500).json({ message: "server error" });

    return res
      .status(201)
      .json({ data: `course by this id: ${result.id} deleted` });
  } catch (error) {
    console.log(error);
    logger(
      LOG_TYPE.Error,
      `${error}`,
      "error",
      "courseController/deleteCourse"
    );
  }
};

export default {
  createCourse,
  getCourseById,
  getCourses,
  editCourse,
  deleteCourse,
};
