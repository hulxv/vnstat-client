// This Script used to rename images in screenshots folder

const fs = require("fs");

const dir = ".";
const extensionTargets = ["png"];

fs.readdirSync(dir)
	.filter(file => {
		let splitFileToGetExtension = file.split(".");
		let fileExt = splitFileToGetExtension.at(
			splitFileToGetExtension.length - 1
		);

		return extensionTargets.includes(fileExt);
	})
	.forEach(file => {
		let newName = file.split(" ").slice(-2).join("-");
		try {
			console.log(`Change '${file}' to '${newName}'`);
			fs.renameSync(file, newName);
		} catch (err) {
			console.log(err);
		}
	});
