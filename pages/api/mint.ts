import {NextApiRequest, NextApiResponse} from "next";
import {NFTLabsSDK} from "@nftlabs/sdk";
import {ethers} from "ethers";
import rateLimit from "express-rate-limit";
import runMiddleware from "../../lib/runMiddleware";
import cryptoRandomString from 'crypto-random-string';

const RPC_URL = process.env.RPC_URL as string;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS as string;

const sdk = new NFTLabsSDK(
    new ethers.Wallet(
        process.env.PRIVATE_KEY as string,
        ethers.getDefaultProvider(RPC_URL)
    )
)

const nftModule = sdk.getNFTModule(NFT_CONTRACT_ADDRESS);

// can only call once per second
const limiter = rateLimit({
    windowMs: 1000,
    max: 1,
});


export default async function mint(req: NextApiRequest, res: NextApiResponse) {
    const endDate = new Date(1635301825);
    const now = new Date();
    if (endDate.getTime() - (now.getTime() / 1000) <= 0) {
        return res.status(400).json({
            message: "Sorry you're too late! This drop has ended."
        });
    }

    try {
        await runMiddleware(req, res, limiter);
    } catch (err) {
        console.error("Failed to check rate limiting, moving on", err)
    }

    let body: any

    try {
        body = JSON.parse(req.body);
    } catch (err) {
        return res.status(400).send("Invaid JSON body")
    }

    console.log("BODY = ", body);

    if (!('address' in body)) {
        return res.status(400).send("Missing address");
    }

    const address = body['address'];
    const balance = await nftModule.balanceOf(address)
    console.log("Balance =", balance);

    if (balance.gt(0)) {
        return res.status(400).json({
            message: "You already minted your limited edition Farza NFT!"
        });
    }

    const level = cryptoRandomString({
        length: Math.ceil(Math.random() * 2), type: "numeric"
    });
    const result = await nftModule.mintTo(address, {
        image: "https://nftlabs.mypinata.cloud/ipfs/bafkreigujah2nr7hckyqxvlnllfoxvhopmkawyemb3c2hjg7v2luysh67m",
        name: "LIMITED EDITION FARZA",
        properties: {
            level
        }
    });

    console.log(result.id);

    let openseaPrefix: string = "https://opensea.io/assets/matic/";
    if (RPC_URL.toLocaleLowerCase().includes("rpc-mumbai.maticvigil.com")) {
        openseaPrefix = "https://testnets.opensea.io/assets/mumbai/"
    }

    const openseaUrl = `${openseaPrefix}${NFT_CONTRACT_ADDRESS}/${result.id.toString()}`;
    console.log(openseaUrl);
    return res.status(200).json({
        message: "Your NFT was successfully minted!!",
        openseaUrl
    })
}
