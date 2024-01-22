import express from "express";
import { Request, Response } from "express";
const router = express.Router();
import pool from "../utils/configs/db";
// middlewares
import {
  check_user_role,
  check_user_session,
} from "../middleware/check_user_session";
import { logoutController, viewADishController } from "../controllers/usersControllers";

// middleware specific to this router
router.use(async (req: Request, res: Response, next) => {
  try {
    // check if user is logged in
    const { session_token, user_id } = req.body;
    if (user_id) {
      const results = await check_user_session(user_id, session_token);

      if (results && results.isLogin) {
        // check if user has the right permission to add a dish
        const check_role = await check_user_role(user_id);
        // 2 for customers
        if (check_role && (check_role.data === 2 || check_role.data === 1)) {
          // customer - run the router
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

// view a dish - get a dish by ID
router.post("/v1/viewadish", viewADishController);

// logout, remove user token from auth table to end session
router.delete("/v1/logout", logoutController);

export default router;
