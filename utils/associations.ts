const Products = require("../models/products");
const ImageUrls = require("../models/imageUrls");
const Labs = require("../models/products");

// Labs
Labs.hasMany(ImageUrls, { foreignKey: "itemId", as: "labImages" });
ImageUrls.belongsTo(Labs, { foreignKey: "itemId", as: "lab" });
// products association
Products.hasMany(ImageUrls, { foreignKey: "itemId", as: "productImages" });
ImageUrls.belongsTo(Products, {
  foreignKey: "itemId",
  as: "product",
});

export { ImageUrls, Labs, Products };
