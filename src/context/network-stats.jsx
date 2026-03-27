import {
	useEffect,
	useState,
	useContext,
	createContext,
	useMemo,
	useRef,
} from "react";
import { listen } from "@tauri-apps/api/event";
import { format } from "date-fns";

const NetworkStatsContext = createContext(null);

export default function NetworkStatsProvider({ children }) {
	const [isRecording, setIsRecording] = useState(true);
	const [networkStats, setNetworkStats] = useState(null);

	const recordedNetworkSpeed = useRef(Array(60).fill({ rx: 0, tx: 0 }));
	const recordedNetworkStats = useRef([]);

	useEffect(() => {
		let unlisten;
		listen("send-network-stats", ({ payload: result }) => {
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
					date: format(new Date(), "MMM d y, hh:mm:ss aa"),
				});
			}
		}).then(fn => { unlisten = fn; });

		return () => { unlisten?.(); };
	}, [isRecording]);

	function reset() {
		recordedNetworkStats.current = [];
		recordedNetworkSpeed.current = [];
	}
	function startRecording() { setIsRecording(true); }
	function stopRecording() { setIsRecording(false); }

	const value = useMemo(
		() => ({
			networkStats: Object.values(networkStats ?? {}).at(0),
			iface: Object.keys(networkStats ?? {}).at(0),
			recordedNetworkStats: recordedNetworkStats.current,
			recordedNetworkSpeed: recordedNetworkSpeed.current,
			isRecording,
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
