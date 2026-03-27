import { useEffect, useState, useContext, createContext, useMemo } from "react";
import { invoke } from "@tauri-apps/api/core";

const ConfigProvider = createContext({});

function Configuration({ children }) {
	const [config, setConfig] = useState({});

	async function GettingAppConfig() {
		try {
			const res = await invoke("get_app_config");
			setConfig({ ...res });
		} catch (err) {
			console.error("get_app_config failed:", err);
		}
	}

	useEffect(() => {
		GettingAppConfig();
	}, []);

	async function reloading() {
		await GettingAppConfig();
	}

	async function EditConfig(key, value) {
		try {
			const updated = await invoke("set_app_config", { key, value });
			setConfig({ ...updated });
		} catch (err) {
			console.error("set_app_config failed:", err);
		}
	}

	const value = useMemo(
		() => ({ config, reloading, EditConfig }),
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
