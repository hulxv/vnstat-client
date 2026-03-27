import { createContext, useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { useToast } from "@chakra-ui/react";

const ReceivedMessagesContext = createContext();

export default function ReceivedMessagesProvider({ children }) {
	const toast = useToast();

	useEffect(() => {
		let unlisten;
		listen("message", ({ payload }) => {
			toast({
				position: "top",
				isClosable: true,
				...payload,
			});
		}).then(fn => { unlisten = fn; });

		return () => { unlisten?.(); };
	}, []);

	return (
		<ReceivedMessagesContext.Provider>
			{children}
		</ReceivedMessagesContext.Provider>
	);
}
