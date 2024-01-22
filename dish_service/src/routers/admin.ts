import express from "express";
import { Request, Response } from "express";
const router = express.Router();
import pool from "../utils/configs/db";
// middlewares
import {
  check_user_role,
  check_user_session,
} from "../middleware/check_user_session";
// controllers
import { getAllDishController, addDishController, deleteADishController, updateADishController, } from "../controllers/adminController";

// middleware specific to this router
router.use(async (req: Request, res: Response, next) => {
  try {
    // console.log("Admin Router Middleware");
    // check if admin is logged in
    const { session_token, user_id } = req.body;
    if (user_id) {
      const results = await check_user_session(user_id, session_token);

      if (results && results.isLogin) {
        // check if user has the right permission to add a dish
        const check_role = await check_user_role(user_id);
        if (check_role && check_role.data === 1) {
          // admin - run the router
          next();
        } else {
          res.status(201).json({ message: check_role.message });
        }
      } else {
        res.status(201).json({ message: results.message });
      }
    } else {
      res.status(201).json({ message: "Invalid user ID" });
    }
  } catch (err: any) {
    res.status(501).json({ message: err.message });
  }
});

// get all dishes
router.post("/v1/getalldish", getAllDishController);

// admin, add dish to database
router.post("/v1/createdish", addDishController);

// delete dish
router.delete("/v1/deleteadish", deleteADishController);

// update dish
router.post("/v1/updateadish", updateADishController);

export default router;
