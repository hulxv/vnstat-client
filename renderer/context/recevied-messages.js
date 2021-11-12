import { createContext, useEffect } from "react";
import { ipcRenderer } from "electron";
import { useToast } from "@chakra-ui/react";
const ReceviedMessagesContext = createContext();

export default function ReceviedMessagesProvider({ children }) {
	const toast = useToast();
	useEffect(() => {
		ipcRenderer.on("message", (e, args) => {
			const { status = "info", msg = "" } = args;
			toast.closeAll();

			toast({
				status: status,
				description: msg,
				position: "top",
				isClosable: true,
			});
		});
	});
	return (
		<ReceviedMessagesContext.Provider>
			{children}
		</ReceviedMessagesContext.Provider>
	);
}
