import { DataTypes } from 'sequelize';
import sequelize from '../utils/database';

const Product = sequelize.define('product',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: DataTypes.STRING,
    price: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ProductStatus: {
        type: DataTypes.NUMBER,
        defaultValue: 0,
    }
});

module.exports =  Product;