import {
	useContext,
	useState,
	useEffect,
	createContext,
	useMemo,
	useCallback,
	useRef,
} from "react";
import { invoke } from "@tauri-apps/api/core";
import { useConfig } from "../configuration";

export const vnStatContext = createContext();

export default function vnStatProvider({ children }) {
	const [reRenderState, reRender] = useState();
	const forceReRender = () => reRender(Math.random());

	const { config: appConfig } = useConfig();

	const [traffic, setTraffic] = useState({
		month: [], day: [], year: [], week: [], summary: [],
	});
	const [daemonStatus, setDaemonStatus] = useState(false);
	const [configs, setVnConfigs] = useState({});
	const visualVnConfigs = useRef({});
	const [isConfigChanged, setIsConfigChanged] = useState(false);
	const changes = useRef([]);
	const [interfaces, setInterfaces] = useState([]);
	const [interfaceID, setInterfaceID] = useState(appConfig?.interface ?? 1);

	useEffect(() => {
		getVnConfig();
		getTrafficData();
		getDaemonStatus();
		getVnStatInterfaces();
	}, []);

	useEffect(() => {
		setInterfaceID(appConfig?.interface);
	}, [appConfig?.interface]);

	useEffect(() => {
		visualVnConfigs.current = configs;
		calcChanges();
	}, [configs]);

	async function getTrafficData() {
		try {
			const result = await invoke("get_traffic");
			setTraffic(result);
		} catch (err) {
			console.error("get_traffic failed:", err);
		}
	}

	async function getVnConfig() {
		try {
			const result = await invoke("get_vn_configs");
			setVnConfigs(result ?? {});
		} catch (err) {
			console.error("get_vn_configs failed:", err);
		}
	}

	function calcChanges() {
		changes.current = Object.keys(configs)
			.filter(key => configs[key] != visualVnConfigs.current[key])
			.map(key => ({ [key]: visualVnConfigs.current[key] }));
		changes.current = changes.current.concat(
			Object.keys(visualVnConfigs.current)
				.filter(key => !Object.keys(configs).includes(key))
				.map(key => ({ [key]: visualVnConfigs.current[key] }))
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

	async function saveChanges() {
		try {
			const payload = changes.current.map(obj => ({
				key: Object.keys(obj)[0],
				value: String(Object.values(obj)[0]),
			}));
			await invoke("set_vn_configs", { changes: payload });
			await getVnConfig();
		} catch (err) {
			console.error("set_vn_configs failed:", err);
		}
	}

	async function getDaemonStatus() {
		try {
			const status = await invoke("daemon_status");
			setDaemonStatus(status);
		} catch (err) {
			console.error("daemon_status failed:", err);
		}
	}

	async function stopDaemon() {
		try {
			await invoke("daemon_stop");
			await getDaemonStatus();
		} catch (err) {
			console.error("daemon_stop failed:", err);
		}
	}

	async function startDaemon() {
		try {
			await invoke("daemon_start");
			await getDaemonStatus();
		} catch (err) {
			console.error("daemon_start failed:", err);
		}
	}

	async function restartDaemon() {
		try {
			await invoke("daemon_restart");
			await getDaemonStatus();
		} catch (err) {
			console.error("daemon_restart failed:", err);
		}
	}

	async function getVnStatInterfaces() {
		try {
			const result = await invoke("get_interfaces");
			setInterfaces(result);
		} catch (err) {
			console.error("get_interfaces failed:", err);
		}
	}

	function changeInterface(id) {
		setInterfaceID(id);
	}

	function filterTrafficDataByInterfaceID() {
		return {
			...Object.fromEntries(
				Object.keys(traffic).map(key => [
					key,
					traffic[key].filter(
						e => (e?.interface ?? e?.data?.interface) == interfaceID
					),
				])
			),
		};
	}

	function reloading() {
		getVnConfig();
		getTrafficData();
		getDaemonStatus();
		getVnStatInterfaces();
	}

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
			reloading,
			changeVnStatConfigs,
			resetVnConfigs,
			saveChanges,
			stopDaemon,
			startDaemon,
			restartDaemon,
			changeInterface,
			forceReRender,
		}),
		[traffic, configs, isConfigChanged, daemonStatus, interfaceID, reRenderState],
	);

	return (
		<vnStatContext.Provider value={value}>
			{children}
		</vnStatContext.Provider>
	);
}

export function useVnStat() {
	return useContext(vnStatContext);
}
