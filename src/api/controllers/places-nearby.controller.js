import { mocks, addMockImage } from "../../mocks/places/mock/index.js";
import { client } from "../../../index.js";

const addGoogleImage = restaurant => {
	const ref = restaurant.photos && restaurant.photos[0].photo_reference;
	if (!ref) {
		restaurant.photos = [
			"https://www.foodiesfeed.com/wp-content/uploads/2019/06/top-view-for-box-of-2-burgers-home-made-600x899.jpg",
		];
		return restaurant;
	}

	restaurant.photos = [
		`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${process.env.GOOGLE_CLOUD_API_KEY}`,
	];
	return restaurant;
};

export default class PlacesNearbyController {
	static async getPlacesNearby(req, res) {
		const { location, mock } = req.query;
		// const placesNearby = await PlacesNearbyService.getPlacesNearby(location);
		if (mock === "true") {
			const data = mocks[location];
			if (data) {
				data.results = data.results.map(addMockImage);
			}
			return res.status(200).json(data);
		}

		client
			.placesNearby({
				params: {
					location,
					radius: 1500,
					type: "restaurant",
					key: process.env.GOOGLE_CLOUD_API_KEY,
				},
				timeout: 1000, // milliseconds
			})
			.then(result => {
				result.data.results = result.data.results.map(addGoogleImage);
				return res.status(200).json(result.data);
			})
			.catch(e => res.status(400).json(e.resonse.data.error_message));
	}
}
