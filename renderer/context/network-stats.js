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
	const duration = useRef({ start: null, end: null });

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
					date: format(new Date(), "MMM d Y, hh:mm:ss aa"),
				});
			}
		});

		return () => ipcRenderer.removeAllListeners("send-network-stats");
	}, [isRecording]);

	useEffect(() => {
		if (isRecording) {
			duration.current = {
				start:
					duration.current.start === null
						? new Date().getTime()
						: duration.current.start,
				end: new Date().getTime(),
			};
		}
	});

	function reset() {
		recordedNetworkStats.current = [];
		recordedNetworkSpeed.current = [];
		duration.current = { start: null, end: null };
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
			duration: duration.current,
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
