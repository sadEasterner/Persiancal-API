import { DataTypes } from 'sequelize';
import sequelize from '../utils/database';
import { LAB_STATUS } from '../config/parameters/lab-status';

const Labs = sequelize.define('lab',{
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    labStatus: {
        type: DataTypes.INTEGER,
        defaultValue: LAB_STATUS.Active,
        allowNull: false
    },
});

module.exports = Labs;