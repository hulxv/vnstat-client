import {
	useContext,
	useState,
	useEffect,
	createContext,
	useMemo,
	useCallback,
} from "react";
import { invoke } from "@tauri-apps/api/core";
import { useConfig } from "../configuration";

export const vnStatContext = createContext();

export default function vnStatProvider({ children }) {
	const { config: appConfig } = useConfig();

	const [traffic, setTraffic] = useState({
		month: [], day: [], year: [], week: [], summary: [],
	});
	const [daemonStatus, setDaemonStatus] = useState(false);
	// `configs` is the persisted vnStat config; `visualVnConfigs` is the
	// in-progress edited copy. Both are state so edits re-render reactively
	// (no more useRef + Math.random() forceReRender hack).
	const [configs, setVnConfigs] = useState({});
	const [isConfigsLoading, setIsConfigsLoading] = useState(true);
	const [visualVnConfigs, setVisualVnConfigs] = useState({});
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

	// Reset the editable copy whenever the persisted config (re)loads.
	useEffect(() => {
		setVisualVnConfigs(configs);
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
		setIsConfigsLoading(true);
		try {
			const result = await invoke("get_vn_configs");
			setVnConfigs(result ?? {});
		} catch (err) {
			console.error("get_vn_configs failed:", err);
		} finally {
			setIsConfigsLoading(false);
		}
	}

	// Derived from state — recomputed on every persisted/edited change, so it
	// can never go stale the way a useRef read inside useMemo did.
	const changes = useMemo(() => {
		const changed = Object.keys(configs)
			.filter(key => configs[key] != visualVnConfigs[key])
			.map(key => ({ [key]: visualVnConfigs[key] }));
		const added = Object.keys(visualVnConfigs)
			.filter(key => !Object.keys(configs).includes(key))
			.map(key => ({ [key]: visualVnConfigs[key] }));
		return changed.concat(added);
	}, [configs, visualVnConfigs]);

	const isConfigChanged = changes.length > 0;

	const changeVnStatConfigs = useCallback((key, value) => {
		setVisualVnConfigs(prev => ({ ...prev, [key]: value }));
	}, []);

	const resetVnConfigs = useCallback(() => {
		setVisualVnConfigs(configs);
	}, [configs]);

	async function saveChanges() {
		try {
			const payload = changes.map(obj => ({
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
			isConfigsLoading,
			changes,
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
		}),
		[
			traffic,
			configs,
			isConfigsLoading,
			changes,
			visualVnConfigs,
			isConfigChanged,
			daemonStatus,
			interfaces,
			interfaceID,
		],
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
