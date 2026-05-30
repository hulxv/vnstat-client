import {
	useEffect,
	useState,
	useContext,
	createContext,
	useMemo,
	useRef,
	type ReactNode,
} from "react";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { format } from "date-fns";
import type {
	NetStatsContextValue,
	NetworkSpeed,
	NetworkStatsPayload,
	RecordedNetworkStat,
} from "@Types";

const NetworkStatsContext = createContext<NetStatsContextValue | null>(null);

export default function NetworkStatsProvider({
	children,
}: {
	children: ReactNode;
}) {
	const [isRecording, setIsRecording] = useState(true);
	const [networkStats, setNetworkStats] =
		useState<NetworkStatsPayload | null>(null);

	const recordedNetworkSpeed = useRef<NetworkSpeed[]>(
		Array(60).fill({ rx: 0, tx: 0 })
	);
	const recordedNetworkStats = useRef<RecordedNetworkStat[]>([]);

	useEffect(() => {
		let unlisten: UnlistenFn | undefined;
		listen<NetworkStatsPayload>(
			"send-network-stats",
			({ payload: result }) => {
				setNetworkStats(result);
				const speed = Object.values(result).at(0)?.speed;
				if (isRecording && speed) {
					recordedNetworkSpeed.current = [
						...Array<NetworkSpeed>(60).fill({ rx: 0, tx: 0 }),
						...recordedNetworkSpeed.current,
						speed,
					].splice(-60);
					recordedNetworkStats.current.push({
						stats: result,
						date: format(new Date(), "MMM d y, hh:mm:ss aa"),
					});
				}
			}
		).then(fn => {
			unlisten = fn;
		});

		return () => {
			unlisten?.();
		};
	}, [isRecording]);

	function reset() {
		recordedNetworkStats.current = [];
		recordedNetworkSpeed.current = [];
	}
	function startRecording() {
		setIsRecording(true);
	}
	function stopRecording() {
		setIsRecording(false);
	}

	const value = useMemo<NetStatsContextValue>(
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
		[networkStats, isRecording]
	);

	return (
		<NetworkStatsContext.Provider value={value}>
			{children}
		</NetworkStatsContext.Provider>
	);
}

export function useNetStats() {
	return useContext(NetworkStatsContext) as NetStatsContextValue;
}
