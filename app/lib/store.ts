import { neon } from "@neondatabase/serverless";
import { randomUUID } from "crypto";
import type { Source, ResearchStep } from "./agent";

export type SavedReport = {
    id: string;
    topic: string;
    createdAt: string;
    report: string;
    sources: Source[];
    steps: ResearchStep[];
};

export type ReportSummary = Pick<SavedReport, "id" | "topic" | "createdAt">;

function getSql() {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is not set. Add your Neon connection string to .env");
    }
    return neon(process.env.DATABASE_URL);
}

// lazily create the table once per server process
let ready: Promise<unknown> | null = null;
function init() {
    ready ??= getSql()`
        CREATE TABLE IF NOT EXISTS reports (
            id TEXT PRIMARY KEY,
            topic TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL,
            report TEXT NOT NULL,
            sources JSONB NOT NULL,
            steps JSONB NOT NULL
        )
    `;
    return ready;
}

export async function saveReport(
    data: Omit<SavedReport, "id" | "createdAt">
): Promise<SavedReport> {
    await init();
    const saved: SavedReport = {
        id: randomUUID(),
        createdAt: new Date().toISOString(),
        ...data,
    };
    await getSql()`
        INSERT INTO reports (id, topic, created_at, report, sources, steps)
        VALUES (${saved.id}, ${saved.topic}, ${saved.createdAt},
                ${saved.report}, ${JSON.stringify(saved.sources)}::jsonb,
                ${JSON.stringify(saved.steps)}::jsonb)
    `;
    return saved;
}

export async function loadReport(id: string): Promise<SavedReport | null> {
    await init();
    const rows = await getSql()`
        SELECT id, topic, created_at, report, sources, steps
        FROM reports WHERE id = ${id}
    `;
    const row = rows[0];
    if (!row) return null;
    return {
        id: row.id,
        topic: row.topic,
        createdAt: new Date(row.created_at).toISOString(),
        report: row.report,
        sources: row.sources,
        steps: row.steps,
    };
}

export async function listReports(limit = 20): Promise<ReportSummary[]> {
    await init();
    const rows = await getSql()`
        SELECT id, topic, created_at
        FROM reports ORDER BY created_at DESC LIMIT ${limit}
    `;
    return rows.map((row) => ({
        id: row.id,
        topic: row.topic,
        createdAt: new Date(row.created_at).toISOString(),
    }));
}
