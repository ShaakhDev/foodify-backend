import { Router } from "express";
import PlacesNearbyController from "../controllers/places-nearby.controller.js";

const PlacesNearbyRouter = Router();

PlacesNearbyRouter.get("/", PlacesNearbyController.getPlacesNearby);

export default {
	path: "/placesNearby",
	router: PlacesNearbyRouter,
};
