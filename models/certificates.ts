import { DataTypes } from "sequelize";
import sequelize from "../utils/database";
import { CERTIFICATE_STATUS } from "../config/parameters/certificate-status";

const Certificates = sequelize.define("certificate", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  certificateStatus: {
    type: DataTypes.INTEGER,
    defaultValue: CERTIFICATE_STATUS.Active,
    allowNull: false,
  },
  filePath: {
    type: DataTypes.STRING,
  },
});

module.exports = Certificates;
