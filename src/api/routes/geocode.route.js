import { Router } from "express";
import GeocodeController from "../controllers/geocode.controller.js";
const GeocodeRouter = Router();

GeocodeRouter.get("/", GeocodeController.getGeocode);

export default {
	path: "/geocode",
	router: GeocodeRouter,
};
