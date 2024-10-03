const Products = require("./products");
const Labs = require("./labs");
const Users = require("./users");
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

export { ImageUrls, Labs, Products, Users, UserFilesUrls };
