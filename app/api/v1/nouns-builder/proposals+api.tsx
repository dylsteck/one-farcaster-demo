import { NounsBuilderService } from "~/code/services/nouns-builder";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const contractAddress = url.searchParams.get("contractAddress");
  const first = url.searchParams.get("first") ? parseInt(url.searchParams.get("first")!) : 100;
  const skip = url.searchParams.get("skip") ? parseInt(url.searchParams.get("skip")!) : 0;

  if (!contractAddress) {
    return new Response(JSON.stringify({ message: "Contract address is required" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const nounsBuilderService = new NounsBuilderService();
    const proposals = await nounsBuilderService.getProposals(contractAddress, first, skip);
    return new Response(JSON.stringify(proposals), {
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