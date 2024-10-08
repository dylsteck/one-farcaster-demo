import neynarClient from "~/code/services/neynar";

export async function POST(request: Request) {
  const body = await request.json();

  const signerUuid = body.signerUuid ?? undefined;
  const castHash = body.castHash ?? undefined;
  const action = body.action ?? undefined;

  if (!signerUuid || !castHash || !action) {
    return new Response(JSON.stringify({ message: "signerUuid, castHash, and action are required" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const res = await neynarClient.postFrameAction(signerUuid, castHash, action);

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