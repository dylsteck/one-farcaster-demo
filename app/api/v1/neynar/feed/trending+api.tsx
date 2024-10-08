import neynarClient from "~/code/services/neynar";
import { TrendingFeedTimeWindow } from "@neynar/nodejs-sdk/build/neynar-api/common/constants";

type FeedTrendingProvider = "neynar" | "mbd";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit") as string) : 10;
  const cursor = searchParams.get("cursor") ?? undefined;
  const viewerFid = searchParams.get("viewer_fid") ? parseInt(searchParams.get("viewer_fid") as string) : undefined;

  const timeWindowParam = searchParams.get("time_window") as TrendingFeedTimeWindow | null;
  const timeWindow: TrendingFeedTimeWindow | undefined = 
    timeWindowParam && ["24h", "7d", "30d"].includes(timeWindowParam) 
      ? timeWindowParam 
      : undefined;

  const channelId = searchParams.get("channel_id") ?? "";
  const provider = (searchParams.get("provider") ?? "neynar") as FeedTrendingProvider;
  const providerMetadata = searchParams.get("provider_metadata") ?? undefined;

  try {
    const trendingFeedOptions = {
      limit,
      cursor,
      viewerFid,
      timeWindow,
      channelId,
      provider,
      providerMetadata,
    };

    const res = await neynarClient.fetchTrendingFeed(trendingFeedOptions);

    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}