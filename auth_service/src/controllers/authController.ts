import pool from "../utils/configs/db";
import { generateRandomString } from "../utils/helpers";
import { Request, Response } from "express";
import { hashText, verifyHashText } from "../utils/encrypts";

export async function createAuthToken(user_id: string) {
  try {
    const token: string | null = generateRandomString();

    const result = await pool.query(
      "INSERT INTO auth(user_id, user_token) VALUES($1, $2)",
      [user_id, token]
    );
    if (token) {
      if (result && result.rowCount > 0) {
        return { message: "", token: token };
      } else {
        return { message: "failed to add auth session", token: null };
      }
    } else {
      return { message: "failed to make auth token", token: null };
    }
  } catch (err: any) {
    return { message: err.message, token: null };
  }
}

export async function registerController(req: Request, res: Response) {
  // controller
  try {
    var { user_name, user_email, user_password, user_role } = req.body;
    const hashedPWD: string | null = await hashText(user_password); // encrypt password
    //
    user_role = user_role.toLowerCase();
    user_email = user_email.toLowerCase();
    const result = await pool.query(
      "INSERT INTO users(user_name, user_email, user_password, user_role) VALUES($1, $2, $3, $4)",
      [user_name, user_email, hashedPWD, user_role]
    );
    //
    if (result && result.rowCount > 0) {
      res.status(201).json({
        message: "register user",
      });
    } else {
      res.status(201).json({
        message: "user not registered",
      });
    }
    //
  } catch (err: any) {
    res.status(501).json({ message: err.message });
  }
}

export async function loginController(req: Request, res: Response) {
  // controller
  try {
    let { user_email, user_password } = req.body;

    if (user_email) {
      user_email = user_email.toLowerCase();
      // valid email
      const data = await pool.query("SELECT * FROM users WHERE user_email=$1", [
        user_email,
      ]);
      // email is in the database
      if (data && data.rows && data.rows.length > 0) {
        const user_data = data.rows[0];
        // check if password and hashed password are the same
        const isCorrectPWD: boolean | null = await verifyHashText(
          user_password,
          user_data.user_password
        );
        // check if stored and provided password match
        if (isCorrectPWD) {
          // remove hashed password before sending back data
          delete user_data.user_password;
          // create a token for session here.
          const token = await createAuthToken(user_data.id);
          if (token && token.token) {
            res.status(201).json({
              message: "User found",
              data: { ...user_data, session_token: token.token },
            });
          }
          // when auth token failed. return message
          else {
            res.status(201).json({
              message: token.message,
              data: {},
            });
          }
        } else {
          res.status(201).json({ message: "User password is wrong" });
        }
      } else {
        res.status(201).json({ message: "User email not registered" });
      }
    } else {
      res.status(201).json({ message: "Please provide valid email" });
    }

    // const isValidPassword: boolean | null = await verifyHashText(user_password)
  } catch (err: any) {
    res.status(501).json({ message: err.message });
  }
}
