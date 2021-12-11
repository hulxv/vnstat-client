import { useEffect, useState, useContext, createContext } from "react";

const ShortcutsProvider = createContext({});

function Shortcuts() {
	const [shortcuts, setShortcuts] = useState([{ key: "", function: () => {} }]);
	const value = {
		shortcuts,
	};
	return (
		<ShortcutsProvider.Provider value={value}>Enter</ShortcutsProvider.Provider>
	);
}

export default Shortcuts;
