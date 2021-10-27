import { AddressZero } from "@ethersproject/constants";
import { ChakraProvider } from "@chakra-ui/react";
import { ChainId, DAppProvider, useEthers } from "@usedapp/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import type { AppProps } from "next/app";
import React, { useEffect } from "react";
import "../styles/globals.css";
import { ChainIdExt } from "../constants/networks";

export const SUPPORTED_CHAINS = [ChainId.Polygon, ChainId.Mumbai];

function MyApp({ Component, pageProps }: AppProps) {
  const { activateBrowserWallet } = useEthers();

  useEffect(() => {
    const connectAfterTimeout = async () => {
      const injected = new InjectedConnector({});
      if (await injected.isAuthorized()) {
        activateBrowserWallet();
      }
    };
    setTimeout(connectAfterTimeout, 500);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ChakraProvider>
      <DAppProvider
        config={{
          supportedChains: SUPPORTED_CHAINS,
          multicallAddresses: {
            [ChainIdExt.Fantom]: AddressZero,
            [ChainIdExt.Avalanche]: AddressZero,
            [ChainId.Localhost]: AddressZero,
          },
        }}
      >
        <Component {...pageProps} />
      </DAppProvider>
    </ChakraProvider>
  );
}
export default MyApp;
