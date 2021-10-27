import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

const DEEP_AI_API_KEY = process.env.DEEP_AI_API_KEY as string;

const deepai = require("deepai");
deepai.setApiKey(DEEP_AI_API_KEY);

export default async function hello(req: NextApiRequest, res: NextApiResponse) {
  console.log(deepai);

  const availableStyles = fs.readdirSync(path.resolve(".", "public/styles"));
  const selectedStyle =
    availableStyles[Math.floor(Math.random() * availableStyles.length)];
  console.log("Selected style = ", selectedStyle);

  var resp = await deepai.callStandardApi("fast-style-transfer", {
    content: fs.createReadStream(path.resolve(".", "public/farza.jpeg")),
    style: fs.createReadStream(
      path.resolve(".", `public/styles/${selectedStyle}`)
    ),
  });
  console.log(resp);

  return res.status(200).json({
    output_url: resp.output_url,
  });
}
