import { createContext, useEffect, useState, useContext } from "react";
import { ipcRenderer } from "electron";
const ServerContext = createContext();

export default function ReceivedMessagesProvider({ children }) {
	const [isServerConnected, setIsServerConnected] = useState(false);

	useEffect(() => {
		if (ipcRenderer && window) {
			ipcRenderer
				.invoke("server-is-connected")
				.then(({ is_connected }) => setIsServerConnected(is_connected));

			ipcRenderer.on("server-was-disconnected", () => {
				setIsServerConnected(false);
			});
			ipcRenderer.on("server-was-connected", () => {
				setIsServerConnected(true);
			});
		}
	}, [typeof window, ipcRenderer]);
	return (
		<ServerContext.Provider value={{ isServerConnected }}>
			{children}
		</ServerContext.Provider>
	);
}
export function useServer() {
	return useContext(ServerContext);
}
