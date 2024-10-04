// require('dotenv').config();
const Consultations = require("../models/consultations");
import { Request, Response } from "express";
import { Op } from "sequelize";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { AuthenticatedRequest } from "../interfaces/requests/IAuthenticatedRequest";
import { LOG_TYPE, logger } from "../middleware/logEvents";
import { MulterRequest } from "../interfaces/requests/IMulterRequest";
import { Consultation } from "../interfaces/consultation/IConsultation";
import { CONSULTATION_STATUS } from "../config/parameters/consultation-status";
import { ConsultationFilter } from "../interfaces/consultation/IConsultationFilter";

const createConsultation = async (req: Request, res: Response) => {
  const { title, description, provider }: Consultation = req.body;

  let filePaths: any = {
    imagePath: "",
    attachmentPath: "",
  };

  const files = (req as MulterRequest).files;
  if (files?.image || files?.attachment) {
    for (const key of Object.keys(files)) {
      const id = uuidv4();
      const originalFileName = files[key].name.replace(/\s/g, "");
      const fileExtension = path.extname(originalFileName);
      const uniqueFileName = `${path.basename(
        originalFileName,
        fileExtension
      )}-${id}${fileExtension}`;

      const filepath = path.join(__dirname, "..", key + "s", uniqueFileName);
      const indexString: any = `${key}Path`;
      filePaths[indexString as any] = uniqueFileName;

      await new Promise<void>((resolve, reject) => {
        files[key].mv(filepath, (err: never) => {
          if (err) {
            reject(res.status(500).json({ data: "Server error!" }));
          } else {
            resolve();
          }
        });
      });
    }
  }

  if (!title)
    return res.status(400).json({ message: "course title is required" });
  if (!description)
    return res.status(400).json({ message: "description is required" });
  if (!provider)
    return res.status(400).json({ message: "provider is required" });
  try {
    const result = await Consultations.create({
      id: uuidv4(),
      title: title,
      description: description,
      provider: provider,
      consultationStatus: CONSULTATION_STATUS.Active,
      imagePath: `images/${filePaths.imagePath}`,
      attachmentPath: `attachments/${filePaths.attachmentPath}`,
    });
    if (!result) return res.status(500).json({ message: "server error" });
    return res
      .status(201)
      .json({ data: `consultation by this id: ${result.id} created` });
  } catch (error) {
    console.log(error);
    logger(
      LOG_TYPE.Error,
      `${error}`,
      "error",
      "consultationController/createConsultation"
    );
  }
};
const editConsultation = async (req: Request, res: Response) => {
  const { id, title, consultationStatus, description }: Consultation = req.body;

  const foundConsultation = await Consultations.findOne({ where: { id: id } });
  if (!foundConsultation)
    return res.status(401).json({ message: "id does not exist" });
  try {
    if (title) foundConsultation.title = title;
    if (description) foundConsultation.description = description;
    if (consultationStatus) {
      const validConsultationStatusTochange = Object.entries(
        CONSULTATION_STATUS
      ).map(([key, value]) => value);
      if (
        !validConsultationStatusTochange.includes(consultationStatus) &&
        consultationStatus
      )
        return res.status(400).json({ message: "CourseStatus is invalid" });
      foundConsultation.consultationStatus = consultationStatus;
    }
    const result = await foundConsultation.save();
    if (!result) return res.status(500).json({ message: "server error" });
    return res
      .status(201)
      .json({ data: `consultation by this id: ${result.id} updated` });
  } catch (error) {
    console.log(error);
    logger(
      LOG_TYPE.Error,
      `${error}`,
      "error",
      "consultationController/editConsultation"
    );
  }
};

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
const getConsultations = async (req: Request, res: Response) => {
  const {
    title,
    consultationStatus,
    provider,
    isAscending = true,
    sortOn = "title",
    itemPerPage = 0,
    currentPage = 0,
  } = req.query as unknown as ConsultationFilter;

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
    if (consultationStatus) {
      conditions.consultationStatus = {
        [Op.eq]: Number(consultationStatus),
      };
    }
    const { count, rows } = await Consultations.findAndCountAll({
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
      "consultationController/getConsultations"
    );
  }
};
const deleteConsultation = async (req: Request, res: Response) => {
  const { id }: any = req.params;
  if (!id) return res.status(400).json({ message: "id is Empty" });

  try {
    const foundConsultation = await Consultations.findOne({
      where: { id: id },
    });

    if (!foundConsultation)
      return res.status(401).json({ message: "id does not exist" });
    foundConsultation.consultationStatus = CONSULTATION_STATUS.Deleted;

    const result = await foundConsultation.save();
    if (!result) return res.status(500).json({ message: "server error" });

    return res
      .status(201)
      .json({ data: `consultation by this id: ${result.id} deleted` });
  } catch (error) {
    console.log(error);
    logger(
      LOG_TYPE.Error,
      `${error}`,
      "error",
      "consultationController/deleteConsultation"
    );
  }
};

export default {
  createConsultation,
  // getCourseById,
  getConsultations,
  editConsultation,
  deleteConsultation,
};
