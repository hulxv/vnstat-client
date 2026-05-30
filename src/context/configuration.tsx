import {
	useEffect,
	useState,
	useContext,
	createContext,
	useMemo,
	type ReactNode,
} from "react";
import { invoke } from "@tauri-apps/api/core";
import type { AppConfig, ConfigContextValue } from "@Types";

const ConfigProvider = createContext<ConfigContextValue>(
	{} as ConfigContextValue
);

function Configuration({ children }: { children: ReactNode }) {
	const [config, setConfig] = useState<Partial<AppConfig>>({});

	async function GettingAppConfig() {
		try {
			const res = await invoke<AppConfig>("get_app_config");
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

	async function EditConfig(key: string, value: unknown) {
		try {
			const updated = await invoke<AppConfig>("set_app_config", {
				key,
				value,
			});
			setConfig({ ...updated });
		} catch (err) {
			console.error("set_app_config failed:", err);
		}
	}

	const value = useMemo<ConfigContextValue>(
		() => ({ config, reloading, EditConfig }),
		[config]
	);

	return (
		<ConfigProvider.Provider value={value}>
			{children}
		</ConfigProvider.Provider>
	);
}

export function useConfig() {
	return useContext(ConfigProvider);
}

export default Configuration;
