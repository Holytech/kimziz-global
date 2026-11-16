import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container max-w-[600px] my-20 flex flex-col items-center text-center p-12 bg-soft border border-line rounded-[10px]">
      <span className="block text-[0.68rem] font-bold tracking-[0.19em] uppercase text-muted mb-3">
        404
      </span>
      <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-ink mb-3">
        This page has moved off the map.
      </h1>
      <p className="text-sm text-muted mb-6 max-w-[440px]">
        Explore our services or return home to find your way.
      </p>
      <Link
        className="inline-flex items-center justify-center gap-4 min-h-[50px] px-6 py-3 bg-gold text-navy border border-gold rounded-[3px] text-sm font-semibold hover:bg-gold-hover hover:border-gold-hover transition-colors cursor-pointer"
        href="/"
      >
        Back to home
      </Link>
    </main>
  );
}
