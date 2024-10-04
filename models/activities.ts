import { DataTypes } from "sequelize";
import sequelize from "../utils/database";

const Activities = sequelize.define("activity", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imagePath: {
    type: DataTypes.STRING,
  },
});

module.exports = Activities;
