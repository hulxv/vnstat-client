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

	const recordedSpeedStats = useRef(Array(60).fill({ rx: 0, tx: 0 }));
	const seconds = useRef(0);

	useEffect(() => {
		ipcRenderer.on("send-network-stats", (e, result) => {
			setNetworkStats(result);

			if (isRecording) {
				recordedSpeedStats.current = [
					...Array(60).fill({ rx: 0, tx: 0 }),
					...recordedSpeedStats.current,
					{
						rx: Object.values(result)[0]?.speed?.rx / 1024,
						tx: Object.values(result)[0]?.speed?.tx / 1024,
					},
				].splice(-60);
				seconds.current += 1;
			}
		});
		return () => ipcRenderer.removeAllListeners("send-network-stats");
	}, [isRecording]);

	function reset() {
		recordedSpeedStats.current = [];
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
			networkStats: Object.values(networkStats ?? {})[0],
			recordedSpeedStats: recordedSpeedStats.current,
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
