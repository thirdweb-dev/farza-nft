import {
  Container,
  Flex,
  Heading,
  HStack,
  LinkBox,
  LinkOverlay,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { AccountConnector } from "../AccountConnector";
import { NetworkStatus } from "../NetworkStatus";

const Header: React.FC = () => {
  return (
    <Container
      flexShrink={0}
      flexGrow={0}
      maxW="1440px"
      as={Flex}
      flexDir="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <LinkBox
        as={HStack}
        py={4}
        alignSelf="center"
        justifyItems="center"
        flexDir="row"
      >
        <Text fontWeight="bold">FARZA DOT COM</Text>
        <Heading flexGrow={1} as="h1" size="sm" fontWeight={600}>
          <NextLink href="/" passHref>
            <LinkOverlay>Console</LinkOverlay>
          </NextLink>
        </Heading>
      </LinkBox>
      <HStack>
        <NetworkStatus />
        <AccountConnector />
      </HStack>
    </Container>
  );
};

export default Header;
