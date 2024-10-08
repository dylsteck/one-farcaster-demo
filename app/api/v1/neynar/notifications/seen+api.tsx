import neynarClient from "~/code/services/neynar";

type NotificationType = "follows" | "recasts" | "likes" | "mentions" | "replies";

export async function POST(request: Request) {
  const body = await request.json();

  const signerUuid = body.signer_uuid;
  const type = body.type as NotificationType | undefined;

  if (!signerUuid) {
    return new Response(JSON.stringify({ message: "signer_uuid is required" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const notificationOptions = {
      type,
    };

    const res = await neynarClient.markNotificationsAsSeen(signerUuid, notificationOptions);

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