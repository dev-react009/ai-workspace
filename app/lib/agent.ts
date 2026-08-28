import groqClient from "./groq";

const PLAN_MODEL = "llama-3.1-8b-instant";
const SYNTH_MODEL = "llama-3.3-70b-versatile";

export type Source = { title: string; url: string; content: string };

export type ResearchStep =
    | { type: "plan"; subQuestions: string[] }
    | { type: "search"; query: string; found: number }
    | { type: "reflect"; gaps: string[] };

export type ResearchReport = {
    report: string;
    sources: Source[];
    steps: ResearchStep[];
};

async function askJson<T>(model: string, system: string, user: string): Promise<T> {
    const completion = await groqClient.chat.completions.create({
        model,
        messages: [
            { role: "system", content: system },
            { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
    });
    return JSON.parse(completion.choices[0].message.content ?? "{}") as T;
}

async function searchWeb(query: string): Promise<Source[]> {
    const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.TAVILY_API_KEY}`,
        },
        body: JSON.stringify({ query, max_results: 4 }),
    });

    if (!response.ok) {
        throw new Error(`Tavily search failed with status ${response.status}`);
    }

    const data = await response.json();
    return (data.results ?? []).map((result: { title?: string; url?: string; content?: string }) => ({
        title: result.title ?? "Untitled",
        url: result.url ?? "",
        // cap snippet length so the synthesis prompt stays within context limits
        content: String(result.content ?? "").slice(0, 1500),
    }));
}

function dedupeByUrl(sources: Source[]): Source[] {
    const seen = new Set<string>();
    return sources.filter((source) => {
        if (!source.url || seen.has(source.url)) return false;
        seen.add(source.url);
        return true;
    });
}

function formatSources(sources: Source[]): string {
    return sources
        .map((source, index) => `[${index + 1}] ${source.title}\nURL: ${source.url}\n${source.content}`)
        .join("\n\n");
}

export async function runResearch(
    topic: string,
    onStep?: (step: ResearchStep) => void
): Promise<ResearchReport> {
    const steps: ResearchStep[] = [];
    const addStep = (step: ResearchStep) => {
        steps.push(step);
        onStep?.(step);
    };

    // 1. Plan: break the topic into focused search queries
    const plan = await askJson<{ subQuestions?: string[] }>(
        PLAN_MODEL,
        `You break a research topic into focused web-search queries.
Reply with JSON: {"subQuestions": string[]} containing 3 to 4 short, distinct search queries.`,
        topic
    );
    const subQuestions = (plan.subQuestions ?? [topic]).slice(0, 4);
    addStep({ type: "plan", subQuestions });

    // 2. Search: run all sub-question searches in parallel
    const searchResults = await Promise.all(subQuestions.map(searchWeb));
    subQuestions.forEach((query, index) => {
        addStep({ type: "search", query, found: searchResults[index].length });
    });
    let sources = dedupeByUrl(searchResults.flat());

    // 3. Reflect: ask what's missing, do one extra search round if needed
    const reflection = await askJson<{ gaps?: string[] }>(
        PLAN_MODEL,
        `You review research coverage. Given a topic and the titles of sources found so far,
list up to 2 important missing angles as web-search queries.
Reply with JSON: {"gaps": string[]}. Return {"gaps": []} if coverage is good.`,
        `Topic: ${topic}\n\nSources found:\n${sources.map((s) => `- ${s.title}`).join("\n")}`
    );
    const gaps = (reflection.gaps ?? []).slice(0, 2);
    addStep({ type: "reflect", gaps });

    if (gaps.length > 0) {
        const gapResults = await Promise.all(gaps.map(searchWeb));
        gaps.forEach((query, index) => {
            addStep({ type: "search", query, found: gapResults[index].length });
        });
        sources = dedupeByUrl([...sources, ...gapResults.flat()]);
    }

    // 4. Synthesize: produce the final cited report
    const synthesis = await groqClient.chat.completions.create({
        model: SYNTH_MODEL,
        messages: [
            {
                role: "system",
                content: `You are a research analyst. Write a markdown report from the provided numbered sources.

Structure:
## Executive Summary
## Key Findings
## Contradictions Between Sources
## Recommended Sources
## Confidence Score (0-100, with one-line justification)

Rules:
- Cite sources inline as [n] matching the source numbers.
- Only state what the sources support; note gaps honestly.
- Be concise and factual.`,
            },
            {
                role: "user",
                content: `Topic: ${topic}\n\nSources:\n${formatSources(sources)}`,
            },
        ],
    });

    return {
        report: synthesis.choices[0].message.content ?? "",
        sources,
        steps,
    };
}
