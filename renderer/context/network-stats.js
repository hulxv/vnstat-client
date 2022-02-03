import {
	useEffect,
	useState,
	useContext,
	createContext,
	useMemo,
	useRef,
} from "react";
import { ipcRenderer } from "electron";
const NetwrokStatsContext = createContext(null);

export default function NetworkStatsProvider({ children }) {
	const [isRecording, setIsRecordeing] = useState(true);
	const [networkStats, setNetworkStats] = useState(null);

	const recordedNetworkStats = useRef(Array(60).fill({ rx: 0, tx: 0 }));
	const seconds = useRef(0);

	useEffect(() => {
		ipcRenderer.on("send-network-stats", (e, result) => {
			setNetworkStats(result);

			if (isRecording) {
				recordedNetworkStats.current = [
					...Array(60).fill({ rx: 0, tx: 0 }),
					...recordedNetworkStats.current,
					result,
				].splice(-60);
				seconds.current += 1;
			}
		});
		return () => ipcRenderer.removeAllListeners("send-network-stats");
	}, [isRecording]);

	function reset() {
		recordedNetworkStats.current = [];
		seconds.current = 0;
	}
	function startRecording() {
		setIsRecordeing(true);
	}
	function stopRecording() {
		setIsRecordeing(false);
	}

	const value = useMemo(
		() => ({
			networkStats: Object.values(networkStats ?? {}).at(0),
			iface: Object.keys(networkStats ?? {}).at(0),
			recordedNetworkStats: recordedNetworkStats.current,
			isRecording,
			seconds: seconds.current,
			reset,
			startRecording,
			stopRecording,
		}),
		[networkStats, isRecording],
	);
	return (
		<NetwrokStatsContext.Provider value={value}>
			{children}
		</NetwrokStatsContext.Provider>
	);
}

export function useNetStats() {
	return useContext(NetwrokStatsContext);
}
