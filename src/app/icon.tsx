import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";
export default async function Icon() {
  const logo = await readFile(
    join(process.cwd(), "public/brand/kimziz-logo-transparent.png"),
  );
  return new ImageResponse(
    <img
      src={`data:image/png;base64,${logo.toString("base64")}`}
      width={64}
      height={64}
      alt=""
    />,
    size,
  );
}
