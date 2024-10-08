import neynarClient from "~/code/services/neynar";

type CastComposerType = "top" | "featured";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const list = (searchParams.get("list") as CastComposerType) ?? "top";
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit") as string) : 25;
  const cursor = searchParams.get("cursor") ?? undefined;

  try {
    const options = {
      limit,
      cursor,
    };

    const res = await neynarClient.fetchComposerActions(list, options);

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