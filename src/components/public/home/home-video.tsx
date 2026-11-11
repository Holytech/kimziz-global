export interface HomeVideoProps {
  src: string;
}

export function HomeVideo({ src }: Readonly<HomeVideoProps>) {
  return (
    <section className="container py-16 md:py-24">
      <h2 className="text-[clamp(1.9rem,3vw,3rem)] font-medium leading-[1.15] tracking-tight text-ink mb-6">
        A closer look
      </h2>
      <video
        controls
        preload="none"
        src={src}
        className="w-full rounded-lg border border-line bg-surface shadow-sm"
        aria-label="Kimziz introduction video"
      />
    </section>
  );
}
