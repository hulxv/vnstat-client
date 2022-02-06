import {
	useEffect,
	useState,
	useContext,
	createContext,
	useMemo,
	useRef,
} from "react";
import { ipcRenderer } from "electron";
import { format } from "date-fns";

const NetworkStatsContext = createContext(null);

export default function NetworkStatsProvider({ children }) {
	const [isRecording, setIsRecordeing] = useState(true);
	const [networkStats, setNetworkStats] = useState(null);

	const recordedNetworkSpeed = useRef(Array(60).fill({ rx: 0, tx: 0 }));
	const recordedNetworkStats = useRef([]);
	const seconds = useRef(0);

	useEffect(() => {
		ipcRenderer.on("send-network-stats", (e, result) => {
			setNetworkStats(result);
			const { speed } = Object.values(result).at(0);
			if (isRecording) {
				recordedNetworkSpeed.current = [
					...Array(60).fill({ rx: 0, tx: 0 }),
					...recordedNetworkSpeed.current,
					speed,
				].splice(-60);
				recordedNetworkStats.current.push({
					stats: result,
					time: format(new Date(), "MMM d Y, hh:mm:ss aa"),
				});
				seconds.current += 1;
			}
		});
		return () => ipcRenderer.removeAllListeners("send-network-stats");
	}, [isRecording]);

	function reset() {
		recordedNetworkStats.current = [];
		recordedNetworkSpeed.current = [];
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
			recordedNetworkSpeed: recordedNetworkSpeed.current,
			isRecording,
			seconds: seconds.current,
			reset,
			startRecording,
			stopRecording,
		}),
		[networkStats, isRecording],
	);
	return (
		<NetworkStatsContext.Provider value={value}>
			{children}
		</NetworkStatsContext.Provider>
	);
}

export function useNetStats() {
	return useContext(NetworkStatsContext);
}
