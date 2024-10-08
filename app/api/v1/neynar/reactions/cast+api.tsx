import neynarClient from "~/code/services/neynar";

type ReactionsType = "likes" | "recasts" | "all";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const castId = searchParams.get("cast_id") ?? undefined;
  const viewerFid = searchParams.get("viewer_fid") ? parseInt(searchParams.get("viewer_fid") as string) : undefined;
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit") as string) : 25;
  const cursor = searchParams.get("cursor") ?? undefined;
  const types = (searchParams.get("types") as ReactionsType) ?? "all";

  if (!castId || !types) {
    return new Response(JSON.stringify({ message: "cast_id and types are required" }), {
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

    const res = await neynarClient.fetchReactionsForCast(castId, types, reactionOptions);

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