import neynarClient from "~/code/services/neynar";

type SubscriptionProvider = "fabric_stp";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const fid = searchParams.get("fid") ? parseInt(searchParams.get("fid") as string) : undefined;
  const viewerFid = searchParams.get("viewer_fid") ? parseInt(searchParams.get("viewer_fid") as string) : undefined;
  const subscriptionProvider = (searchParams.get("subscription_provider") as SubscriptionProvider) ?? "fabric_stp";

  if (!fid || !subscriptionProvider) {
    return new Response(JSON.stringify({ message: "fid and subscription_provider are required" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const subscriptionOptions = {
      viewerFid,
    };

    const res = await neynarClient.fetchSubscribedToForFid(fid, subscriptionProvider, subscriptionOptions);

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