import { useRouter } from "next/dist/client/router";
import { Flex, Heading, Text } from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/layout/Header";
import { NFTLabsSDK, NFTMetadata, NotFoundError } from "@nftlabs/sdk";
import { ethers } from "ethers";
import Farza from "../../components/farza";
import { useEthers } from "@usedapp/core";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;
const NFT_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as string;

export default function MyNft() {
  const { account, chainId } = useEthers();
  const router = useRouter();
  const { id } = router.query;

  const [nft, setNft] = useState<NFTMetadata>();
  const [error, setError] = useState<string>();

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

  useEffect(() => {
    if (nft !== undefined || !id) {
      return;
    }

    (async () => {
      try {
        const newNft = await nftContract.get(id as string);
        console.log(newNft);
        setNft(newNft);
        setError(undefined);
      } catch (err: any) {
        console.error(err);
        if (err?.message === "NOT_FOUND") {
          setError("NFT not found!");
        } else {
          setError(
            "Unknown error ocurred while fetching the NFT, please try again"
          );
        }
      }
    })();
  }, [sdk, nftContract, router]);

  return (
    <Flex flexDir="column" mt={6}>
      <Header />
      {error !== undefined && (
        <Heading size="lg" textAlign="center" color="black" mt={16}>
          {error}
        </Heading>
      )}

      <Flex flexDir="column" align="center" mt={8}>
        {owned?.some((n) => n.id === id) && (
          <Heading color="black" size="sm">
            You own this NFT
          </Heading>
        )}
        {nft && <Farza nft={nft}></Farza>}
      </Flex>
    </Flex>
  );
}
