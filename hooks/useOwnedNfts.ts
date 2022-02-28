import { NFTLabsSDK, NFTMetadata } from "@3rdweb/sdk";
import { useEthers } from "@usedapp/core";
import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;
const NFT_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as string;

export default function useOwnedNfts() {
  const { account, chainId } = useEthers();
  const [owned, setOwned] = useState<NFTMetadata[]>();

  const sdk = useMemo(() => {
    return new NFTLabsSDK(ethers.getDefaultProvider(RPC_URL));
  }, []);

  const nftContract = useMemo(() => {
    return sdk.getNFTModule(NFT_CONTRACT_ADDRESS);
  }, [sdk]);

  useEffect(() => {
    if (owned !== undefined) {
      return;
    }

    (async () => {
      const mine = await nftContract.getOwned(account as string);
      console.log(mine);
      setOwned(mine);
    })();
  }, [sdk, owned, nftContract, account]);

  return {
    ownedNfts: owned,
  };
}
