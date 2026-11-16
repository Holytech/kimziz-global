import { Listing } from "@/lib/model";

export interface AvailabilityBadgeProps {
  availability: Listing["availability"];
  className?: string;
}

export function AvailabilityBadge({
  availability,
  className = "",
}: Readonly<AvailabilityBadgeProps>) {
  const colorMap = {
    available: "bg-[#e4eee3] text-[#29563a]",
    reserved: "bg-[#f5e7c7] text-[#72551b]",
    sold: "bg-[#e7e7e7] text-[#444444] dark:bg-[#2b4052] dark:text-[#a9b5bf]",
  };

  return (
    <span
      className={`inline-block text-[0.65rem] tracking-[0.06em] uppercase rounded-[3px] px-2.5 py-1 font-semibold ${
        colorMap[availability] ?? "bg-soft text-ink"
      } ${className}`.trim()}
    >
      {availability}
    </span>
  );
}
