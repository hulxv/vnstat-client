module.exports = {
	reactStrictMode: true,

	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.target = "electron-renderer";
			config.node = {
				__dirname: true,
			};
		}
		var isProduction = config.mode === "production";
		if (!isProduction) {
			config.optimization.minimize = false;
			config.optimization.minimizer = [];
		}

		return config;
	},
};
