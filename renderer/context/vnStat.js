import {
	useContext,
	useState,
	useEffect,
	createContext,
	useMemo,
	useReducer,
	useCallback,
	memo,
	useRef,
} from "react";
import { ipcRenderer } from "electron";
import { useConfig } from "./configuration";
export const vnStatContext = createContext();

export default function vnStatProvider({ children }) {
	// Re-render
	const [reRenderState, reRender] = useState();

	const forceReRender = () => reRender(Math.random());

	const channels = [
		"get-traffic",
		"get-vn-configs",
		"get-vn-daemon-status",
		"get-vnstat-interfaces",
		"get-vnstat-database-tables-list",
	];

	const { config: appConfig } = useConfig();

	const [traffic, setTraffic] = useState({
		month: [],
		day: [],
		year: [],
		week: [],
		summary: [],
	});
	const [daemonStatus, setDaemonStatus] = useState("inactive");

	const [configs, setVnConfigs] = useState({});
	const visualVnConfigs = useRef({});
	const [isConfigChanged, setIsConfigChanged] = useState(false);
	const changes = useRef([]);

	const [interfaces, setInterfaces] = useState([]);
	const [interfaceID, setInterfaceID] = useState(appConfig?.interface ?? 1);

	const [databaseTablesList, setDatabaseTablesList] = useState([]);

	useEffect(() => {
		getVnConfig();
		getTrafficData();
		getDaemonStatus();
		getVnStatInterfaces();
		getDatabaseTablesList();
	}, []);

	// When user change the interface
	useEffect(() => {
		setInterfaceID(appConfig?.interface);
	}, [appConfig?.interface]);

	// ! Uncomment for debugging
	// useEffect(() => {
	// 	console.log(daemonStatus);
	// }, [daemonStatus]);
	// useEffect(() => {
	// 	console.log(changes);
	// }, [changes]);

	// * Change 'visualVnConfigs' when send vnstat configs from backend
	useEffect(() => {
		visualVnConfigs.current = configs;
		calcChanges();
	}, [configs]);

	// Traffic
	function getTrafficData() {
		ipcRenderer.on("send-traffic", (e, result) => {
			setTraffic(result);
		});
		return () => ipcRenderer.removeAllListeners("send-traffic");
	}

	// vnStat Configs
	function getVnConfig() {
		ipcRenderer.on("send-vn-configs", (e, result) => {
			setVnConfigs(result);
			// console.log(result);
		});
		// Cleanup
		return () => ipcRenderer.removeAllListeners("send-vn-configs");
	}

	function calcChanges() {
		changes.current = Object.keys(configs)
			.filter((key) => configs[key] != visualVnConfigs.current[key])
			.map((key) => ({ [key]: visualVnConfigs.current[key] }));
		changes.current = changes.current.concat(
			Object.keys(visualVnConfigs.current)
				.filter((key) => !Object.keys(configs).includes(key))
				.map((key) => ({ [key]: visualVnConfigs.current[key] })),
		);

		setIsConfigChanged(changes.current.length > 0);
	}

	function changeVnStatConfigs(key, value) {
		visualVnConfigs.current = { ...visualVnConfigs.current, [key]: value };
		calcChanges();
	}

	function resetVnConfigs() {
		visualVnConfigs.current = configs;
		calcChanges();
	}

	function saveChanges() {
		if (ipcRenderer) ipcRenderer.send("change-vn-configs", changes.current);
	}

	//  vnStat daemon
	function getDaemonStatus() {
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

	// Interfaces
	function getVnStatInterfaces() {
		ipcRenderer.on("send-vnstat-interfaces", (e, result) => {
			setInterfaces(result);
		});
	}

	function changeInterface(id) {
		setInterfaceID(id);
	}

	function filterTrafficDataByInterfaceID() {
		return {
			...Object.fromEntries(
				Object.keys(traffic).map((key) => [
					key,
					traffic[key].filter(
						(e) => (e?.interface ?? e.data.interface) == interfaceID,
					),
				]),
			),
		};
	}

	// Database
	function getDatabaseTablesList() {
		ipcRenderer.on("send-vnstat-database-tables-list", (e, result) => {
			setDatabaseTablesList(result);
		});
	}
	// ! Uncomment for debugging
	// useEffect(() => {
	// 	console.log("databaseTablesList", databaseTablesList);
	// }, [databaseTablesList]);

	// Reloading function
	function reloading() {
		channels.forEach((channel) => {
			ipcRenderer.send(channel);
		});
	}

	// ** Context value

	const value = useMemo(
		() => ({
			traffic: filterTrafficDataByInterfaceID(),
			configs,
			changes: changes.current,
			visualVnConfigs,
			isConfigChanged,
			daemonStatus,
			interfaces,
			interfaceID,
			databaseTablesList,
			reloading,
			changeVnStatConfigs,
			resetVnConfigs,
			saveChanges,
			stopDaemon,
			startDaemon,
			restartDaemon,
			changeInterface,
			getDatabaseTablesList,
			forceReRender,
		}),
		// **  Re-render only when change these values (memoization)
		[
			traffic,
			configs,
			isConfigChanged,
			daemonStatus,
			interfaceID,
			databaseTablesList,
			reRenderState,
		],
	);

	return (
		<vnStatContext.Provider value={value}>{children}</vnStatContext.Provider>
	);
}

export function useVnStat() {
	return useContext(vnStatContext);
}
