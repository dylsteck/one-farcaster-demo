import neynarClient from "~/code/services/neynar";
import { TimeWindow as NeynarTimeWindow } from "@neynar/nodejs-sdk/build/neynar-api/common/constants";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const timeWindowParam = searchParams.get("time_window");
  let timeWindow: NeynarTimeWindow | undefined;

  if (timeWindowParam === "1d" || timeWindowParam === "7d" || timeWindowParam === "30d") {
    timeWindow = timeWindowParam as NeynarTimeWindow;
  } else {
    timeWindow = undefined;
  }

  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit") as string) : 10;
  const cursor = searchParams.get("cursor") ?? undefined;

  try {
    const options = {
      limit,
      cursor,
    };

    const res = await neynarClient.fetchTrendingChannels(timeWindow, options);

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