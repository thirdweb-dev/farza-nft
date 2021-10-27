import { Button, Flex, Heading, Skeleton, Spinner } from "@chakra-ui/react";
import { NFTLabsSDK, NFTMetadata } from "@nftlabs/sdk";
import { ethers } from "ethers";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useMemo, useState } from "react";
import Farza from "../../components/farza";
import Header from "../../components/layout/Header";
import useOwnedNfts from "../../hooks/useOwnedNfts";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;
const NFT_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as string;

export default function MyNft() {
  const router = useRouter();
  const { id } = router.query;

  const [nft, setNft] = useState<NFTMetadata>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);

  const { ownedNfts } = useOwnedNfts();

  const sdk = useMemo(() => {
    return new NFTLabsSDK(ethers.getDefaultProvider(RPC_URL));
  }, []);

  const nftContract = useMemo(() => {
    return sdk.getNFTModule(NFT_CONTRACT_ADDRESS);
  }, [sdk]);

  const isOwner = ownedNfts?.some((n) => n.id === id);

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
      setLoading(false);
    })();
  }, [sdk, nftContract, router]);

  return (
    <Flex flexDir="column" mt={6}>
      <Header />

      {loading && <Spinner mt={8} alignSelf="center" color="black" size="lg" />}

      {error !== undefined && (
        <Heading size="lg" textAlign="center" color="black" mt={16}>
          {error}
        </Heading>
      )}

      <Flex flexDir="column" align="center" mt={8}>
        {isOwner && (
          <Heading color="black" size="sm">
            You own this NFT
          </Heading>
        )}
        {nft && <Farza nft={nft}></Farza>}

        {nft && ownedNfts && !isOwner && (
          <Button mt={8} textTransform="capitalize" colorScheme="orange">
            Breed
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
