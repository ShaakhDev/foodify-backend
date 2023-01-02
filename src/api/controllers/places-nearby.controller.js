import { mocks, addMockImage } from "../../mocks/places/mock/index.js";

export default class PlacesNearbyController {
	static async getPlacesNearby(req, res) {
		const { location } = req.query;
		// const placesNearby = await PlacesNearbyService.getPlacesNearby(location);
		const data = mocks[location];
		if (data) {
			data.results = data.results.map(addMockImage);
		}
		// return res.status(200).json(placesNearby);
		return res.status(200).json(data);
	}
}
