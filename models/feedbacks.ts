import { DataTypes } from 'sequelize';
import sequelize from '../utils/database';

const Feedbacks = sequelize.define('feedback',{
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    senderName:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

module.exports = Feedbacks;