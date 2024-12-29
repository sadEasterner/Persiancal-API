import { DataTypes } from "sequelize";
import sequelize from "../utils/database";
import { CONSULTATION_STATUS } from "../config/parameters/consultation-status";

const Consultations = sequelize.define("consultation", {
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
  consultationStatus: {
    type: DataTypes.INTEGER,
    defaultValue: CONSULTATION_STATUS.Active,
    allowNull: false,
  },
  imagePath: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  attachmentPath: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Consultations;
