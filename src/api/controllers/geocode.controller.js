import { locations } from "../../mocks/geocode/geocode.mock.js";

export default class GeocodeController {
	static async getGeocode(req, res) {
		const { city } = req.query;

		const locationMock = locations[city.toLowerCase()];
		return res.status(200).json(locationMock);
	}
}
