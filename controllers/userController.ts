// require('dotenv').config();
const Users = require("../models/users");
import { Op, where } from "sequelize";
import { NextFunction, Request, Response } from "express";
import { MulterRequest } from "../interfaces/requests/IMulterRequest";
import { User } from "../interfaces/user/IUser";
import { LOG_TYPE, logger } from "../middleware/logEvents";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import jwt from "jsonwebtoken";
import { ROLES_LIST } from "../config/parameters/roles-list";
import { UserInfo } from "../interfaces/user/IUserInfo";
import { USER_STATUS } from "../config/parameters/user-status";
import { AuthenticatedRequest } from "../interfaces/requests/IAuthenticatedRequest";
import { UserFilter } from "../interfaces/user/IUserFilter";
const UserFilesUrls = require("../models/userFilesUrls");

const createUser = async (req: Request, res: Response) => {
  const { address, email, name, password, username }: User = req.body;
  const files = (req as MulterRequest).files;
  if (!username)
    return res.status(400).json({ message: "Username is required" });
  if (!password)
    return res.status(400).json({ message: "Password is required" });
  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!address) return res.status(400).json({ message: "Address is required" });
  if (!name) return res.status(400).json({ message: "Name is required" });
  const duplicate = await Users.findOne({ where: { username: username } });
  if (duplicate)
    return res
      .status(409)
      .json({ message: "User by this username already exists" });
  try {
    const result = await Users.create({
      username: username,
      email: email,
      password: password,
      address: address,
      name: name,
      userStatus: USER_STATUS.Active,
      refreshToken: "",
    });
    if (!result) return res.status(500).json({ message: "server error" });

    if (files) {
      for (const key of Object.keys(files)) {
        const fileId = uuidv4();
        // const fileUrl = `${files[key].name}`.replace(/\s/g, "");
        // const filepath = path.join(__dirname, "..", "images", fileUrl);
        const originalFileName = files[key].name.replace(/\s/g, ""); // Remove spaces
        const fileExtension = path.extname(originalFileName); // Get file extension
        const uniqueFileName = `${path.basename(
          originalFileName,
          fileExtension
        )}-${fileId}${fileExtension}`;
        const filepath = path.join(
          __dirname,
          "..",
          "user-files",
          uniqueFileName
        );

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
        await UserFilesUrls.create({
          id: fileId,
          userUsername: username,
          userFileUrl: `user-files/${uniqueFileName}`,
        });
      }
    }

    return res
      .status(201)
      .json({ data: `user name by this username: ${result.username} created` });
  } catch (error) {
    console.log(error);
    logger(LOG_TYPE.Error, `${error}`, "error", "userController/createUser");
  }
};
const editUser = async (req: Request, res: Response) => {
  const { address, email, name, password, username, userStatus }: User =
    req.body;

  const foundUser = await Users.findOne({ where: { username: username } });
  if (!foundUser)
    return res.status(401).json({ message: "Username does not exist" });
  try {
    //if(username) foundUser.username = username;
    if (password) foundUser.password = password;
    if (email) foundUser.email = email;
    if (address) foundUser.address = address;
    if (name) foundUser.name = name;
    if (userStatus) {
      const validUserStatusTochange = Object.entries(USER_STATUS).map(
        ([key, value]) => value
      );
      if (!validUserStatusTochange.includes(userStatus) && userStatus)
        return res.status(400).json({ message: "UserStatus is invalid" });
      foundUser.userStatus = userStatus;
    }
    const result = await foundUser.save();
    if (!result) return res.status(500).json({ message: "server error" });
    return res
      .status(201)
      .json({ data: `user name by this username: ${result.username} updated` });
  } catch (error) {
    console.log(error);
    logger(LOG_TYPE.Error, `${error}`, "error", "userController/editUser");
  }
};
const changeUserStatus = async (req: Request, res: Response) => {
  const { username, userStatus }: UserInfo = req.body;

  if (!username) return res.status(400).json({ message: "username is Empty" });
  if (!userStatus)
    return res.status(400).json({ message: "userStatus is Empty" });

  const validUserStatusTochange = Object.entries(USER_STATUS).map(
    ([key, value]) => value
  );
  if (!validUserStatusTochange.includes(userStatus) && userStatus)
    return res.status(400).json({ message: "UserStatus is invalid" });
  try {
    const foundUser = await Users.findOne({ where: { username: username } });

    if (!foundUser)
      return res.status(401).json({ message: "Username does not exist" });
    if (userStatus) foundUser.userStatus = userStatus;

    const result = await foundUser.save();
    if (!result) return res.status(500).json({ message: "server error" });

    return res
      .status(201)
      .json({ data: `user name by this username: ${result.username} updated` });
  } catch (error) {
    console.log(error);
    logger(
      LOG_TYPE.Error,
      `${error}`,
      "error",
      "userController/changeUserStatus"
    );
  }
};
const getUserByUsername = async (req: AuthenticatedRequest, res: Response) => {
  const { username } = req.params;

  if (!username)
    return res.status(400).json({ message: "Username is required" });
  if (
    !(req.currentRole === ROLES_LIST.Admin || req.currentUsername === username)
  )
    return res.status(403).json({ message: "Forbidden requset" });
  try {
    const foundUser = await Users.findOne({
      where: { username: username },
      attributes: { exclude: ["password", "refreshToken", "role"] },
    });
    if (!foundUser)
      return res.status(401).json({ message: "Username does not exist" });

    return res.status(200).json({ data: foundUser });
  } catch (error) {
    console.log(error);
    logger(
      LOG_TYPE.Error,
      `${error}`,
      "error",
      "userController/getUserByUsername"
    );
  }
};
const getUsers = async (req: Request, res: Response) => {
  const {
    username,
    address,
    name,
    email,
    userStatus,
    isAscending = true,
    sortOn = "username",
    itemPerPage = 0,
    currentPage = 0,
  } = req.query as unknown as UserFilter;

  const direction = isAscending ? "ASC" : "DESC";
  try {
    const conditions: any = {};
    if (username) {
      conditions.username = {
        [Op.like]: `%${username}%`,
      };
    }
    if (userStatus) {
      conditions.userStatus = {
        [Op.eq]: Number(userStatus),
      };
    }
    if (name) {
      conditions.name = {
        [Op.like]: `%${name}%`,
      };
    }
    if (email) {
      conditions.email = {
        [Op.like]: `%${email}%`,
      };
    }
    if (address) {
      conditions.address = {
        [Op.like]: `%${address}%`,
      };
    }
    const { count, rows } = await Users.findAndCountAll({
      where: conditions,
      attributes: { exclude: ["password", "refreshToken"] },
      order: sortOn ? [[sortOn, direction]] : [],
      offset:
        itemPerPage && currentPage
          ? (Number(currentPage) - 1) * Number(itemPerPage)
          : undefined,
      limit: itemPerPage ? Number(itemPerPage) : undefined,
      include: [
        {
          model: UserFilesUrls,
          as: "userFiles",
          attributes: ["userFileUrl"],
        },
      ],
    });
    return res.status(200).json({ data: rows, count: count });
  } catch (error) {
    console.log(error);
    logger(LOG_TYPE.Error, `${error}`, "error", "userController/getUsers");
  }
};
const deleteUser = async (req: Request, res: Response) => {
  const { username }: any = req.params;
  if (!username) return res.status(400).json({ message: "username is Empty" });

  try {
    const foundUser = await Users.findOne({ where: { username: username } });

    if (!foundUser)
      return res.status(401).json({ message: "Username does not exist" });
    foundUser.userStatus = USER_STATUS.Deleted;

    const result = await foundUser.save();
    if (!result) return res.status(500).json({ message: "server error" });

    return res
      .status(201)
      .json({ data: `user name by this username: ${result.username} deleted` });
  } catch (error) {
    console.log(error);
    logger(
      LOG_TYPE.Error,
      `${error}`,
      "error",
      "userController/changeUserStatus"
    );
  }
};

export default {
  createUser,
  getUserByUsername,
  getUsers,
  editUser,
  changeUserStatus,
  deleteUser,
};
