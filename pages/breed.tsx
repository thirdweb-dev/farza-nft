import { Button } from "@chakra-ui/button";
import { Flex, Text, VStack } from "@chakra-ui/layout";
import { ArbitraryStyleTransferNetwork } from "@magenta/image";
import React, { useCallback, useEffect, useRef } from "react";

export default function Breed() {
  const model = useRef<ArbitraryStyleTransferNetwork>();

  const imageRef = useRef<HTMLImageElement>();
  const styleRef = useRef<HTMLImageElement>();

  const outputImageRef = useRef<CanvasRenderingContext2D>();

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
      styleRef.current
    );
    console.log("result", result, outputImageRef.current);
    outputImageRef.current?.putImageData(result, 0, 0);
  }, [model, imageRef, styleRef, outputImageRef]);

  return (
    <>
      <Flex flexDir="row">
        <VStack mx={2}>
          <Text>Input</Text>
          <img ref={imageRef} width="200" src="/farza.jpeg" />
        </VStack>

        <VStack>
          <Text>Style</Text>
          <img ref={styleRef} width="200" src="/style-1.png" />
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
        height="500"
      />
    </>
  );
}
