import express from "express";
import { Request, Response } from "express";
const router = express.Router();
// controllers
import setupController from "../controllers/setupController";

// middleware specific to this router
router.use((req: Request, res: Response, next) => {
  console.log("setup router");
  next();
});

router.get("/", setupController);

export default router;
