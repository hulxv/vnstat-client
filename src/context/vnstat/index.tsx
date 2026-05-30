import {
	useContext,
	useState,
	useEffect,
	createContext,
	useMemo,
	useCallback,
	type ReactNode,
} from "react";
import { invoke } from "@tauri-apps/api/core";
import { useConfig } from "../configuration";
import type {
	Interface,
	SummaryEntry,
	TrafficData,
	TrafficEntry,
	VnStatConfig,
	VnStatConfigChange,
	VnStatContextValue,
} from "@Types";

export const vnStatContext = createContext<VnStatContextValue>(
	{} as VnStatContextValue
);

const EMPTY_TRAFFIC: TrafficData = {
	month: [],
	day: [],
	year: [],
	week: [],
	summary: [],
};

export default function vnStatProvider({ children }: { children: ReactNode }) {
	const { config: appConfig } = useConfig();

	const [traffic, setTraffic] = useState<TrafficData>(EMPTY_TRAFFIC);
	const [daemonStatus, setDaemonStatus] = useState(false);
	// `configs` is the persisted vnStat config; `visualVnConfigs` is the
	// in-progress edited copy. Both are state so edits re-render reactively
	// (no more useRef + Math.random() forceReRender hack).
	const [configs, setVnConfigs] = useState<VnStatConfig>({});
	const [isConfigsLoading, setIsConfigsLoading] = useState(true);
	const [visualVnConfigs, setVisualVnConfigs] = useState<VnStatConfig>({});
	const [interfaces, setInterfaces] = useState<Interface[]>([]);
	const [interfaceID, setInterfaceID] = useState<number>(
		appConfig?.interface ?? 1
	);

	useEffect(() => {
		getVnConfig();
		getTrafficData();
		getDaemonStatus();
		getVnStatInterfaces();
	}, []);

	useEffect(() => {
		setInterfaceID(appConfig?.interface ?? 1);
	}, [appConfig?.interface]);

	// Reset the editable copy whenever the persisted config (re)loads.
	useEffect(() => {
		setVisualVnConfigs(configs);
	}, [configs]);

	async function getTrafficData() {
		try {
			const result = await invoke<TrafficData>("get_traffic");
			setTraffic(result);
		} catch (err) {
			console.error("get_traffic failed:", err);
		}
	}

	async function getVnConfig() {
		setIsConfigsLoading(true);
		try {
			const result = await invoke<VnStatConfig>("get_vn_configs");
			setVnConfigs(result ?? {});
		} catch (err) {
			console.error("get_vn_configs failed:", err);
		} finally {
			setIsConfigsLoading(false);
		}
	}

	// Derived from state — recomputed on every persisted/edited change, so it
	// can never go stale the way a useRef read inside useMemo did.
	const changes = useMemo<VnStatConfigChange[]>(() => {
		const changed = Object.keys(configs)
			.filter(key => configs[key] != visualVnConfigs[key])
			.map(key => ({ [key]: visualVnConfigs[key] }));
		const added = Object.keys(visualVnConfigs)
			.filter(key => !Object.keys(configs).includes(key))
			.map(key => ({ [key]: visualVnConfigs[key] }));
		return changed.concat(added);
	}, [configs, visualVnConfigs]);

	const isConfigChanged = changes.length > 0;

	const changeVnStatConfigs = useCallback((key: string, value: string) => {
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
			const status = await invoke<boolean>("daemon_status");
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
			const result = await invoke<Interface[]>("get_interfaces");
			setInterfaces(result);
		} catch (err) {
			console.error("get_interfaces failed:", err);
		}
	}

	function changeInterface(id: number) {
		setInterfaceID(id);
	}

	function filterTrafficDataByInterfaceID(): TrafficData {
		const result = {} as Record<keyof TrafficData, unknown[]>;
		(Object.keys(traffic) as (keyof TrafficData)[]).forEach(key => {
			result[key] = (
				traffic[key] as Array<TrafficEntry | SummaryEntry>
			).filter(e => {
				const entry = e as TrafficEntry & {
					data?: { interface?: number };
				};
				return (
					(entry.interface ?? entry.data?.interface) == interfaceID
				);
			});
		});
		return result as unknown as TrafficData;
	}

	function reloading() {
		getVnConfig();
		getTrafficData();
		getDaemonStatus();
		getVnStatInterfaces();
	}

	const value = useMemo<VnStatContextValue>(
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
		]
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
