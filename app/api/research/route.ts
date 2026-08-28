import { NextResponse } from "next/server";
import { runResearch } from "../../lib/agent";
import { saveReport, listReports } from "../../lib/store";

// research runs take a while: multiple LLM + search round-trips
export const maxDuration = 120;

export async function GET() {
    return NextResponse.json({ reports: await listReports() });
}

export async function POST(request: Request) {
    const body = await request.json();
    const topic = typeof body.topic === "string" ? body.topic.trim() : "";

    if (!topic) {
        return NextResponse.json({ error: "topic is required" }, { status: 400 });
    }
    if (!process.env.TAVILY_API_KEY) {
        return NextResponse.json(
            { error: "TAVILY_API_KEY is not set. Get a free key at tavily.com and add it to .env.local" },
            { status: 500 }
        );
    }

    // stream one JSON object per line: step events as they happen, then the final result
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            const send = (event: unknown) =>
                controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
            try {
                const result = await runResearch(topic, (step) => send({ type: "step", step }));
                const saved = await saveReport({ topic, ...result });
                send({ type: "done", id: saved.id, report: result.report, sources: result.sources });
            } catch (error) {
                console.error("research failed:", error);
                send({ type: "error", error: "Research run failed. Try again." });
            } finally {
                controller.close();
            }
        },
    });

    return new Response(stream, {
        headers: { "Content-Type": "application/x-ndjson" },
    });
}
