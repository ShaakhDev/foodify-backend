import Path from "path";
import fs from "fs";

const homeDir = Path.resolve();

export default function (app) {
	return new Promise((resolve, reject) => {
		const routeDirectory = Path.join(homeDir, "src", "api", "routes");
		fs.readdir(routeDirectory, async (err, files) => {
			if (err) reject(err);

			for await (let routeName of files) {
				const routeFile = Path.join(homeDir, "src", "api", "routes", routeName);
				const route = await import(routeFile);

				if (route.default.path && route.default.router) {
					app.use("/api" + route.default.path, route.default.router);
				}
			}
			resolve(200);
		});
	});
}
