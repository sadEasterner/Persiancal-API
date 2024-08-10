// const Products = require("./products");
// const Labs = require("./labs");
// const ImageUrls = require("./imageUrls");

// // Labs
// Labs.hasMany(ImageUrls, { foreignKey: "itemId", as: "labImages" });
// ImageUrls.belongsTo(Labs, { foreignKey: "itemId", as: "lab" });
// // products association
// Products.hasMany(ImageUrls, { foreignKey: "itemId", as: "productImages" });
// ImageUrls.belongsTo(Products, {
//   foreignKey: "itemId",
//   as: "product",
// });

// export { ImageUrls, Labs, Products };

const ProductImageUrls = require("../models/productImageUrls");
const Products = require("../models/products");

const LabImageUrls = require("../models/labImageUrls");
const Labs = require("../models/labs");

Products.hasMany(ProductImageUrls, { foreignKey: "productId", as: "productImages" });
ProductImageUrls.belongsTo(Products, {
  foreignKey: "productId",
  as: "product",
});

Labs.hasMany(LabImageUrls, { foreignKey: "labId", as: "labImages" });
LabImageUrls.belongsTo(Labs, { foreignKey: "labId", as: "lab" });

export { Products, ProductImageUrls, Labs, LabImageUrls };
