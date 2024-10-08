import neynarClient from "~/code/services/neynar";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const q = searchParams.get("q") ?? "";
  const authorFid = searchParams.get("author_fid") ? parseInt(searchParams.get("author_fid") as string) : undefined;
  const viewerFid = searchParams.get("viewer_fid") ? parseInt(searchParams.get("viewer_fid") as string) : undefined;
  const parentUrl = searchParams.get("parent_url") ?? undefined;
  const channelId = searchParams.get("channel_id") ?? undefined;
  const priorityMode = searchParams.get("priority_mode") === "true" ?? false;
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit") as string) : 25;
  const cursor = searchParams.get("cursor") ?? undefined;

  if (!q) {
    return new Response(JSON.stringify({ message: "Query string 'q' is required" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const searchOptions = {
      authorFid,
      viewerFid,
      parentUrl,
      channelId,
      priorityMode,
      limit,
      cursor,
    };

    const res = await neynarClient.searchCasts(q, searchOptions);

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