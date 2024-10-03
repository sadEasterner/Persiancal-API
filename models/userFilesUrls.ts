import { DataTypes } from "sequelize";
import sequelize from "../utils/database";

const UserFilesUrls = sequelize.define("userFilesUrls", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  userFileUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userUsername: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = UserFilesUrls;
