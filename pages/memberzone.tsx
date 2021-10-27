import { Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import { NFTLabsSDK, NFTMetadata } from "@nftlabs/sdk";
import { useEthers } from "@usedapp/core";
import { ethers } from "ethers";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/layout/Header";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;
const NFT_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as string;

export default function Memberzone() {
  const { account, chainId } = useEthers();

  const [owned, setOwned] = useState<NFTMetadata>();
  const [outsider, setOutsider] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const sdk = useMemo(() => {
    return new NFTLabsSDK(ethers.getDefaultProvider(RPC_URL));
  }, []);

  const nftContract = useMemo(() => {
    return sdk.getNFTModule(NFT_CONTRACT_ADDRESS);
  }, [sdk]);

  const router = useRouter();

  useEffect(() => {
    setOwned(undefined);
    setOutsider(false);
    setLoading(true);
  }, [account, chainId]);

  useEffect(() => {
    if (outsider) {
      return;
    }

    (async () => {
      const mine = await nftContract.getOwned(account as string);
      if (mine.length === 0) {
        setOutsider(true);
        setLoading(false);
        return;
      } else {
        router.push(`/farza/${mine[0].id}`);
      }
    })();
  }, [sdk, owned, nftContract, account, router, outsider]);

  if (account === undefined) {
    return (
      <Flex flexDir="column" mt={6}>
        <Header />

        <Heading size="lg" color="black" my={8} textAlign="center">
          Connect your wallet to enter the MEMBER ZONE
        </Heading>
      </Flex>
    );
  }

  return (
    <Flex flexDir="column" mt={6}>
      <Header />
      {outsider && (
        <Heading size="lg" textAlign="center" color="black" mt={8}>
          This wallet doesn&apos;t own any FARZA NYC NFTs
        </Heading>
      )}

      <Flex flexDir="column" align="center" my={8}>
        {loading && <Spinner color="black" size="lg" />}
      </Flex>
    </Flex>
  );
}
