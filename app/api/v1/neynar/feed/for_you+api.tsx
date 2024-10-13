import neynarClient from "~/code/services/neynar";
import { ForYouProvider } from "@neynar/nodejs-sdk/build/neynar-api/v2/openapi-farcaster/models/for-you-provider";
import mockForYou from "~/code/api/mock/for_you.json";
import { setupCors } from "~/code/api/cors";

export async function GET(request: Request) {
  setupCors(request);
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const fid = searchParams.get("fid") ? parseInt(searchParams.get("fid") as string) : undefined;
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit") as string) : 25;
  const cursor = searchParams.get("cursor") ?? undefined;
  const viewerFid = searchParams.get("viewer_fid") ? parseInt(searchParams.get("viewer_fid") as string) : undefined;
  const provider = searchParams.get("provider") ? (searchParams.get("provider") as ForYouProvider) : undefined;
  const providerMetadata = searchParams.get("provider_metadata") ?? undefined;

  if (!fid) {
    return new Response(JSON.stringify({ message: "fid is required" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const feedOptions = {
      limit,
      cursor,
      viewerFid,
      provider,
      providerMetadata,
    };

    // const res = await neynarClient.fetchFeedForYou(fid, feedOptions);
    const res = mockForYou;

    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}