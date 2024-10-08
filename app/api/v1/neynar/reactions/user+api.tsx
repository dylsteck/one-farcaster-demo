import neynarClient from "~/code/services/neynar";

type ReactionsType = "likes" | "recasts" | "all";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const fid = searchParams.get("fid") ? parseInt(searchParams.get("fid") as string) : undefined;
  const viewerFid = searchParams.get("viewer_fid") ? parseInt(searchParams.get("viewer_fid") as string) : undefined;
  const type = searchParams.get("type") as ReactionsType ?? "all";
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit") as string) : 25;
  const cursor = searchParams.get("cursor") ?? undefined;

  if (!fid || !type) {
    return new Response(JSON.stringify({ message: "fid and type are required" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const reactionOptions = {
      limit,
      cursor,
      viewerFid,
    };

    const res = await neynarClient.fetchUserReactions(fid, type, reactionOptions);

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