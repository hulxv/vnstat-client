import { useContext, useState, useEffect, createContext, useMemo } from "react";
import { ipcRenderer } from "electron";

export const vnStatContext = createContext();

export default function TrafficProvider({ children }) {
	const [traffic, setTraffic] = useState({
		month: [],
		day: [],
		year: [],
		main: [],
	});
	const [daemonStatus, setDaemonStatus] = useState("inactive");
	const [configs, setVnConfigs] = useState({});
	const [visualVnConfigs, setVisualVnConfigs] = useState({});
	const [isConfigChanged, setIsConfigChanged] = useState(false);

	useEffect(() => {
		getVnConfig();
		getTrafficData();
		getDaemonStatus();
	}, []);

	useEffect(() => {
		console.log(daemonStatus);
	}, [daemonStatus]);

	// * Change 'visualVnConfigs' when send vnstat configs from backend
	useEffect(() => {
		setVisualVnConfigs(configs);
	}, [configs]);

	// * To check if vnstat configs was changed or not
	useEffect(() => {
		let visualVnConfigsSortedObject = Object.keys(visualVnConfigs)
			.sort()
			.reduce((obj, key) => {
				obj[key] = visualVnConfigs[key];
				return obj;
			}, {});

		let vnConfigsSortedObject = Object.keys(configs)
			.sort()
			.reduce((obj, key) => {
				obj[key] = configs[key];
				return obj;
			}, {});

		setIsConfigChanged(
			!(
				JSON.stringify(vnConfigsSortedObject) ===
				JSON.stringify(visualVnConfigsSortedObject)
			),
		);
	}, [visualVnConfigs, configs]);

	function reloading() {
		ipcRenderer.send("get-traffic");
		ipcRenderer.send("get-vn-configs");
		ipcRenderer.send("get-vn-daemon-status");
	}

	// Traffic
	function getTrafficData() {
		ipcRenderer.on("send-traffic", (e, result) => {
			setTraffic(result);
		});
		return () => ipcRenderer.removeAllListeners("send-traffic");
	}

	// vnStat Configs
	function getVnConfig() {
		ipcRenderer.send("get-vn-configs");

		ipcRenderer.on("send-vn-configs", (e, result) => {
			setVnConfigs(result);
		});
		// Cleanup
		return () => ipcRenderer.removeAllListeners("send-vn-configs");
	}

	function changeVnStatConfigs(key, value) {
		setVisualVnConfigs({ ...visualVnConfigs, [key]: value });
	}
	function resetVnConfigs() {
		setVisualVnConfigs(configs);
	}

	function saveChanges() {
		let changes = Object.keys(configs)
			.filter((key) => configs[key] != visualVnConfigs[key])
			.map((changedKey) => ({
				[changedKey]: visualVnConfigs[changedKey],
			}));
		ipcRenderer && ipcRenderer.send("change-vn-configs", changes);
	}

	//  vnStat daemon
	function getDaemonStatus() {
		ipcRenderer.send("get-vn-daemon-status");

		ipcRenderer.on("send-vn-daemon-status", (e, res) => {
			setDaemonStatus(res);
		});
		return () => ipcRenderer.removeAllListeners("send-vn-daemon-status");
	}
	function stopDaemon() {
		ipcRenderer.send("stop-vn-daemon");
		ipcRenderer.send("get-vn-daemon-status");
	}
	function startDaemon() {
		ipcRenderer.send("start-vn-daemon");
		ipcRenderer.send("get-vn-daemon-status");
	}
	function restartDaemon() {
		ipcRenderer.send("restart-vn-daemon");
		ipcRenderer.send("get-vn-daemon-status");
	}

	// ** Context value

	const value = useMemo(
		() => ({
			traffic,
			configs,
			visualVnConfigs,
			isConfigChanged,
			daemonStatus,
			reloading,
			changeVnStatConfigs,
			resetVnConfigs,
			saveChanges,
			stopDaemon,
			startDaemon,
			restartDaemon,
		}),
		[traffic, configs, isConfigChanged, daemonStatus],
	);

	return (
		<vnStatContext.Provider value={value}>{children}</vnStatContext.Provider>
	);
}

export function useVnStat() {
	return useContext(vnStatContext);
}
