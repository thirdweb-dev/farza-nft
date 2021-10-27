import { Button } from "@chakra-ui/button";
import { Flex, Text, VStack } from "@chakra-ui/layout";
import { ArbitraryStyleTransferNetwork } from "@magenta/image";
import { useRouter } from "next/dist/client/router";
import React, { useCallback, useEffect, useRef } from "react";

export default function Breed() {
  const model = useRef<ArbitraryStyleTransferNetwork>();

  const imageRef = useRef<HTMLImageElement>();
  const styleRef = useRef<HTMLImageElement>();

  const outputImageRef = useRef<CanvasRenderingContext2D>();

  const router = useRouter();

  useEffect(() => {
    if (model.current !== undefined) {
      return;
    }

    const m = new ArbitraryStyleTransferNetwork();
    m.initialize().then(() => {
      model.current = m;
    });
  }, [model]);

  const stylize = useCallback(async () => {
    if (
      model.current === undefined ||
      imageRef.current === undefined ||
      styleRef.current === undefined
    ) {
      return;
    }

    const result = await model.current.stylize(
      imageRef.current,
      styleRef.current,
      0.5
    );
    console.log("result", result, outputImageRef.current);
    outputImageRef.current?.putImageData(result, 0, 0);
  }, [model, imageRef, styleRef, outputImageRef]);

  const download = useCallback(() => {
    outputImageRef.current?.canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "output.jpg";
      a.click();
      URL.revokeObjectURL(url);
    });
  }, [outputImageRef, router]);

  return (
    <>
      <Flex flexDir="row">
        <VStack mx={2}>
          <Text>Input</Text>
          <img ref={imageRef} width="500" src="/farza.jpeg" />
        </VStack>

        <VStack>
          <Text>Style</Text>
          <img ref={styleRef} width="500" src="/styles/jLgRcD0D0pI.jpg" />
        </VStack>
      </Flex>
      <Button my={2} mx={2} colorScheme="green" onClick={stylize}>
        Transfer
      </Button>

      <canvas
        ref={(r) => {
          outputImageRef.current = r?.getContext(
            "2d"
          ) as CanvasRenderingContext2D;
        }}
        width="500"
        height="890"
      />
      <Button onClick={download}>Download Image</Button>
    </>
  );
}
