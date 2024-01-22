import express from "express";
import { Request, Response } from "express";
const router = express.Router();
import pool from "../utils/configs/db";



export async function viewADishController(req: Request, res: Response) {
	// controller
	try {
		const { dish_id } = req.body;
		if (dish_id) {
			const results = await pool.query(
				"SELECT *  FROM dish WHERE id::text=$1",
				[dish_id]
			);

			if (results && results.rowCount > 0) {
				res
					.status(201)
					.json({ message: "fetched the dish", data: results.rows });
			} else {
				res.status(201).json({ message: "failed to fetch dish", data: [] });
			}
		} else {
			res.status(201).json({ message: "Invalid information provided" });
		}
	} catch (err: any) {
		res.status(501).json({ message: err.message });
	}
}

export async function logoutController(req: Request, res: Response) {
	// controller
	try {
		const { user_id, session_token } = req.body;
		if (user_id && session_token) {
			const result = await pool.query(
				"DELETE FROM auth WHERE user_id::text=$1 AND user_token=$2 ",
				[user_id, session_token]
			);
			if (result && result.rowCount > 0) {
				res.status(201).json({ message: "user logged out", data: [] });
			} else {
				res.status(201).json({ message: "error logging out", data: [] });
			}
		} else {
			res.status(201).json({ message: "please provide valid data" });
		}
	} catch (err: any) {
		res.status(401).json({ message: err.message });
	}
}