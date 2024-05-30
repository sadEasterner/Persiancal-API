

const ProductImageUrls = require('../models/productImageUrls');
const Products = require('../models/products');


Products.hasMany(ProductImageUrls, { foreignKey: 'productId', as: 'images' });
ProductImageUrls.belongsTo(Products, { foreignKey: 'productId', as: 'product' });

export { Products, ProductImageUrls };