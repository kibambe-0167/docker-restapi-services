import express from "express";
import { Request, Response } from "express";
const router = express.Router();
import pool from "../utils/configs/db";

async function setupController(req: Request, res: Response) {
  // controller
  try {
    // do some configs
    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    // create users's table
    await pool.query(
      "CREATE TABLE IF NOT EXISTS users (id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,user_name VARCHAR(100) NOT NULL,user_email VARCHAR(200) NOT NULL UNIQUE,user_password VARCHAR(255) NOT NULL,user_role VARCHAR(30) NOT NULL CHECK (user_role IN ('admin', 'admins', 'administrator','administrators', 'customer', 'customers')) ,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
    );

    // auth table for login session
    await pool.query(
      "CREATE TABLE IF NOT EXISTS auth (id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,user_id UUID REFERENCES users(id) NOT NULL UNIQUE,user_token VARCHAR(255) NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
    );

    // create dish table
    await pool.query(
      " CREATE TABLE IF NOT EXISTS dish (id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,user_id UUID REFERENCES users(id) NOT NULL,dish_name VARCHAR(100) NOT NULL,dish_description VARCHAR(255) NOT NULL,dish_image VARCHAR(255) NOT NULL,dish_price NUMERIC(10, 2) NOT NULL CHECK( dish_price >= 0 AND dish_price <= 10000 ),created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
    );

    // create dish images table
    // await pool.query(
    //   "CREATE TABLE IF NOT EXISTS dish_images (id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,user_id UUID REFERENCES users(id) NOT NULL,dish_id UUID REFERENCES dish(id) NOT NULL,image_path TEXT NOT NULL,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
    // );

    // create rating table
    await pool.query(
      "CREATE TABLE IF NOT EXISTS ratings (id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,user_id UUID REFERENCES users(id) NOT NULL,dish_id UUID REFERENCES dish(id) NOT NULL,rate NUMERIC(4, 1) NOT NULL CHECK ( rate >= 0 AND rate <= 5 ),created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
    );

    //
    res
      .status(200)
      .json({ message: "done setting up database tables/schemas" });

    //
  } catch (err: any) {
    // console.log("here ... ", err);
    res.status(401).json({ message: err.message });
  }
}

export default setupController;
