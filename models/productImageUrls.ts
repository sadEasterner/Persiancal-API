import { DataTypes } from 'sequelize';
import sequelize from '../utils/database';

const ProductImageUrl = sequelize.define('imageUrl',{
    id: {
        type: DataTypes.INTEGER,
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

module.exports =  ProductImageUrl;