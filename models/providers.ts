import { DataTypes } from "sequelize";
import sequelize from "../utils/database";

const Providers = sequelize.define("provider", {
  providerTitle: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  address: { type: DataTypes.TEXT, allowNull: false },
  aboutUs: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fax: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Providers;
