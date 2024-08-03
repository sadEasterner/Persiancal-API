import { DataTypes } from "sequelize";
import sequelize from "../utils/database";

const ImageUrls = sequelize.define("imageUrls", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  itemId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = ImageUrls;
