// index.ts

import express, { Request, Response } from "express";
import { corsOption } from "./config/corsOptions";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { reqLogger } from "./middleware/logEvents";
import sequelize from "./utils/database";
import product from "./routes/products";
import lab from "./routes/lab";
import auth from "./routes/auth";
import user from "./routes/user";
import feedback from "./routes/feedback";
import course from "./routes/course";
import article from "./routes/article";
import certificate from "./routes/certificate";
import consultation from "./routes/consultation";
import activity from "./routes/activity";
import { verifyJWT } from "./middleware/verifyJWT";
require("./models/products");
require("./models/imageUrls");
require("./models/users");
require("./models/labs");
require("./models/feedbacks");
require("./models/courses");
require("./models/articles");
require("./models/associations");
require("./models/userFilesUrls");
require("./models/certificates");
require("./models/consultations");
require("./models/activities");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3500;

app.use(reqLogger);
app.use(cors(corsOption));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/attachments", express.static(path.join(__dirname, "attachments")));
app.use("/user-files", express.static(path.join(__dirname, "user-files")));
app.use("/certificates", express.static(path.join(__dirname, "certificates")));

app.use("/auth", auth);
app.use("/product", product);
app.use("/lab", lab);
app.use("/feedback", feedback);
app.use("/course", course);
app.use("/article", article);
app.use("/certificate", certificate);
app.use("/consultation", consultation);
app.use("/activity", activity);
app.use(verifyJWT);
app.use("/user", user);

app.all("*", (req: Request, res: Response) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    await sequelize.sync();
    console.log("Models synchronized with the database.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
