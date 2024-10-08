import neynarClient from "~/code/services/neynar";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const fid = searchParams.get("fid") ? parseInt(searchParams.get("fid") as string) : undefined;
  const parentUrls = searchParams.get("parent_urls") ? searchParams.get("parent_urls")!.split(",") : undefined;
  const cursor = searchParams.get("cursor") ?? undefined;
  const priorityMode = searchParams.get("priority_mode") === "true" ?? false;

  if (!fid || !parentUrls) {
    return new Response(JSON.stringify({ message: "fid and parent_urls are required" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const notificationOptions = {
      cursor,
      priorityMode,
    };

    const res = await neynarClient.fetchNotificationsByParentUrlForUser(fid, parentUrls, notificationOptions);

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