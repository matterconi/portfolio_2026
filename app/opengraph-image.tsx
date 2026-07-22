import { ImageResponse } from "next/og";

export const alt = "Matteo Marconi — Full-stack Developer & AI Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "72px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#111111",
          color: "#f2f2f2",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            padding: "22px 26px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid #303030",
            borderRadius: "18px",
            background: "#181818",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 24, fontWeight: 600 }}>Matteo Marconi</span>
            <span style={{ marginTop: 4, color: "#a3a3a3", fontSize: 17 }}>
              Full-stack developer &amp; AI engineer
            </span>
          </div>
          <span style={{ color: "#737373", fontSize: 17 }}>matteomarconi.com</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ maxWidth: 980, fontSize: 72, fontWeight: 600, lineHeight: 1.02 }}>
            I build and ship full-stack web applications with AI.
          </span>
          <span style={{ marginTop: 32, color: "#a3a3a3", fontSize: 22 }}>
            Next.js · TypeScript · PostgreSQL · AI products
          </span>
        </div>
      </div>
    ),
    size,
  );
}
