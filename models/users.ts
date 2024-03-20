import { DataTypes } from 'sequelize';
import sequelize from '../utils/database';

const User = sequelize.define('user',{
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    roles: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userStatus: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    refreshToken: DataTypes.STRING,
    emial: {
        type:DataTypes.STRING,
        allowNull: false
    },
    address:{
        type:DataTypes.STRING,
        allowNull: false
    }
});

module.exports = User;