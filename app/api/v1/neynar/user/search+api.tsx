import neynarClient from "~/code/services/neynar";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const query = searchParams.get("q") ?? undefined;
  const viewerFid = searchParams.get("viewer_fid") ? parseInt(searchParams.get("viewer_fid") as string) : undefined;
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit") as string) : 5;
  const cursor = searchParams.get("cursor") ?? undefined;

  if (!query) {
    return new Response(JSON.stringify({ message: "Query 'q' is required" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const searchOptions = {
      limit,
      cursor,
    };

    const res = await neynarClient.searchUser(query, viewerFid, searchOptions);

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