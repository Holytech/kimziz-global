export interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  className = "",
}: Readonly<SectionTitleProps>) {
  return (
    <div className={`max-w-[830px] ${className}`.trim()}>
      <span className="block text-[0.68rem] font-bold tracking-[0.19em] uppercase text-muted mb-3">
        {eyebrow}
      </span>
      <h1 className="text-[clamp(2.4rem,4.5vw,4.2rem)] font-medium leading-[1.13] tracking-[-0.04em] text-ink mb-5 whitespace-pre-line">
        {title}
      </h1>
      {description && (
        <p className="text-base md:text-lg text-muted max-w-[660px] leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
