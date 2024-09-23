import { DataTypes } from "sequelize";
import sequelize from "../utils/database";
import { PRODUCT_STATUS } from "../config/parameters/products-status";

const Products = sequelize.define("product", {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  title: DataTypes.STRING,
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productStatus: {
    type: DataTypes.INTEGER,
    defaultValue: PRODUCT_STATUS.Enable,
  },
});

module.exports = Products;
