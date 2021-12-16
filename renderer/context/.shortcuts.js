/*
	Not Working
*/

import {
	useEffect,
	useState,
	useContext,
	createContext,
	useCallback,
} from "react";

const ShortcutsProvider = createContext({});

function Shortcuts({ children }) {
	const [shortcuts, setShortcuts] = useState([]);

	useEffect(() => {
		window?.addEventListener("keydown", (e) => {
			console.log(
				shortcuts
					.filter((shortcut) => shortcut.isEnable)
					.find((shortcut) => e.key === shortcut.key),
			);
		});

		return () => window?.removeEventListener("keydown", () => {});
	});

	const addShortcut = useCallback((key, action) => {
		setShortcuts((old) => [
			...new Map(
				[...old, { key, action, isEnable: true }].map((item) => [
					item["key"],
					item,
				]),
			).values(),
		]);
	}, []);
	function disableShortcuts(key) {
		setShortcuts(
			shortcuts.map((shortcut) => ({
				...shortcut,
				isEnable: shortcut.key !== key && true,
			})),
		);
	}
	function enableShortcuts(key) {
		setShortcuts(
			shortcuts.map((shortcut) => ({
				...shortcut,
				isEnable: (shortcut.isEnable && shortcut.key) !== key && true,
			})),
		);
	}

	function resetShortcuts() {}

	const value = {
		shortcuts,
		addShortcut,
		disableShortcuts,
		enableShortcuts,
	};
	return (
		<ShortcutsProvider.Provider value={value}>
			{children}
		</ShortcutsProvider.Provider>
	);
}

export function useShortcuts() {
	return useContext(ShortcutsProvider);
}

export default Shortcuts;
