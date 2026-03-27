import { useEffect, useState, useContext, createContext, useMemo } from "react";
import { ipcRenderer } from "electron";

const ConfigProvider = createContext({});

function Configuration({ children }) {
	const [config, setConfig] = useState({});
	function GettingAppConfig() {
		ipcRenderer.send("get-config");
		ipcRenderer.on("send-config", (e, res) => {
			setConfig({ ...res });
		});
		return () => ipcRenderer.removeAllListeners("send-config");
	}

	useEffect(() => {
		GettingAppConfig();
	}, []);

	// ! Uncomment for debugging

	// useEffect(() => {
	// 	console.log("AppConfig", config);
	// }, [config]);

	function reloading() {
		ipcRenderer.send("get-config");
	}

	function EditConfig(key, value) {
		ipcRenderer.send("set-config", key, value);
	}
	const value = useMemo(
		() => ({
			config,
			reloading,
			EditConfig,
		}),
		[config],
	);

	return (
		<ConfigProvider.Provider value={value}>{children}</ConfigProvider.Provider>
	);
}

export function useConfig() {
	return useContext(ConfigProvider);
}

export default Configuration;
