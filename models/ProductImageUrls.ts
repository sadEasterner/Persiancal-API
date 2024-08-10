import { DataTypes } from 'sequelize';
import sequelize from '../utils/database';

const ProductImageUrls = sequelize.define('productsImageUrls',{
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productId: {
        type:DataTypes.STRING,
        allowNull: false
    }
});


module.exports =  ProductImageUrls;