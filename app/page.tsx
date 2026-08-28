import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Plan",
    text: "Breaks your topic into focused sub-questions before touching the web.",
  },
  {
    number: "02",
    title: "Search",
    text: "Runs parallel web searches and gathers sources for every sub-question.",
  },
  {
    number: "03",
    title: "Reflect",
    text: "Reviews its own coverage, spots missing angles, and searches again.",
  },
  {
    number: "04",
    title: "Synthesize",
    text: "Writes a structured report with inline citations and a confidence score.",
  },
];

const features = [
  {
    title: "Every claim cited",
    text: "Findings link back to numbered sources, so you can verify anything in one click.",
  },
  {
    title: "Watch it think",
    text: "Agent steps stream live — plans, searches, and reflections appear as they happen.",
  },
  {
    title: "Reports that persist",
    text: "Every run is saved with a permanent shareable link and full source list.",
  },
  {
    title: "Honest about gaps",
    text: "Contradictions between sources are called out instead of papered over.",
  },
];

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    tagline: "For the occasionally curious",
    perks: [
      "5 reports per month",
      "Standard research depth",
      "Saved report links",
      "Full source citations",
    ],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    tagline: "For people who research for a living",
    perks: [
      "100 reports per month",
      "Deep research mode",
      "Markdown & PDF export",
      "Priority processing",
    ],
    cta: "Go Pro",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "per month",
    tagline: "For teams that argue with sources",
    perks: [
      "Unlimited reports",
      "Shared team workspace",
      "API access",
      "Weekly topic watch digests",
    ],
    cta: "Start a team",
    highlighted: false,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FBF8F1] text-[#191919]">
      <header className="border-b border-[#191919]/10">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold tracking-tight">
            Ctrl<span className="text-[#7CAE93]">F</span>
          </span>
          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="hidden text-sm text-[#191919]/70 hover:text-[#191919] sm:block">
              How it works
            </a>
            <a href="#features" className="hidden text-sm text-[#191919]/70 hover:text-[#191919] sm:block">
              Features
            </a>
            <a href="#pricing" className="hidden text-sm text-[#191919]/70 hover:text-[#191919] sm:block">
              Pricing
            </a>
            <Link
              href="/research"
              className="rounded-full bg-[#191919] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#3E6653]"
            >
              Start researching
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="mx-auto max-w-5xl px-6 pt-24 pb-20 text-center">
          <span className="rounded-full bg-[#DCE9E0] px-4 py-1.5 text-xs font-medium text-[#3E6653]">
            Autonomous research agent
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-semibold leading-tight tracking-tight sm:text-6xl">
            Ctrl+F for the <span className="text-[#7CAE93]">entire internet</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-[#191919]/60">
            Give it a topic. It plans, searches the web, questions its own coverage,
            and returns a cited report — while you watch every step.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/research"
              className="rounded-full bg-[#191919] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#3E6653]"
            >
              Run your first report
            </Link>
            <a
              href="#how-it-works"
              className="rounded-full border border-[#191919]/20 px-7 py-3 text-sm font-medium transition hover:border-[#7CAE93] hover:text-[#3E6653]"
            >
              See how it works
            </a>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-center text-xs font-semibold uppercase tracking-widest text-[#3E6653]">
            How it works
          </h2>
          <p className="mt-3 text-center text-3xl font-semibold tracking-tight">
            One loop, four moves
          </p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-[#191919]/10 bg-white p-6 shadow-sm"
              >
                <span className="font-mono text-sm text-[#7CAE93]">{step.number}</span>
                <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#191919]/60">{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="border-y border-[#191919]/10 bg-white/60">
          <div className="mx-auto max-w-5xl px-6 py-20">
            <h2 className="text-center text-xs font-semibold uppercase tracking-widest text-[#3E6653]">
              Why CtrlF
            </h2>
            <p className="mt-3 text-center text-3xl font-semibold tracking-tight">
              Built for answers you can trust
            </p>
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-[#191919]/10 bg-white p-6"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-2 w-2 rounded-full bg-[#7CAE93]" />
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                  </div>
                  <p className="mt-2 pl-5 text-sm leading-relaxed text-[#191919]/60">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="text-center text-xs font-semibold uppercase tracking-widest text-[#3E6653]">
            Pricing
          </h2>
          <p className="mt-3 text-center text-3xl font-semibold tracking-tight">
            Cheaper than an intern, faster too
          </p>
          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border bg-white p-8 ${
                  plan.highlighted
                    ? "border-[#7CAE93] shadow-lg shadow-[#7CAE93]/10"
                    : "border-[#191919]/10 shadow-sm"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#7CAE93] px-3 py-1 text-xs font-medium text-white">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-[#191919]/50">{plan.tagline}</p>
                <p className="mt-6">
                  <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
                  <span className="ml-2 text-sm text-[#191919]/50">{plan.period}</span>
                </p>
                <ul className="mt-6 space-y-3">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-3 text-sm text-[#191919]/70">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#7CAE93]" />
                      {perk}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/research"
                  className={`mt-8 block rounded-full px-6 py-3 text-center text-sm font-medium transition ${
                    plan.highlighted
                      ? "bg-[#191919] text-white hover:bg-[#3E6653]"
                      : "border border-[#191919]/20 hover:border-[#7CAE93] hover:text-[#3E6653]"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-24 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            Your next 20-minute Google session,{" "}
            <span className="text-[#7CAE93]">finished in two</span>
          </h2>
          <Link
            href="/research"
            className="mt-8 inline-block rounded-full bg-[#191919] px-8 py-3.5 text-sm font-medium text-white transition hover:bg-[#3E6653]"
          >
            Start researching
          </Link>
        </section>
      </main>

      <footer className="border-t border-[#191919]/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 text-sm text-[#191919]/50">
          <span>CtrlF</span>
          <span>Powered by Groq + Tavily</span>
        </div>
      </footer>
    </div>
  );
}
