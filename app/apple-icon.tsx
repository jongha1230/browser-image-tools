import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #244a39 0%, #da6d2f 100%)",
          borderRadius: "42px",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: "rgba(255, 247, 236, 0.14)",
            border: "8px solid rgba(255, 247, 236, 0.2)",
            borderRadius: "36px",
            color: "#fff7ec",
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            height: 120,
            justifyContent: "center",
            letterSpacing: "-0.08em",
            width: 120,
          }}
        >
          BI
        </div>
      </div>
    ),
    size,
  );
}
