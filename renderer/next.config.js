module.exports = {
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.target = "electron-renderer";
		}
		var isProduction = config.mode === "production";
		if (!isProduction) {
			config.optimization.minimize = false;
			config.optimization.minimizer = [];
		}

		return config;
	},
};
