const express = require("express");
const { locations } = require("./src/mocks/geocode/geocode.mock.js");
const { mocks, addMockImage } = require("./src/mocks/places/mock/index.js");
const {
	addGoogleImage,
} = require("./src/api/controllers/places-nearby.controller.js");
const { Client } = require("@googlemaps/google-maps-services-js");
const dotenv = require("dotenv");
const { response } = require("express");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
const stripeclient = require("stripe")(process.env.STRIPE_SECRET_KEY);
const googleClient = new Client({});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.send("Express on Vercel");
});

app.get("/api/geocode", (req, res) => {
	const { city, mock } = req.query;
	if (mock === "true") {
		const locationMock = locations[city.toLowerCase()];
		return res.status(200).json(locationMock);
	}

	googleClient
		.geocode({
			params: {
				address: city,
				key: process.env.GOOGLE_CLOUD_API_KEY,
			},
			timeout: 1000, // milliseconds
		})
		.then(result => {
			return res.status(200).json(result.data);
		})
		.catch(e => {
			return res.status(400).json(e.response.data.error_message);
		});
});

app.get("/api/placesNearby", (req, res) => {
	const { location, mock, placeType = "restaurant" } = req.query;

	if (mock === "true") {
		const data = mocks[location];
		if (data) {
			data.results = data.results.map(addMockImage);
		}
		return res.status(200).json(data);
	}

	googleClient
		.placesNearby({
			params: {
				location,
				radius: 1500,
				type: placeType,
				key: process.env.GOOGLE_CLOUD_API_KEY,
			},
			timeout: 1000, // milliseconds
		})
		.then(result => {
			let data = result.data.results.map(addGoogleImage);
			result.data.results = data;

			return res.status(200).json(result.data);
		})
		.catch(e => res.status(400).json(e.response.data.error_message));
});

app.post("/api/pay", (req, res) => {
	const { token, amount } = req.body;
	console.log(process.env.STRIPE_SECRET_KEY);
	stripeclient.paymentIntents
		.create({
			amount,
			currency: "USD",
			payment_method_types: ["card"],
			payment_method_data: {
				type: "card",
				card: {
					token,
				},
			},
			confirm: true,
		})
		.then(paymentIntent => {
			res.json(paymentIntent);
		})
		.catch(e => {
			console.log(e);
			res.status(400).json("Payment Failed", e);
		});
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

module.exports = { app };
