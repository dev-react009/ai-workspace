"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

type Source = { title: string; url: string; content: string };
type Step =
    | { type: "plan"; subQuestions: string[] }
    | { type: "search"; query: string; found: number }
    | { type: "reflect"; gaps: string[] };
type ReportSummary = { id: string; topic: string; createdAt: string };

export default function ResearchPage() {
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [report, setReport] = useState("");
    const [reportId, setReportId] = useState("");
    const [sources, setSources] = useState<Source[]>([]);
    const [steps, setSteps] = useState<Step[]>([]);
    const [history, setHistory] = useState<ReportSummary[]>([]);

    useEffect(() => {
        fetch("/api/research")
            .then((response) => response.json())
            .then((data) => setHistory(data.reports ?? []))
            .catch(() => {});
    }, [reportId]); // refetch after each completed run

    async function handleResearch() {
        if (!topic.trim() || loading) return;

        setLoading(true);
        setError("");
        setReport("");
        setReportId("");
        setSources([]);
        setSteps([]);

        try {
            const response = await fetch("/api/research", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic }),
            });

            if (!response.ok || !response.body) {
                const data = await response.json().catch(() => null);
                setError(data?.error ?? "Something went wrong.");
                return;
            }

            // read NDJSON stream: one event per line
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });

                const lines = buffer.split("\n");
                buffer = lines.pop() ?? "";

                for (const line of lines) {
                    if (!line.trim()) continue;
                    const event = JSON.parse(line);
                    if (event.type === "step") {
                        setSteps((previous) => [...previous, event.step]);
                    } else if (event.type === "done") {
                        setReport(event.report);
                        setSources(event.sources);
                        setReportId(event.id ?? "");
                    } else if (event.type === "error") {
                        setError(event.error);
                    }
                }
            }
        } catch {
            setError("Request failed. Is the dev server running?");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#FBF8F1] text-[#191919]">
            <header className="border-b border-[#191919]/10">
                <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
                    <span className="text-lg font-bold tracking-tight">
                        Ctrl<span className="text-[#7CAE93]">F</span>
                    </span>
                    <span className="rounded-full bg-[#DCE9E0] px-3 py-1 text-xs font-medium text-[#3E6653]">
                        research agent
                    </span>
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-6 pb-24">
                <section className="pt-16 pb-10 text-center">
                    <h1 className="text-5xl font-semibold tracking-tight">
                        Research <span className="text-[#7CAE93]">anything</span>
                    </h1>
                    <p className="mt-4 text-lg text-[#191919]/60">
                        An autonomous agent that plans, searches the web, and writes a cited report.
                    </p>
                </section>

                <div className="flex items-center gap-2 rounded-2xl border border-[#191919]/10 bg-white p-2 shadow-lg shadow-[#191919]/5">
                    <input
                        type="text"
                        value={topic}
                        onChange={(event) => setTopic(event.target.value)}
                        onKeyDown={(event) => event.key === "Enter" && handleResearch()}
                        placeholder="What should the agent research?"
                        className="flex-1 bg-transparent px-4 py-3 text-base outline-none placeholder:text-[#191919]/40"
                    />
                    <button
                        onClick={handleResearch}
                        disabled={loading}
                        className="rounded-xl bg-[#191919] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#3E6653] disabled:opacity-50"
                    >
                        {loading ? "Researching…" : "Research"}
                    </button>
                </div>

                {error && <p className="mt-6 text-center text-sm text-red-600">{error}</p>}

                {steps.length > 0 && (
                    <div className="mt-10 rounded-2xl border border-[#191919]/10 bg-white/70 p-6">
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#3E6653]">
                            Agent steps
                        </h2>
                        <ul className="mt-4 space-y-3">
                            {steps.map((step, index) => (
                                <li key={index} className="flex items-start gap-3 text-sm text-[#191919]/80">
                                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#7CAE93]" />
                                    <span>
                                        {step.type === "plan" && `Planned: ${step.subQuestions.join(" · ")}`}
                                        {step.type === "search" && `Searched “${step.query}” — ${step.found} results`}
                                        {step.type === "reflect" &&
                                            (step.gaps.length > 0
                                                ? `Gaps found: ${step.gaps.join(" · ")}`
                                                : "Coverage judged sufficient")}
                                    </span>
                                </li>
                            ))}
                            {loading && (
                                <li className="flex items-start gap-3 text-sm text-[#191919]/50">
                                    <span className="mt-1.5 h-2 w-2 shrink-0 animate-pulse rounded-full bg-[#7CAE93]" />
                                    <span>Working…</span>
                                </li>
                            )}
                        </ul>
                    </div>
                )}

                {loading && steps.length === 0 && (
                    <p className="mt-6 text-center text-sm text-[#191919]/50">
                        Planning, searching, and synthesizing — this takes a minute or two.
                    </p>
                )}

                {report && (
                    <article className="mt-10 rounded-2xl border border-[#191919]/10 bg-white p-8 shadow-sm">
                        {reportId && (
                            <a
                                href={`/research/${reportId}`}
                                className="mb-4 inline-block rounded-full bg-[#DCE9E0] px-3 py-1 text-xs font-medium text-[#3E6653] hover:bg-[#c9ddd1]"
                            >
                                Permanent link →
                            </a>
                        )}
                        <div className="prose prose-neutral max-w-none prose-headings:tracking-tight prose-a:text-[#3E6653]">
                            <ReactMarkdown>{report}</ReactMarkdown>
                        </div>
                    </article>
                )}

                {sources.length > 0 && (
                    <section className="mt-10">
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#3E6653]">
                            Sources
                        </h2>
                        <ol className="mt-4 space-y-2">
                            {sources.map((source, index) => (
                                <li key={index}>
                                    <a
                                        href={source.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-baseline gap-3 rounded-xl border border-[#191919]/10 bg-white px-4 py-3 text-sm transition hover:border-[#7CAE93]"
                                    >
                                        <span className="font-mono text-xs text-[#7CAE93]">[{index + 1}]</span>
                                        <span className="truncate">{source.title}</span>
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </section>
                )}

                {history.length > 0 && (
                    <section className="mt-14">
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#3E6653]">
                            Recent reports
                        </h2>
                        <ul className="mt-4 space-y-2">
                            {history.map((item) => (
                                <li key={item.id}>
                                    <a
                                        href={`/research/${item.id}`}
                                        className="flex items-baseline justify-between gap-3 rounded-xl border border-[#191919]/10 bg-white px-4 py-3 text-sm transition hover:border-[#7CAE93]"
                                    >
                                        <span className="truncate">{item.topic}</span>
                                        <span className="shrink-0 text-xs text-[#191919]/40">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </main>
        </div>
    );
}
