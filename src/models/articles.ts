import { DataTypes } from "sequelize";
import sequelize from "../utils/database";
import { ARTICLE_STATUS } from "../config/parameters/article-status";

const Articles = sequelize.define("article", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  articleStatus: {
    type: DataTypes.INTEGER,
    defaultValue: ARTICLE_STATUS.Active,
    allowNull: false,
  },
  attachmentUrl: {
    type: DataTypes.STRING,
  },
});

module.exports = Articles;
