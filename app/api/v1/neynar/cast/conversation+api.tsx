import neynarClient from "~/code/services/neynar";
import { CastConversationSortType as SDKCastConversationSortType } from "@neynar/nodejs-sdk/build/neynar-api/v2/openapi-farcaster/models/cast-conversation-sort-type";

type CastParamType = "url" | "hash";
type CastConversationSortType = SDKCastConversationSortType;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const castIdentifier = searchParams.get("identifier") ?? undefined;
  const type = searchParams.get("type") as CastParamType | undefined;
  const replyDepth = searchParams.get("reply_depth") ? parseInt(searchParams.get("reply_depth") as string) : 2;
  const includeChronologicalParentCasts = searchParams.get("include_chronological_parent_casts") === "true" ?? false;
  const viewerFid = searchParams.get("viewer_fid") ? parseInt(searchParams.get("viewer_fid") as string) : undefined;
  const sortType = searchParams.get("sort_type") as CastConversationSortType | undefined;
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit") as string) : 20;
  const cursor = searchParams.get("cursor") ?? undefined;

  if (!castIdentifier || !type) {
    return new Response(JSON.stringify({ message: "identifier and type are required" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const conversationOptions = {
      replyDepth,
      includeChronologicalParentCasts,
      viewerFid,
      sortType,
      limit,
      cursor,
    };

    const res = await neynarClient.lookupCastConversation(castIdentifier, type, conversationOptions);

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