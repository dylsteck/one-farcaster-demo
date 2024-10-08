import neynarClient from "~/code/services/neynar";
import { EmbedType as SDKEmbedType } from "@neynar/nodejs-sdk/build/neynar-api/v2/openapi-farcaster/models/embed-type";

type FeedType = "following" | "filter";
type FilterType = "fids" | "parent_url" | "channel_id" | "embed_url";
type EmbedType = SDKEmbedType;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const feedType = (searchParams.get("feed_type") as FeedType) ?? "following";
  const filterType = searchParams.get("filter_type") as FilterType | undefined;
  const fid = searchParams.get("fid") ? parseInt(searchParams.get("fid") as string) : undefined;
  const fids = searchParams.get("fids") ? searchParams.get("fids")!.split(",").map(fid => parseInt(fid)) : undefined;
  const parentUrl = searchParams.get("parent_url") ?? undefined;
  const channelId = searchParams.get("channel_id") ?? undefined;
  const embedUrl = searchParams.get("embed_url") ?? undefined;
  const embedTypes = searchParams.get("embed_types") ? searchParams.get("embed_types")!.split(",") as EmbedType[] : undefined;
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit") as string) : 25;
  const cursor = searchParams.get("cursor") ?? undefined;
  const withRecasts = searchParams.get("with_recasts") ? searchParams.get("with_recasts") === "true" : true;
  const viewerFid = searchParams.get("viewer_fid") ? parseInt(searchParams.get("viewer_fid") as string) : undefined;

  try {
    const feedOptions = {
      filterType,
      fid,
      fids,
      parentUrl,
      channelId,
      embedUrl,
      embedTypes,
      limit,
      cursor,
      withRecasts,
      viewerFid,
    };

    const res = await neynarClient.fetchFeed(feedType, feedOptions);

    return new Response(JSON.stringify(res), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    if (error.response && error.response.data) {
      return new Response(JSON.stringify(error.response.data), {
        status: error.response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
}