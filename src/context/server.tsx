import {
	createContext,
	useEffect,
	useState,
	useContext,
	type ReactNode,
} from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import type { ServerConnectedResponse, ServerContextValue } from "@Types";

const ServerContext = createContext<ServerContextValue>({
	isServerConnected: false,
});

export default function ServerProvider({ children }: { children: ReactNode }) {
	const [isServerConnected, setIsServerConnected] = useState(false);

	useEffect(() => {
		invoke<ServerConnectedResponse>("server_is_connected")
			.then(({ is_connected }) => setIsServerConnected(is_connected))
			.catch(console.error);

		let unlistenConnected: UnlistenFn | undefined;
		let unlistenDisconnected: UnlistenFn | undefined;
		listen("server-was-connected", () => setIsServerConnected(true)).then(
			fn => {
				unlistenConnected = fn;
			},
		);
		listen("server-was-disconnected", () => setIsServerConnected(false)).then(
			fn => {
				unlistenDisconnected = fn;
			},
		);

		return () => {
			unlistenConnected?.();
			unlistenDisconnected?.();
		};
	}, []);

	return (
		<ServerContext.Provider value={{ isServerConnected }}>
			{children}
		</ServerContext.Provider>
	);
}

export function useServer() {
	return useContext(ServerContext);
}
