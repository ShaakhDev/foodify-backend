// import Path from "path";
const Path = require("path");
// import fs from "fs";
const fs = require("fs");

const homeDir = Path.resolve();

module.export = function (app) {
	return new Promise(function (resolve, reject) {
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
};
