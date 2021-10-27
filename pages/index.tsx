import { Box, Heading } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <Head>
        <title>Farza DOT COM</title>
        <meta name="description" content="Come get this sweet sweet NFT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box
        position="absolute"
        height={"100vh"}
        width="100vw"
        zIndex={-1}
        display="block"
        backgroundImage="https://nftlabs.mypinata.cloud/ipfs/bafkreigujah2nr7hckyqxvlnllfoxvhopmkawyemb3c2hjg7v2luysh67m"
        backgroundAttachment="scroll"
        backgroundRepeat="repeat-x"
      ></Box>

      <Box className={styles.main} width={"100vw"}>
        <h1 className={styles.title}>
          Welcome to <strong>FARZA DOT COM</strong>
        </h1>

        <Heading textAlign={"center"} size="sm" my={4}>
          The drop is over! Hope you got your Farza!
        </Heading>

        <Box
          position="absolute"
          top={0}
          right={0}
          p={8}
          cursor="pointer"
          onClick={() => {
            router.push("/me");
          }}
        >
          <Heading size="sm">MEMBER ZONE</Heading>
        </Box>
      </Box>
    </div>
  );
};

export default Home;
