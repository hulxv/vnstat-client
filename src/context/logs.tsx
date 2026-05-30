import {
	useContext,
	createContext,
	useEffect,
	useState,
	useCallback,
	useMemo,
	type ReactNode,
} from "react";
import { invoke } from "@tauri-apps/api/core";
import type { LogsContextValue, LogsResult } from "@Types";

const LogsProvider = createContext<LogsContextValue | null>(null);

function Logs({ children }: { children: ReactNode }) {
	const [logs, setLogs] = useState<LogsResult>({ path: "", lines: [] });
	const [isLoading, setIsLoading] = useState(false);

	const GetLogs = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await invoke<LogsResult>("get_logs");
			setLogs({ path: res.path, lines: res.lines });
		} catch (err) {
			console.error("get_logs failed:", err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const ClearLogs = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await invoke<LogsResult>("clear_logs");
			setLogs({ path: res.path, lines: res.lines });
		} catch (err) {
			console.error("clear_logs failed:", err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		GetLogs();
	}, [GetLogs]);

	const value = useMemo<LogsContextValue>(
		() => ({ GetLogs, ClearLogs, reloading: GetLogs, isLoading, logs }),
		[logs, isLoading, GetLogs, ClearLogs],
	);

	return (
		<LogsProvider.Provider value={value}>{children}</LogsProvider.Provider>
	);
}

export function useLogs() {
	return useContext(LogsProvider) as LogsContextValue;
}

export default Logs;
