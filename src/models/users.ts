import { DataTypes } from "sequelize";
import sequelize from "../utils/database";
import { ROLES_LIST } from "../middleware/verifyRoles";
import { USER_STATUS } from "../config/parameters/user-status";

const Users = sequelize.define("user", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.INTEGER,
    defaultValue: ROLES_LIST.User,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userStatus: {
    type: DataTypes.INTEGER,
    defaultValue: USER_STATUS.Pendding,
    allowNull: false,
  },
  refreshToken: DataTypes.STRING,
  recoveryCode: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Users;
