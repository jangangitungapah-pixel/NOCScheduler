const baselineChecks = [
  "Next.js App Router",
  "TypeScript strict mode",
  "Tailwind CSS styling engine",
  "Zod runtime validation",
  "Vitest + Testing Library",
  "Playwright smoke testing",
] as const;

export default function Home() {
  return (
    <main className="min-h-dvh bg-[var(--surface-canvas)] px-5 py-8 text-[var(--text-primary)] sm:px-8 lg:px-12">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="border-b border-[var(--border-subtle)] pb-6">
          <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-[var(--text-secondary)] uppercase">
            WP-F00 Engineering Baseline
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">NOCScheduler</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-secondary)] sm:text-base">
            Project foundation is active. Product UI and the full design system intentionally begin in
            WP-F01.
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Engineering baseline">
          {baselineChecks.map((check) => (
            <div
              key={check}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-base)] px-4 py-3 text-sm font-medium"
            >
              {check}
            </div>
          ))}
        </div>

        <footer className="text-xs text-[var(--text-secondary)]">
          Default locale: Indonesia · Operational timezone: Asia/Jakarta
        </footer>
      </section>
    </main>
  );
}
