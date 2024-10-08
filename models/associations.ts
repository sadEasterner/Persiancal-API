const Products = require("./products");
const Labs = require("./labs");
const Users = require("./users");
const Providers = require("./providers");
const Activities = require("./activities");
const ImageUrls = require("./imageUrls");
const UserFilesUrls = require("./userFilesUrls");

// Labs
Labs.hasMany(ImageUrls, { foreignKey: "labId", as: "labImages" });
ImageUrls.belongsTo(Labs, { foreignKey: "labId", as: "lab" });

// Products
Products.hasMany(ImageUrls, { foreignKey: "productId", as: "productImages" });
ImageUrls.belongsTo(Products, { foreignKey: "productId", as: "product" });

//user files
Users.hasMany(UserFilesUrls, { foreignKey: "userUsername", as: "userFiles" });
UserFilesUrls.belongsTo(Users, { foreignKey: "userUsername", as: "user" });

Providers.hasMany(Activities, {
  foreignKey: "providerTitle",
  as: "providerActivities",
});
Activities.belongsTo(Providers, { foreignKey: "providerTitle", as: "provider" });

export {
  ImageUrls,
  Labs,
  Products,
  Users,
  UserFilesUrls,
  Activities,
  Providers,
};
