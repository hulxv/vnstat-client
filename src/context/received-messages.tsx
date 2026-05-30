import { createContext, useEffect, type ReactNode } from "react";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { useToast, type UseToastOptions } from "@chakra-ui/react";

const ReceivedMessagesContext = createContext<null>(null);

export default function ReceivedMessagesProvider({
	children,
}: {
	children: ReactNode;
}) {
	const toast = useToast();

	useEffect(() => {
		let unlisten: UnlistenFn | undefined;
		listen<UseToastOptions>("message", ({ payload }) => {
			toast({
				position: "top",
				isClosable: true,
				...payload,
			});
		}).then(fn => {
			unlisten = fn;
		});

		return () => {
			unlisten?.();
		};
	}, [toast]);

	return (
		<ReceivedMessagesContext.Provider value={null}>
			{children}
		</ReceivedMessagesContext.Provider>
	);
}
