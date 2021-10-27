import { Box, Heading } from "@chakra-ui/react";
import type { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [untilEnd, setUntilEnd] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const endDate = new Date(1635301825);
    const interval = setInterval(() => {
      const now = new Date();
      setUntilEnd(endDate.getTime() - now.getTime() / 1000);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

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
