import { Component } from "react";
import {
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Box,
	Button,
	Stack,
} from "@chakra-ui/react";

/**
 * Catches render/runtime errors in its subtree so a single broken component
 * (e.g. a chart fed malformed data) shows a local fallback instead of taking
 * down the whole app. Pass `label` to name the failing area.
 */
export default class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
		this.reset = this.reset.bind(this);
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, info) {
		console.error(`ErrorBoundary (${this.props.label ?? "unknown"}):`, error, info);
	}

	reset() {
		this.setState({ hasError: false, error: null });
	}

	render() {
		if (this.state.hasError) {
			return (
				<Box p={4} w="full">
					<Alert
						status="error"
						variant="subtle"
						flexDirection="column"
						alignItems="center"
						textAlign="center"
						borderRadius="md"
						py={6}>
						<Stack align="center" spacing={3}>
							<AlertIcon boxSize="2em" mr={0} />
							<AlertTitle>
								{this.props.label
									? `Something went wrong in ${this.props.label}`
									: "Something went wrong"}
							</AlertTitle>
							<AlertDescription maxW="sm">
								{this.state.error?.message ??
									"An unexpected error occurred while rendering this section."}
							</AlertDescription>
							<Button size="sm" onClick={this.reset}>
								Try again
							</Button>
						</Stack>
					</Alert>
				</Box>
			);
		}

		return this.props.children;
	}
}
