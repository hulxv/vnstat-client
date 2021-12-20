import { useContext, useState, useEffect, createContext } from "react";
import { ipcRenderer } from "electron";
// import { format } from "date-fns";
export const UsageContext = createContext();

export default function UsageProvider({ children }) {
	const [Usage, setUsage] = useState({
		month: [],
		day: [],
		year: [],
		main: [],
	});

	const [dataIsReady, setDataIsReady] = useState(false);

	useEffect(async () => {
		setDataIsReady(false);
		ipcRenderer.on("send-usage", (evt, result) => {
			setUsage(result);
			setDataIsReady(true);
		});
		return () => ipcRenderer.removeAllListeners("send-usage");
	}, []);

	function reloading() {
		setDataIsReady(false);
		ipcRenderer.send("get-data");
		setDataIsReady(true);
	}

	const value = {
		...Usage,
		dataIsReady,
		reloading,
	};

	return (
		<UsageContext.Provider value={value}>{children}</UsageContext.Provider>
	);
}

export function useUsage() {
	return useContext(UsageContext);
}
