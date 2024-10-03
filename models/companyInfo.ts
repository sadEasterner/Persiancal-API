import { DataTypes, UUIDV4 } from "sequelize";
import sequelize from "../utils/database";

const CompanyInfo = sequelize.define("companyInfo", {
  provider: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  aboutUsText: {
    type: DataTypes.TEXT("long"),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
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
    validate: {
      isEmail: true,
    },
  },
});

module.exports = CompanyInfo;
