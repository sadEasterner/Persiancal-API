import { DataTypes } from 'sequelize';
import sequelize from '../utils/database';
import { COURSE_STATUS } from '../config/parameters/course-status';

const Courses = sequelize.define('course',{
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    provider: {
        type: DataTypes.STRING,
        allowNull: false
    },
    courseStatus: {
        type: DataTypes.INTEGER,
        defaultValue: COURSE_STATUS.Active,
        allowNull: false
    },
});

module.exports = Courses;