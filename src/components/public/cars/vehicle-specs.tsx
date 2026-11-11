import { Listing } from "@/lib/model";

export interface VehicleSpecsProps {
  vehicle: Listing;
}

export function VehicleSpecs({ vehicle: v }: Readonly<VehicleSpecsProps>) {
  const specs = [
    ["Brand", v.make],
    ["Year", v.year],
    ["Condition", v.condition],
    ["Transmission", v.transmission],
    [
      "Mileage",
      v.mileage === null ? "On request" : `${v.mileage} ${v.mileageUnit}`,
    ],
    ["Fuel", v.fuel],
    ["Colour", v.colour],
    ["Location", v.location],
  ].filter(([, value]) => value !== "");

  return (
    <dl className="border-b border-line mb-6">
      {specs.map(([key, value]) => (
        <div
          key={key}
          className="flex justify-between py-3 border-t border-line text-sm"
        >
          <dt className="text-muted">{key}</dt>
          <dd className="font-medium text-ink m-0">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
