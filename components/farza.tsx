import { Box, Image, Text } from "@chakra-ui/react";
import React from "react";

import { NFTMetadata } from "@nftlabs/sdk";

export interface FarzaProps {
  nft: NFTMetadata;
}

export default function Farza({ nft }: FarzaProps) {
  let level = undefined;
  if (nft.properties !== undefined && "level" in nft.properties) {
    level = parseInt(nft.properties["level"] as string, 10);
  }

  return (
    <Box
      width="300px"
      height="max-content"
      borderColor="black"
      borderWidth="1px"
      borderRadius="10px"
      shadow="lg"
      sx={{
        ".nft-image": {},
      }}
    >
      <Image
        className="nft-image"
        src={nft.image}
        borderTopRadius="10px"
        alt="FARZA NYC NFT"
      ></Image>
      <Box padding={4}>
        <Text fontWeight="bold" textAlign="center">
          {nft.name}
        </Text>
        <Text textAlign="center" fontWeight="light">
          Edition #{nft.id}
        </Text>

        {level === undefined ? null : (
          <Text textAlign="center" fontWeight="black">
            Level {level}
          </Text>
        )}
      </Box>
    </Box>
  );
}
