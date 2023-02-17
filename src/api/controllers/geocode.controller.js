import { locations } from "../../mocks/geocode/geocode.mock.js";
import { client } from "../../server.js";

export default class GeocodeController {
	static async getGeocode(req, res) {
		const { city, mock } = req.query;
		if (mock === "true") {
			const locationMock = locations[city.toLowerCase()];
			return res.status(200).json(locationMock);
		}
		console.log(process.env.GOOGLE_CLOUD_API_KEY);
		client
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
	}
}
