const Products = require("../models/products");
const ImageUrls = require("../models/imageUrls");
const Labs = require("../models/products");

// Labs
Labs.hasMany(ImageUrls, { foreignKey: "itemId", as: "images" });
ImageUrls.belongsTo(Labs, { foreignKey: "itemId", as: "product" });
// products association
Products.hasMany(ImageUrls, { foreignKey: "itemId", as: "images" });
ImageUrls.belongsTo(Products, {
  foreignKey: "itemId",
  as: "product",
});

export { ImageUrls, Labs, Products };
