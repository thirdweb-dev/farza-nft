import { ChainId, useConfig, useEthers } from "@usedapp/core";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { useCallback } from "react";
import { ChainIdExt } from "../../constants/networks";

type ActivateWalletConnect = (
  onError?: (error: Error) => void,
  throwErrors?: boolean
) => void;

export function useActivateWalletConnect(): ActivateWalletConnect {
  const { activate } = useEthers();

  const { supportedChains } = useConfig();
  const activateWalletConnect = useCallback<ActivateWalletConnect>(
    async (onError, throwErrors) => {
      const walletConnector = new WalletConnectConnector({
        supportedChainIds: supportedChains,
        infuraId: "01d4efd68e6047a8b085f906020dbc27",
        rpc: {
          [ChainId.Polygon]: "https://polygon-rpc.com",
          [ChainIdExt.Avalanche]: "https://api.avax.network/ext/bc/C/rpc",
          [ChainIdExt.Fantom]: "https://rpc.ftm.tools",
        },
      });
      if (onError instanceof Function) {
        await activate(walletConnector, onError, throwErrors);
      } else {
        await activate(walletConnector, undefined, throwErrors);
      }
    },
    [activate, supportedChains]
  );

  return activateWalletConnect;
}
