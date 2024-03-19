require('dotenv').config();
import { Sequelize } from 'sequelize';
const sequelize = new Sequelize(process.env.DATABASE_NAME!, process.env.DATABASE_USERNAME!, process.env.DATABASE_PASSWORD!, {
    dialect: 'mysql',
    host: 'localhost'
})

export default sequelize;