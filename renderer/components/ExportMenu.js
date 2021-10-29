import { BiExport } from "react-icons/bi";
import {
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuItemOption,
	MenuGroup,
	MenuOptionGroup,
	MenuIcon,
	MenuCommand,
	MenuDivider,
	Button,
	IconButton,
	Tooltip,
	Input,
} from "@chakra-ui/react";
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
				<div className='ii'></div>
				<MenuList>
					<MenuItem onClick={() => {}}>JSON</MenuItem>
					<MenuItem>XML</MenuItem>
				</MenuList>
			</Menu>
		</div>
	);
};

export default ExportAs;
