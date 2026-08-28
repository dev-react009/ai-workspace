import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { loadReport } from "../../lib/store";

export default async function ReportPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const saved = await loadReport(id);
    if (!saved) notFound();

    return (
        <div className="min-h-screen bg-[#FBF8F1] text-[#191919]">
            <header className="border-b border-[#191919]/10">
                <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
                    <Link href="/research" className="text-lg font-bold tracking-tight">
                        Ctrl<span className="text-[#7CAE93]">F</span>
                    </Link>
                    <span className="rounded-full bg-[#DCE9E0] px-3 py-1 text-xs font-medium text-[#3E6653]">
                        saved report
                    </span>
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-6 pb-24">
                <section className="pt-12 pb-8">
                    <h1 className="text-3xl font-semibold tracking-tight">{saved.topic}</h1>
                    <p className="mt-2 text-sm text-[#191919]/50">
                        Researched {new Date(saved.createdAt).toLocaleString()} · {saved.sources.length} sources
                    </p>
                </section>

                <article className="rounded-2xl border border-[#191919]/10 bg-white p-8 shadow-sm">
                    <div className="prose prose-neutral max-w-none prose-headings:tracking-tight prose-a:text-[#3E6653]">
                        <ReactMarkdown>{saved.report}</ReactMarkdown>
                    </div>
                </article>

                <section className="mt-10">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-[#3E6653]">
                        Sources
                    </h2>
                    <ol className="mt-4 space-y-2">
                        {saved.sources.map((source, index) => (
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
            </main>
        </div>
    );
}
