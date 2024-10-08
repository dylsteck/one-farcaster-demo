import neynarClient from "~/code/services/neynar";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const parentUrls = searchParams.get("parent_urls") ? searchParams.get("parent_urls")!.split(",") : undefined;
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit") as string) : 25;
  const cursor = searchParams.get("cursor") ?? undefined;
  const viewerFid = searchParams.get("viewer_fid") ? parseInt(searchParams.get("viewer_fid") as string) : undefined;
  const withRecasts = searchParams.get("with_recasts") ? searchParams.get("with_recasts") === "true" : true;
  const withReplies = searchParams.get("with_replies") ? searchParams.get("with_replies") === "true" : false;

  if (!parentUrls || parentUrls.length === 0) {
    return new Response(JSON.stringify({ message: "parent_urls are required" }), {
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
    };

    const res = await neynarClient.fetchFeedByParentUrls(parentUrls, feedOptions);

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