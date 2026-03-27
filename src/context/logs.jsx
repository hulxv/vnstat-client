import {
	useContext,
	createContext,
	useEffect,
	useState,
	useCallback,
	useMemo,
} from "react";
import { invoke } from "@tauri-apps/api/core";

const LogsProvider = createContext(null);

function Logs({ children }) {
	const [logs, setLogs] = useState({ path: "", lines: [] });
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		GetLogs();
	}, []);

	const GetLogs = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await invoke("get_logs");
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
			const res = await invoke("clear_logs");
			setLogs({ path: res.path, lines: res.lines });
		} catch (err) {
			console.error("clear_logs failed:", err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const value = useMemo(
		() => ({ GetLogs, ClearLogs, reloading: GetLogs, isLoading, logs }),
		[logs, isLoading],
	);

	return (
		<LogsProvider.Provider value={value}>{children}</LogsProvider.Provider>
	);
}

export function useLogs() {
	return useContext(LogsProvider);
}

export default Logs;
