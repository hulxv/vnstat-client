import { BiExport } from "react-icons/bi";
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	IconButton,
	Tooltip,
} from "@chakra-ui/react";

import XML from "./asXML";
import JSON from "./asJSON";
import CSV from "./asCSV";

const ExportAs = () => {
	return (
		<Menu>
			<MenuButton
				as={IconButton}
				icon={<BiExport />}
				variant='ghost'
				colorScheme='whiteAlpha'
				textColor='whiteAlpha.900'
				icon={<BiExport size='1.4em' />}
			/>

			<MenuList>
				<MenuItem>
					<JSON />
				</MenuItem>
				<MenuItem>
					<XML />
				</MenuItem>
				<MenuItem>
					<CSV />
				</MenuItem>
			</MenuList>
		</Menu>
	);
};

export default ExportAs;
