import { NextApiRequest, NextApiResponse } from "next";
import mutate from "../../lib/mutate";

export default async function hello(req: NextApiRequest, res: NextApiResponse) {
  await mutate();

  return res.status(200).json({});
}
