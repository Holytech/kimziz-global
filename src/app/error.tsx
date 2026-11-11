"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="container max-w-[600px] my-20 flex flex-col items-center text-center p-12 bg-soft border border-line rounded-[10px]">
      <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink mb-3">
        We couldn’t load this page.
      </h1>
      <p className="text-sm text-muted mb-6">Please try again in a moment.</p>
      <button
        className="inline-flex items-center justify-center gap-4 min-h-[50px] px-6 py-3 bg-gold text-navy border border-gold rounded-[3px] text-sm font-semibold hover:bg-gold-hover hover:border-gold-hover transition-colors cursor-pointer"
        onClick={reset}
      >
        Try again
      </button>
    </main>
  );
}
