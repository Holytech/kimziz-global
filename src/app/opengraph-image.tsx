import { ImageResponse } from "next/og";
export const alt = "Kimziz Global Links — Importation, Exportation & Cars";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        background: "#0c2035",
        color: "#f7f5ef",
        padding: "70px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 25,
          letterSpacing: 6,
          color: "#dfb566",
        }}
      >
        KIMZIZ GLOBAL LINKS LTD.
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 78,
          lineHeight: 1.1,
          maxWidth: 950,
        }}
      >
        Your ambition. A world of possibilities.
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 22,
          color: "#dfb566",
          letterSpacing: 3,
        }}
      >
        IMPORTATION · EXPORTATION · CAR DEALINGS
      </div>
    </div>,
    size,
  );
}
