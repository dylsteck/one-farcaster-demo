import neynarClient from "~/code/services/neynar";

type NotificationType = "follows" | "recasts" | "likes" | "mentions" | "replies";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const fid = searchParams.get("fid") ? parseInt(searchParams.get("fid") as string) : undefined;
  const cursor = searchParams.get("cursor") ?? undefined;
  const type = searchParams.get("type") as NotificationType | undefined;
  const priorityMode = searchParams.get("priority_mode") === "true" ?? false;

  if (!fid) {
    return new Response(JSON.stringify({ message: "fid is required" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const notificationOptions = {
      cursor,
      type,
      priorityMode,
    };

    const res = await neynarClient.fetchAllNotifications(fid, notificationOptions);

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