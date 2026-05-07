import { ImageResponse } from "next/og";
import { PROPHETS } from "@/lib/prophets";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: { prophet: string };
}

export default function OgImage({ params }: Props) {
  const meta = PROPHETS[params.prophet];
  const name = meta?.name ?? "Prophet Stories";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0F1B2D 0%, #1C2A45 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 72, marginBottom: 24 }}>✨</div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "#FFF8EC",
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.1,
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#D4A853",
            marginTop: 16,
            textAlign: "center",
          }}
        >
          Islamic Stories for Muslim Children
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 20,
            color: "#2A9D8F",
          }}
        >
          noorbedtime.com
        </div>
      </div>
    ),
    { ...size }
  );
}
