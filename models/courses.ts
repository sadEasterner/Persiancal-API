import { DataTypes } from "sequelize";
import sequelize from "../utils/database";
import { COURSE_STATUS } from "../config/parameters/course-status";

const Courses = sequelize.define("course", {
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
  courseStatus: {
    type: DataTypes.INTEGER,
    defaultValue: COURSE_STATUS.Active,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
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

module.exports = Courses;
