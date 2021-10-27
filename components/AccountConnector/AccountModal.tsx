import {
  AspectRatio,
  Button,
  Flex,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import React, { useMemo } from "react";
import { useActivateWalletConnect } from "../../hooks/web3/useActivateWalletConnect";
import { useActivateWalletLink } from "../../hooks/web3/useActivateWalletLink";
import { AddressCopyButton } from "../AddressCopyButton";
import { Card } from "../Card";
import { Identicon } from "./Identicon";

interface IAccountModalProps {
  isOpen: boolean;
  onClose: any;
}

export const AccountModal: React.FC<IAccountModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    account,
    chainId,
    connector,
    library,
    activateBrowserWallet,
    deactivate,
  } = useEthers();

  const activateWalletConnect = useActivateWalletConnect();
  const activateWalletLink = useActivateWalletLink();

  const activeProvider = useMemo(() => {
    return library?.provider;
  }, [library?.provider]);

  const handleChangeAccount = async () => {
    const provider = activeProvider;
    if (!provider) {
      return;
    }
    // re-auth the metamask flow
    if (provider.isMetaMask && provider.request) {
      const request = await provider.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
      return request;
    } else {
      if (connector && (connector as any).close) {
        (connector as any).close();
        return;
      }
      return deactivate();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent pb={4} bg="gray.50">
        <ModalHeader as={Heading} size="lg" color="black">
          Connection Manager
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Stack spacing={4}>
            {account && (
              <>
                <Stack as={Card}>
                  <Heading as="h4" size="sm" fontWeight="600">
                    Connected Wallet
                  </Heading>
                  <Flex align="center">
                    <Identicon h={8} w={8} mt={0} />
                    <Flex px={2} direction="column" align="start">
                      <AddressCopyButton variant="outline" address={account} />
                    </Flex>

                    <Button
                      onClick={handleChangeAccount}
                      variant="outline"
                      ml="auto"
                      size="sm"
                    >
                      {activeProvider?.isMetaMask ? "Switch" : "Disconnect"}
                    </Button>
                  </Flex>
                </Stack>

                <hr />
              </>
            )}
            <Stack as={Card} spacing={4}>
              <Heading as="h4" size="sm" fontWeight="600">
                Connect a{activeProvider ? " different" : ""} wallet
              </Heading>
              <Button
                size="lg"
                variant="outline"
                isFullWidth
                iconSpacing="auto"
                rightIcon={
                  <AspectRatio ratio={1} w={6}>
                    <Image src="/logos/metamask-fox.svg" />
                  </AspectRatio>
                }
                onClick={() => activateBrowserWallet()}
              >
                MetaMask
              </Button>

              <Button
                size="lg"
                variant="outline"
                isFullWidth
                iconSpacing="auto"
                rightIcon={
                  <AspectRatio ratio={1} w={6}>
                    <Image src="/logos/walletconnect-logo.svg" />
                  </AspectRatio>
                }
                onClick={() => activateWalletConnect()}
              >
                WalletConnect
              </Button>

              <Button
                size="lg"
                variant="outline"
                isFullWidth
                iconSpacing="auto"
                rightIcon={
                  <AspectRatio ratio={1} w={6}>
                    <Image src="/logos/coinbase-wallet-logo.svg" />
                  </AspectRatio>
                }
                onClick={() =>
                  activateWalletLink((err) =>
                    console.error("failed to link coinbase wallet", err)
                  )
                }
              >
                Coinbase Wallet
              </Button>
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
