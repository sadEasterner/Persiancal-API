// index.ts

import express, { Request, Response } from 'express';
import { corsOption } from './config/corsOptions';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { reqLogger } from './middleware/logEvents';
import sequelize from './utils/database';
import product from './routes/products';
const Product = require('./models/products');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3500;

app.use(reqLogger);
app.use(cors(corsOption));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());


app.use('/product', product);

app.all('*', (req: Request, res: Response) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    try {
        // Test the database connection
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // Sync the models with the database (this will create tables if they don't exist)
        await sequelize.sync({ force: true });
        console.log('Models synchronized with the database.');

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});