export interface StepItem {
  number: string;
  title: string;
  description: string;
}

export interface ProcessStepsProps {
  eyebrow?: string;
  title?: string;
  steps?: StepItem[];
}

const DEFAULT_STEPS: StepItem[] = [
  {
    number: "01",
    title: "Tell us what you need",
    description: "Share your service enquiry or preferred vehicle.",
  },
  {
    number: "02",
    title: "Share the details",
    description:
      "For trade, include origin, destination and goods. For cars, include your preferences and budget.",
  },
  {
    number: "03",
    title: "Discuss the next step",
    description:
      "Continue on WhatsApp to discuss options and requirements directly.",
  },
];

export function ProcessSteps({
  eyebrow = "BEFORE WE TALK",
  title = "A few details go a long way.",
  steps = DEFAULT_STEPS,
}: Readonly<ProcessStepsProps>) {
  return (
    <section className="container py-16 md:py-20 border-t border-line">
      <span className="block text-[0.68rem] font-bold tracking-[0.19em] uppercase text-muted mb-2">
        {eyebrow}
      </span>
      <h2 className="text-[clamp(1.9rem,3vw,3rem)] font-medium leading-[1.15] tracking-tight text-ink mb-8">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        {steps.map((step) => (
          <div key={step.number} className="border-t border-line pt-6">
            <span className="text-sm font-bold text-[#a17b3b] block mb-3">
              {step.number}
            </span>
            <h3 className="text-lg font-medium tracking-tight text-ink mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
