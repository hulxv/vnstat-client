import { createContext, useEffect } from "react";
import { ipcRenderer } from "electron";
import { useToast } from "@chakra-ui/react";
const ReceviedMessagesContext = createContext();

export default function ReceviedMessagesProvider({ children }) {
	const toast = useToast();
	useEffect(() => {
		ipcRenderer.on("message", (e, args) => {
			toast({
				position: "top",
				isClosable: true,
				...args,
			});
		});

		return () => ipcRenderer.removeAllListeners("message");
	}, []);
	return (
		<ReceviedMessagesContext.Provider>
			{children}
		</ReceviedMessagesContext.Provider>
	);
}
