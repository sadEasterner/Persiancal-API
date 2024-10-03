// require('dotenv').config();
const Certificates = require("../models/certificates");
import { Request, Response } from "express";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { CERTIFICATE_STATUS } from "../config/parameters/certificate-status";
// import { Course } from "../interfaces/course/ICourse";
import { Certificate } from "../interfaces/certificate/ICert";
import { CertFilter } from "../interfaces/certificate/ICertFilter";
import { AuthenticatedRequest } from "../interfaces/requests/IAuthenticatedRequest";
import { LOG_TYPE, logger } from "../middleware/logEvents";

const createCertificate = async (req: Request, res: Response) => {
  const { title, description, provider }: Certificate = req.body;
  console.log(req.files);

  if (!title)
    return res.status(400).json({ message: "certificate title is required" });
  if (!description)
    return res.status(400).json({ message: "description is required" });
  if (!provider)
    return res.status(400).json({ message: "provider is required" });
  try {
    const result = await Certificates.create({
      id: uuidv4(),
      title: title,
      description: description,
      provider: provider,
      certificationStatus: CERTIFICATE_STATUS.Active,
      filePath: "test",
    });
    if (!result) return res.status(500).json({ message: "server error" });
    return res
      .status(201)
      .json({ data: `certificate by this id: ${result.id} created` });
  } catch (error) {
    console.log(error);
    logger(
      LOG_TYPE.Error,
      `${error}`,
      "error",
      "certificateController/createCertificate"
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
const getCertificates = async (req: Request, res: Response) => {
  const {
    title,
    certificateStatus,
    provider,
    isAscending = true,
    sortOn = "title",
    itemPerPage = 0,
    currentPage = 0,
  } = req.query as unknown as CertFilter;

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
    if (certificateStatus) {
      conditions.certificationStatus = {
        [Op.eq]: Number(certificateStatus),
      };
    }
    const { count, rows } = await Certificates.findAndCountAll({
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
      "certificateController/getCertificates"
    );
  }
};
const deleteCertificate = async (req: Request, res: Response) => {
  const { id }: any = req.params;
  if (!id) return res.status(400).json({ message: "id is Empty" });

  try {
    const foundCertificate = await Certificates.findOne({ where: { id: id } });

    if (!foundCertificate)
      return res.status(401).json({ message: "id does not exist" });
    foundCertificate.certificateStatus = CERTIFICATE_STATUS.Deleted;

    const result = await foundCertificate.save();
    if (!result) return res.status(500).json({ message: "server error" });

    return res
      .status(201)
      .json({ data: `certificate by this id: ${result.id} deleted` });
  } catch (error) {
    console.log(error);
    logger(
      LOG_TYPE.Error,
      `${error}`,
      "error",
      "certificateController/deleteCertificate"
    );
  }
};

export default {
  createCertificate,
  //   getCourseById,
  getCertificates,
  //   editCourse,
  deleteCertificate,
};
