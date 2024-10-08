import neynarClient from "~/code/services/neynar";

type ChannelType = "id" | "parent_url";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const id = searchParams.get("id") ?? undefined;
  const type = (searchParams.get("type") as ChannelType) ?? "id";
  const viewerFid = searchParams.get("viewer_fid") ? parseInt(searchParams.get("viewer_fid") as string) : undefined;

  if (!id) {
    return new Response(JSON.stringify({ message: "Channel ID 'id' is required" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const channelOptions = {
      viewerFid,
      type,
    };

    const res = await neynarClient.lookupChannel(id, channelOptions);

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