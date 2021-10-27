import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/spinner";
import { NFTLabsSDK, NFTMetadata } from "@nftlabs/sdk";
import { useEthers } from "@usedapp/core";
import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import Header from "../components/layout/Header";

const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;
const NFT_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_NFT_CONTRACT_ADDRESS as string;

export default function Me() {
  const { account } = useEthers();
  const [owned, setOwned] = useState<NFTMetadata[]>();

  const sdk = useMemo(() => {
    return new NFTLabsSDK(ethers.getDefaultProvider(RPC_URL));
  }, []);

  const nftContract = useMemo(() => {
    return sdk.getNFTModule(NFT_CONTRACT_ADDRESS);
  }, [sdk]);

  useEffect(() => {
    console.log("account = ", account);
    setOwned(undefined);
  }, [account]);

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

  if (account === undefined) {
    return (
      <Flex flexDir="column" mt={6}>
        <Header />
        <Box>
          <Heading color="black" size="sm" textAlign="center" my={16}>
            Connect your wallet to verify your NFT ownership.
          </Heading>
        </Box>
      </Flex>
    );
  }

  if (account !== undefined && owned !== undefined && owned.length === 0) {
    return (
      <Flex flexDir="column" mt={6}>
        <Header />
        <Box>
          <Heading color="black" size="sm" textAlign="center" my={16}>
            You don&apos;t own a FARZA NYC NFT, are you lost?
          </Heading>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex flexDir="column" mt={6}>
      <Header />

      <Box>
        {owned !== undefined && owned.length > 0 && (
          <Heading textAlign="center" color="black">
            Your NFTs
          </Heading>
        )}

        <Flex justifyContent="center" mt={8}>
          {owned === undefined && <Spinner color="black" size="lg"></Spinner>}

          {owned &&
            owned.map((nft) => {
              let level = undefined;
              if (nft.properties !== undefined && "level" in nft.properties) {
                level = parseInt(nft.properties["level"], 10);
              }

              return (
                <Box
                  key={nft.id}
                  width="300px"
                  height="max-content"
                  borderColor="black"
                  borderWidth="1px"
                  padding={4}
                  borderRadius="10px"
                  shadow="lg"
                >
                  <Text fontWeight="bold" textAlign="center">
                    {nft.name}
                  </Text>
                  <Text textAlign="center" fontWeight="light">
                    Edition #{nft.id}
                  </Text>
                  <Image src={nft.image} borderRadius="10px"></Image>

                  {level === undefined ? null : (
                    <Text textAlign="center" fontWeight="black">
                      Level = {level}
                    </Text>
                  )}
                </Box>
              );
            })}

          {owned && owned.length === 0 && <Text>You dont own any NFTs</Text>}
        </Flex>
      </Box>
    </Flex>
  );
}
