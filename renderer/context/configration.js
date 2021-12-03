import { useEffect, useState, useContext, createContext } from "react";
import { ipcRenderer } from "electron";

const ConfigProvider = createContext({});

function Configration({ children }) {
	const [config, setConfig] = useState({});

	useEffect(() => {
		ipcRenderer.send("get-config");

		ipcRenderer.on("send-config", (e, res) => {
			setConfig({ ...res });
			console.log("res", res);
			console.log("config", config);
		});
	}, []);
	useEffect(() => {
		console.log(config);
	}, [config]);

	function reload() {}

	const value = {
		config: { ...config },
	};

	return (
		<ConfigProvider.Provider value={value}>{children}</ConfigProvider.Provider>
	);
}

export function useConfig() {
	return useContext(ConfigProvider);
}

export default Configration;
