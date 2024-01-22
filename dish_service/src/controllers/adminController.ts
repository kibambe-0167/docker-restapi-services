import express from "express";
import { Request, Response } from "express";
import pool from "../utils/configs/db";


export async function getAllDishController(req: Request, res: Response) {
	// controller
	try {
		const results = await pool.query("SELECT * FROM dish");
		if (results && results.rows.length > 0) {
			return res.status(201).json({ message: "success", data: results.rows });
		} else {
			return res.status(201).json({ message: "no dishes", data: null });
		}
	} catch (err: any) {
		res.status(501).json({ message: err.message });
	}
}

// add a dish to the database
export async function addDishController(req: Request, res: Response) {
	// controller
	try {
		let {
			user_id,
			dish_name,
			dish_description,
			dish_image,
			dish_price,
			session_token,
		} = req.body;

		dish_name = dish_name.toLowerCase();
		dish_description = dish_description.toLowerCase();

		const results = await pool.query(
			"INSERT INTO dish(user_id, dish_name, dish_description, dish_image, dish_price) VALUES($1,$2,$3,$4,$5)",
			[user_id, dish_name, dish_description, dish_image, dish_price]
		);

		if (results && results.rowCount > 0) {
			res.status(201).json({
				message: "restaurant dish added",
				data: {},
			});
		} else {
			res.status(201).json({
				message: "dish not to be added",
				data: {},
			});
		}
	} catch (err: any) {
		res.status(501).json({ message: err.message });
	}
}

// delete a dish from the database
export async function deleteADishController(req: Request, res: Response) {
	// controller
	try {
		const { user_id, dish_id } = req.body;

		const results = await pool.query(
			"DELETE FROM dish WHERE id::text=$1 AND user_id::text=$2 ",
			[dish_id, user_id]
		);
		if (results && results.rowCount > 0) {
			return res.status(201).json({ message: "dish deleted" });
		} else {
			return res.status(201).json({ message: "dish not deleted" });
		}
	} catch (err: any) {
		res.status(501).json({ message: err.message });
	}
}

// update a dish
export async function updateADishController(req: Request, res: Response) {
	// controller
	try {
		const { dish_id, dish_name, dish_description, dish_image, dish_price } =
			req.body;
		const results = await pool.query(
			"UPDATE dish SET dish_name=$1, dish_description=$2, dish_image=$3, dish_price=$4 WHERE id::text=$5 ",
			[dish_name, dish_description, dish_image, dish_price, dish_id]
		);

		if (results && results.rowCount > 0) {
			res.status(501).json({ message: `dish, ${dish_name} updated` });
		} else {
			res.status(501).json({ message: `dish, ${dish_name} not updated` });
		}
	} catch (err: any) {
		res.status(501).json({ message: err.message });
	}
}