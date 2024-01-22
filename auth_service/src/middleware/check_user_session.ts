import pool from "../utils/configs/db";

const ROLES: string[] = [
  "admin",
  "admins",
  "administrator",
  "administrators",
  "customer",
  "customers",
];

const CUSTOMTER_ROLES: string[] = ["customer", "customers"];

const ADMIN_ROLES: string[] = [
  "admin",
  "admins",
  "administrator",
  "administrators",
];
// middleware - check if user is logged in and if there is auth token to that session
export async function check_user_session(user_id: string, token: string) {
  try {
    const result = await pool.query(
      "SELECT * FROM auth WHERE user_id::text=$1 AND user_token=$2 ",
      [user_id, token]
    );
    if (result && result.rowCount > 0) {
      return { message: "user logged in", isLogin: true };
    } else {
      return { message: "no user session found", isLogin: false };
    }
  } catch (err: any) {
    return { message: err.message, isLogin: false };
  }
}

// check user role like this, because you're can adit the role from the frontend. return data 1 for admin .. data 2 for customers.
export async function check_user_role(user_id: string) {
  try {
    const results = await pool.query(
      "SELECT user_role FROM users WHERE id::text=$1 ",
      [user_id]
    );
    if (results && results.rowCount > 0 && results.rows[0]) {
      const role = results.rows[0].user_role; // get role
      // check if role is for admin or customer and return right message
      if (CUSTOMTER_ROLES.includes(role))
        return { message: "customer user found", data: 2 };
      else if (ADMIN_ROLES.includes(role))
        return { message: "admin user found", data: 1 };
      else {
        return { message: "unautherized user found", data: 0 };
      }
    } else {
      return { message: "user not found", data: 0 };
    }
  } catch (err: any) {
    return { message: err.message, data: 0 };
  }
}
