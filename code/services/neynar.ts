import { NeynarAPIClient } from "@neynar/nodejs-sdk";

const neynarApiKey = process.env.NEYNAR_API_KEY!;
const neynarClient = new NeynarAPIClient(neynarApiKey);

export default neynarClient;