import React from "react";
import Head from "next/head";

import { ChakraProvider } from "@chakra-ui/react";
import PageLayout from "../layout/PageLayout";
export default function (props) {
	const { Component, pageProps } = props;

	return (
		<React.Fragment>
			<Head>
				<meta
					name='viewport'
					content='minimum-scale=1, initial-scale=1, width=device-width'
				/>
			</Head>
			<ChakraProvider>
				<PageLayout>
					<Component {...pageProps} />
				</PageLayout>
			</ChakraProvider>
		</React.Fragment>
	);
}
