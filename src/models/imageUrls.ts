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
  labId: {
    type: DataTypes.STRING,
    allowNull: true,  // Make sure to allow null so that it can be either a lab or product image
  },
  productId: {
    type: DataTypes.STRING,
    allowNull: true,  // Make sure to allow null so that it can be either a lab or product image
  },
});

module.exports = ImageUrls;
