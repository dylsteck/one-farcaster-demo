import neynarClient from "~/code/services/neynar";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const channelId = searchParams.get("channel_id") ?? undefined;
  const fid = searchParams.get("fid") ? parseInt(searchParams.get("fid") as string) : undefined;
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit") as string) : 20;
  const cursor = searchParams.get("cursor") ?? undefined;

  if (!channelId) {
    return new Response(JSON.stringify({ message: "Channel ID 'channel_id' is required" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const options = {
      fid,
      limit,
      cursor,
    };

    const res = await neynarClient.fetchChannelMembers(channelId, options);

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