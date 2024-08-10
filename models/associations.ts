const Products = require("./products");
const Labs = require("./labs");
const ImageUrls = require("./imageUrls");

// Labs
Labs.hasMany(ImageUrls, { foreignKey: "labId", as: "labImages" });
ImageUrls.belongsTo(Labs, { foreignKey: "labId", as: "lab" });

// Products
Products.hasMany(ImageUrls, { foreignKey: "productId", as: "productImages" });
ImageUrls.belongsTo(Products, { foreignKey: "productId", as: "product" });

export { ImageUrls, Labs, Products };
