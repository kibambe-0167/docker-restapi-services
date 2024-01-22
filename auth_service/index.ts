require("dotenv").config();
import express from "express";
import { Request, Response } from "express";
import bodyParser from "body-parser";
import pool from "./src/utils/configs/db";
const cors = require("cors");
// routers
import SetupRouter from "./src/routers/setup";
import AuthRouter from "./src/routers/auth";
// middlewares
import AuthBearerMiddleare from "./src/middleware/bearerMiddleware";

// configs
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//
// API ENDPOINTS

app.get("/", AuthBearerMiddleare, (req: Request, res: Response) => {
  res.json({ message: "the dancing pony auth service!" });
});

// set up datatabase tables
app.use("/setup", AuthBearerMiddleare, SetupRouter);

// Auth Router
app.use("/auth", AuthBearerMiddleare, AuthRouter);

//
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
