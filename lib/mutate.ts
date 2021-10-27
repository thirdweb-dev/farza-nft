import tfnode from "@tensorflow/tfjs-node";
console.log(tfnode.version);

import { getSync } from "@andreekeberg/imagedata";
import { ArbitraryStyleTransferNetwork } from "@magenta/image";
import { createCanvas, ImageData as ImageD, createImageData } from "canvas";
import fs from "fs";

const dir = "/Users/ibrahimahmed/code/nft-labs/scrape-unslash/unsplash";

const imageFilePath =
  "/Users/ibrahimahmed/code/nft-labs/fartza-nft/public/farza.jpeg";

export default async function mutate() {
  const m = new ArbitraryStyleTransferNetwork();
  await m.initialize();

  const currentDirectory = __dirname;
  console.log(currentDirectory);

  const files = await fs.readdirSync(dir);
  console.log("Number of files: ", files.length);

  const styleFilePath = files[0];

  const imageFile = await getSync(imageFilePath);
  const imageD = await createImageData(
    imageFile.data,
    imageFile.width,
    imageFile.height
  );
  const styleFile = await getSync(`${dir}/${styleFilePath}`);
  const styleD = await createImageData(
    styleFile.data,
    styleFile.width,
    styleFile.height
  );

  console.log("Image canvas prep...");
  const imageCanvas = createCanvas(imageFile.width, imageFile.height);
  const imageCtx = imageCanvas.getContext("2d");
  imageCtx.putImageData(imageD, 0, 0);

  console.log("Style canvas prep...");
  const styleCanvas = createCanvas(styleFile.width, styleFile.height);
  const styleCtx = styleCanvas.getContext("2d");
  styleCtx.putImageData(styleD, 0, 0);

  console.log("Styling...");
  const result = await m.stylize(
    imageCanvas as any as HTMLCanvasElement,
    styleCanvas as any as HTMLCanvasElement
  );
  console.log(result);
}
