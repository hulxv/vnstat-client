import { useState, useEffect } from "react";
import Head from "next/head";

import { ChakraProvider } from "@chakra-ui/react";
import PageLayout from "../layout/PageLayout";
import router from "next/router";

// context
import UsageProvider from "../context/dataUsage";
import ReceviedMessagesProvider from "../context/recevied-messages";

// Styles
import "../styles/global.css";

export default function App(props) {
	const { Component, pageProps } = props;
	const [isLoading, setIsLoading] = useState(false);

	router.events.on("routeChangeStart", (url) => {
		setIsLoading(true);
	});
	router.events.on("routeChangeComplete", (url) => {
		setIsLoading(false);
	});

	useEffect(() => {
		router.replace("/");
	}, []);

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
					<ReceviedMessagesProvider>
						<PageLayout isLoading={isLoading}>
							<Component {...pageProps} />
						</PageLayout>
					</ReceviedMessagesProvider>
				</UsageProvider>
			</ChakraProvider>
		</>
	);
}
