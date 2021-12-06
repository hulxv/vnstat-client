import { useEffect, useState, useContext, createContext } from "react";
import { ipcRenderer } from "electron";

const ConfigProvider = createContext({});

function Configration({ children }) {
	const [config, setConfig] = useState({});

	function GettingConfig() {
		ipcRenderer.send("get-config");

		ipcRenderer.on("send-config", (e, res) => setConfig({ ...res }));
	}

	useEffect(() => {
		GettingConfig();
	}, []);

	// ** Uncomment to debugging
	useEffect(() => {
		console.log(config);
	}, [config]);

	function Reload() {
		GettingConfig();
	}

	function EditConfig(key, value) {
		ipcRenderer.send("set-config", key, value);
		GettingConfig();
	}
	const value = {
		config: { ...config },
		Reload,
		EditConfig,
	};

	return (
		<ConfigProvider.Provider value={value}>{children}</ConfigProvider.Provider>
	);
}

export function useConfig() {
	return useContext(ConfigProvider);
}

export default Configration;
