import { useState } from "react";
import Head from "next/head";

import { ChakraProvider } from "@chakra-ui/react";
import PageLayout from "../layout/PageLayout";
import Router from "next/router";

// context
import UsageProvider from "../context/dataUsage";

export default function App(props) {
	const { Component, pageProps } = props;
	const [isLoading, setIsLoading] = useState(false);

	Router.events.on("routeChangeStart", (url) => {
		setIsLoading(true);
	});
	Router.events.on("routeChangeComplete", (url) => {
		setIsLoading(false);
	});

	return (
		<>
			<Head>
				<meta
					name='viewport'
					content='minimum-scale=1, initial-scale=1, width=device-width'
				/>
			</Head>
			<ChakraProvider>
				<UsageProvider>
					<PageLayout isLoading={isLoading}>
						<Component {...pageProps} />
					</PageLayout>
				</UsageProvider>
			</ChakraProvider>
		</>
	);
}
