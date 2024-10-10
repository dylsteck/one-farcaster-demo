export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
        return new Response(JSON.stringify({ message: "URL is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const res = await fetch(imageUrl);

        if (!res.ok) {
            throw new Error(`Failed to fetch image: ${res.statusText}`);
        }

        const contentType = res.headers.get("Content-Type") || "application/octet-stream";
        const data = await res.arrayBuffer();

        return new Response(data, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=31536000",
                "Access-Control-Allow-Origin": "*",
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: (error as Error).message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}