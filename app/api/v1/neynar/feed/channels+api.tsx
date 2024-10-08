import neynarClient from "~/code/services/neynar";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const channelIds = searchParams.get("channel_ids") ? searchParams.get("channel_ids")!.split(",") : undefined;
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit") as string) : 25;
  const cursor = searchParams.get("cursor") ?? undefined;
  const viewerFid = searchParams.get("viewer_fid") ? parseInt(searchParams.get("viewer_fid") as string) : undefined;
  const withRecasts = searchParams.get("with_recasts") ? searchParams.get("with_recasts") === "true" : true;
  const withReplies = searchParams.get("with_replies") ? searchParams.get("with_replies") === "true" : false;
  const membersOnly = searchParams.get("members_only") ? searchParams.get("members_only") === "true" : true;

  if (!channelIds || channelIds.length === 0) {
    return new Response(JSON.stringify({ message: "channel_ids are required" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const feedOptions = {
      withRecasts,
      withReplies,
      limit,
      cursor,
      viewerFid,
      shouldModerate: membersOnly,
    };

    const res = await neynarClient.fetchFeedByChannelIds(channelIds, feedOptions);

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