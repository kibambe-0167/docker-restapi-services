import express from "express";
import { Request, Response } from "express";
const router = express.Router();
import pool from "../utils/configs/db";



// if userID already in [ratings] table update ratings, otherwise set the rating for the dish
export async function rateADishController(req: Request, res: Response) {
	// controller
	try {
		const { user_id, dish_id, rating } = req.body;

		const isCustomerIDFound = await pool.query(
			"SELECT *  FROM ratings WHERE user_id::text=$1",
			[user_id]
		);

		if (isCustomerIDFound && isCustomerIDFound.rowCount > 0) {
			// update rating
			const result = await pool.query(
				"UPDATE ratings SET rate=$1 WHERE user_id::text=$2 AND dish_id::text=$3 ",
				[rating, user_id, dish_id]
			);
			if (result && result.rowCount > 0) {
				res.status(501).json({ message: "dish rating updated" });
			} else {
				res.status(501).json({ message: "dish rating not updated" });
			}
		} else {
			// insert new dish rating
			const results = await pool.query(
				"INSERT INTO ratings(user_id, dish_id, rate) VALUES($1, $2, $3)",
				[user_id, dish_id, rating]
			);
			if (results && results.rowCount > 0) {
				res.status(501).json({ message: "dish rating added" });
			} else {
				res.status(501).json({ message: "dish rating not added" });
			}
		}
	} catch (err: any) {
		res.status(501).json({ message: err.message });
	}
}

// search a dish using key words, 
export async function searchADishController(req: Request, res: Response) {
	// controller
	try {
		let { keywords } = req.body;

		if (keywords) {
			// normalise and extract words
			keywords = keywords.toLowerCase();
			const words: string[] = keywords.split(" ");

			// make each word to be searchable
			const query_search: string = words
				.map(
					(i: string) =>
						`dish_name ILIKE '%${i}%' OR dish_description ILIKE '%${i}%'`
				)
				.join(" OR ");

			// make query string
			const query_string: string = `SELECT * FROM dish WHERE (${query_search})`;

			const results = await pool.query(query_string);
			// 
			if (results) {
				res
					.status(201)
					.json({ message: "searching a dish", data: results.rows });
			} else {
				res.status(201).json({ message: "no result found", data: [] });
			}
		}
		//
		else {
			res.status(201).json({ message: "provide valid query search term" });
		}
	} catch (err: any) {
		res.status(501).json({ message: err.message });
	}
}
