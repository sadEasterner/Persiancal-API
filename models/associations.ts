const Products = require("./products");
const Labs = require("./labs");
const ImageUrls = require("./imageUrls");

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
