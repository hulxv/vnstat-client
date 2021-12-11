import { useEffect, useState, useContext, createContext } from "react";

const ShortcutsProvider = createContext({ children });

function Shortcuts() {
	const [shortcuts, setShortcuts] = useState([{ key: "", function: () => {} }]);
	const value = {
		shortcuts,
	};
	return (
		<ShortcutsProvider.Provider value={value}>
			{children}
		</ShortcutsProvider.Provider>
	);
}

export default Shortcuts;
