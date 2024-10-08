import { IcebreakerService } from "~/code/services/icebreaker";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const input = url.searchParams.get("input");
  const inputType = url.searchParams.get("inputType");

  if (!input || !inputType || (inputType !== 'fid' && inputType !== 'fname')) {
    return new Response(JSON.stringify({ message: "Input and inputType (must be 'fid' or 'fname') are required" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const icebreakerService = new IcebreakerService();
    const user = await icebreakerService.getFarcasterUser(input, inputType);
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}