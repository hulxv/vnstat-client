import { createContext, useEffect, useState, useContext } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

const ServerContext = createContext();

export default function ServerProvider({ children }) {
	const [isServerConnected, setIsServerConnected] = useState(false);

	useEffect(() => {
		invoke("server_is_connected")
			.then(({ is_connected }) => setIsServerConnected(is_connected))
			.catch(console.error);

		let unlistenConnected, unlistenDisconnected;
		listen("server-was-connected", () => setIsServerConnected(true))
			.then(fn => { unlistenConnected = fn; });
		listen("server-was-disconnected", () => setIsServerConnected(false))
			.then(fn => { unlistenDisconnected = fn; });

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
