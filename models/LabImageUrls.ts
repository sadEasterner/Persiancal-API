import { DataTypes } from 'sequelize';
import sequelize from '../utils/database';

const LabImageUrls = sequelize.define('labsImageUrls',{
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    labId: {
        type:DataTypes.STRING,
        allowNull: false
    }
});


module.exports =  LabImageUrls;