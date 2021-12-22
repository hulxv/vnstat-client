import { useEffect, useState, useContext, createContext } from "react";
import { ipcRenderer } from "electron";

const ConfigProvider = createContext({});

function Configration({ children }) {
	const [config, setConfig] = useState({});
	const [vnConfigs, setVnConfigs] = useState({});
	function GettingAppConfig() {
		ipcRenderer.send("get-config");
		ipcRenderer.on("send-config", (e, res) => {
			setConfig({ ...res });
		});
		return () => ipcRenderer.removeAllListeners("send-config");
	}

	function GettingVnConfig() {
		ipcRenderer.send("get-vn-configs");

		ipcRenderer.on("send-vn-configs", (e, res) => {
			setVnConfigs({ ...res });
		});

		return () => ipcRenderer.removeAllListeners("send-vn-config");
	}

	useEffect(() => {
		GettingAppConfig();
		GettingVnConfig();
	}, []);

	// ! Uncomment for debugging
	// useEffect(() => {
	// 	console.log("vnConfigs", vnConfigs);
	// }, [vnConfigs]);
	// useEffect(() => {
	// 	console.log("AppConfig", config);
	// }, [config]);

	function reloading() {
		setTimeout(() => {});
		GettingAppConfig();
		GettingVnConfig();
	}

	function EditConfig(key, value) {
		ipcRenderer.send("set-config", key, value);
		GettingAppConfig();
	}
	const value = {
		config,
		vnConfigs,
		reloading,
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
