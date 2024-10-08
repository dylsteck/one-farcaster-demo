import neynarClient from "~/code/services/neynar";

export async function POST(request: Request) {
  const { signer_uuid, reaction_type, target, target_author_fid, idem } = await request.json();

  if (!signer_uuid || !reaction_type || !target) {
    return new Response(JSON.stringify({ message: "signer_uuid, reaction_type, and target are required" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const reactionOptions = {
      idem,
      target_author_fid,
    };

    const res = await neynarClient.publishReactionToCast(signer_uuid, reaction_type, target, reactionOptions);

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

export async function DELETE(request: Request) {
  const { signer_uuid, reaction_type, target } = await request.json();

  if (!signer_uuid || !reaction_type || !target) {
    return new Response(JSON.stringify({ message: "signer_uuid, reaction_type, and target are required" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const res = await neynarClient.deleteReactionFromCast(signer_uuid, reaction_type, target);

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