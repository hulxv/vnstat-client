import { useContext, useState, useEffect, createContext } from "react";
import { ipcRenderer } from "electron";

export const vnStatContext = createContext();

export default function TrafficProvider({ children }) {
	const [traffic, setTraffic] = useState({
		month: [],
		day: [],
		year: [],
		main: [],
	});
	const [configs, setConfigs] = useState({});
	const [dataIsReady, setDataIsReady] = useState(false);

	useEffect(() => {
		getVnConfig();
		getTrafficData();
	}, []);

	function getTrafficData() {
		setDataIsReady(false);
		ipcRenderer.on("send-traffic", (e, result) => {
			setTraffic(result);
			setDataIsReady(true);
		});
		return () => ipcRenderer.removeAllListeners("send-traffic");
	}

	function getVnConfig() {
		ipcRenderer.send("get-vn-configs");

		ipcRenderer.on("send-vn-configs", (e, result) => {
			setConfigs(result);
		});

		return () => ipcRenderer.removeAllListeners("send-vn-config");
	}

	function reloading() {
		ipcRenderer.send("get-traffic");
		ipcRenderer.send("get-vn-configs");
	}

	const value = {
		traffic,
		dataIsReady,
		reloading,
		configs,
	};

	return (
		<vnStatContext.Provider value={value}>{children}</vnStatContext.Provider>
	);
}

export function useVnStat() {
	return useContext(vnStatContext);
}
