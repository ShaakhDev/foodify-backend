// import express from "express";
const express = require("express");
// import Routes from "./src/api/routes/index.js";
const Routes = require("./src/api/routes/index.js");
// import dotenv from "dotenv";
const dotenv = require("dotenv");
// import { Client } from "@googlemaps/google-maps-services-js";
const { Client } = require("@googlemaps/google-maps-services-js");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
export const client = new Client({});

async function server() {
	try {
		app.listen(PORT, () =>
			console.log(`Example app listening on port ${PORT}!`)
		);
		app.use(express.json());
		app.use(express.urlencoded({ extended: true }));

		await Routes(app);
	} catch (err) {
		console.log(err);
	}
}

module.export = server();
