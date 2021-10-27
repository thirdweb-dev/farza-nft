import { ChainId, useConfig, useEthers } from "@usedapp/core";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { useCallback, useEffect } from "react";
import { ChainIdExt } from "../../constants/networks";

type ActivateWalletLink = (
  onError?: (error: Error) => void,
  throwErrors?: boolean
) => void;

const rpcUrls: Partial<Record<number, string>> = {
  [ChainId.Mainnet]:
    "https://eth-mainnet.alchemyapi.io/v2/yKSE5Q7wga0glvg5NXxUzmfAAVUYeUPR",
  [ChainId.Polygon]:
    "https://polygon-mainnet.g.alchemy.com/v2/yKSE5Q7wga0glvg5NXxUzmfAAVUYeUPR",
  [ChainIdExt.Avalanche]: "https://api.avax.network/ext/bc/C/rpc",
  [ChainIdExt.Fantom]: "https://rpc.ftm.tools",
  [ChainId.Mumbai]:
    "https://polygon-mumbai.g.alchemy.com/v2/yKSE5Q7wga0glvg5NXxUzmfAAVUYeUPR",
  [ChainId.Rinkeby]:
    "https://eth-rinkeby.alchemyapi.io/v2/yKSE5Q7wga0glvg5NXxUzmfAAVUYeUPR",
};

export function useActivateWalletLink(): ActivateWalletLink {
  const { activate, chainId, connector } = useEthers();

  const { supportedChains } = useConfig();
  const activateWalletConnect = useCallback<ActivateWalletLink>(
    async (onError, throwErrors) => {
      const walletConnector = new WalletLinkConnector({
        supportedChainIds: supportedChains,
        appName: "ThirdWeb - Console",
        darkMode: false,
        appLogoUrl: "https://console.nftlabs.co/favicon.ico",
        url: rpcUrls[chainId || 1] || "",
      });

      if (onError instanceof Function) {
        await activate(walletConnector, onError, throwErrors);
      } else {
        await activate(walletConnector, undefined, throwErrors);
      }
    },
    [activate, chainId, supportedChains]
  );

  useEffect(() => {
    if (chainId && connector instanceof WalletLinkConnector) {
      activateWalletConnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  return activateWalletConnect;
}
