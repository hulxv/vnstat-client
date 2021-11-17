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

const ExportAs = () => {
	return (
		<div>
			<Menu>
				<Tooltip label='Export as'>
					<MenuButton
						as={IconButton}
						icon={<BiExport />}
						variant='ghost'
						colorScheme='whiteAlpha'
						textColor='whiteAlpha.900'
						icon={<BiExport size='1.4em' />}
					/>
				</Tooltip>
				<MenuList>
					<MenuItem>
						<JSON />
					</MenuItem>
					<MenuItem>
						<XML />
					</MenuItem>
				</MenuList>
			</Menu>
		</div>
	);
};

export default ExportAs;
