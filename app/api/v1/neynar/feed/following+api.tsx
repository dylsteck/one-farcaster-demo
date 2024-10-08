import neynarClient from "~/code/services/neynar";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const fid = searchParams.get("fid") ? parseInt(searchParams.get("fid") as string) : undefined;
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit") as string) : 25;
  const cursor = searchParams.get("cursor") ?? undefined;
  const viewerFid = searchParams.get("viewer_fid") ? parseInt(searchParams.get("viewer_fid") as string) : undefined;
  const withRecasts = searchParams.get("with_recasts") ? searchParams.get("with_recasts") === "true" : true;

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
      withRecasts,
    };

    const res = await neynarClient.fetchUserFollowingFeed(fid, feedOptions);

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