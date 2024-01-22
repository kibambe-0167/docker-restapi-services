import express from "express";
import { Request, Response } from "express";
const router = express.Router();
// controllers
import {
  registerController,
  loginController,
} from "../controllers/authController";

// middleware specific to this router
router.use((req: Request, res: Response, next) => {
  console.log("Middleware Auth Router");
  next();
});

// register user account
router.post("/v1/register", registerController);

// login user
router.post("/v1/login", loginController);

export default router;
