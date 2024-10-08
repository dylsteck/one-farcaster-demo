import neynarClient from "~/code/services/neynar";

type CastParamType = "url" | "hash";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
 
  const castIdentifier = searchParams.get("identifier") ?? undefined;
  const type = searchParams.get("type") as CastParamType | undefined;
  const viewerFid = searchParams.get("viewer_fid") ? parseInt(searchParams.get("viewer_fid") as string) : undefined;

  if (!castIdentifier || !type) {
    return new Response(JSON.stringify({ message: "identifier and type are required" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const castOptions = {
      viewerFid,
    };

    const res = await neynarClient.lookUpCastByHashOrWarpcastUrl(castIdentifier, type, castOptions);

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

export async function POST(request: Request) {
  const { signer_uuid, text, embeds, parent, channel_id, idem, parent_author_fid } = await request.json();

  if (!signer_uuid || !text) {
    return new Response(JSON.stringify({ message: "signer_uuid and text are required" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const castOptions = {
      embeds,
      replyTo: parent,
      channelId: channel_id,
      idem,
      parent_author_fid,
    };

    const res = await neynarClient.publishCast(signer_uuid, text, castOptions);

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
  const { signer_uuid, target_hash } = await request.json();

  if (!signer_uuid || !target_hash) {
    return new Response(JSON.stringify({ message: "signer_uuid and target_hash are required" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const res = await neynarClient.deleteCast(signer_uuid, target_hash);

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