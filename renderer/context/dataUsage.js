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

	useEffect(() => {
		setDataIsReady(false);
		ipcRenderer.on("sendUsage", (evt, result) => {
			setUsage(result);
			setDataIsReady(true);
		});
	}, []);

	function reloading() {
		setDataIsReady(false);
		typeof ipcRenderer !== "undefined" && ipcRenderer.send("reload-data");
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
