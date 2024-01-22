require("dotenv").config();
import express from "express";
import { Request, Response } from "express";
import bodyParser from "body-parser";
import pool from "./src/utils/configs/db";
const cors = require("cors");
// routers
import AdminRouter from "./src/routers/admin";
import CustomerRouter from "./src/routers/customers";
import UsersRouter from "./src/routers/users";
// middlewares
import AuthBearerMiddleware from "./src/middleware/bearerMiddleware";

// configs
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//
// API ENDPOINTS

app.get("/", AuthBearerMiddleware, (req: Request, res: Response) => {
  res.json({ message: "the dancing pony dish service!" });
});

// Admin Router
app.use("/admin", AuthBearerMiddleware, AdminRouter);

// Customer Router
app.use("/customer", AuthBearerMiddleware, CustomerRouter);

// Users[ Customer && Admin ] Router
app.use("/users", AuthBearerMiddleware, UsersRouter);

//
//
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
