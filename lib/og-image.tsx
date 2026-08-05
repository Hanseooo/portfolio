import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function renderOgImage(opts: {
  kicker: string;
  title: string;
  subtitle?: string;
  imagePath?: string;
}) {
  let imageDataUri: string | undefined;

  if (opts.imagePath) {
    const absolutePath = path.join(process.cwd(), opts.imagePath);
    const raw = await readFile(absolutePath);
    const png = await sharp(raw)
      .toColorspace("srgb")
      .resize(760, 630, { fit: "cover" })
      .png()
      .toBuffer();
    imageDataUri = `data:image/png;base64,${png.toString("base64")}`;
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "1200px",
          height: "630px",
          background: "#000000",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: imageDataUri ? "440px" : "1200px",
            height: "630px",
            padding: "64px",
            gap: "20px",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 22,
              letterSpacing: 4,
              color: "#00E5FF",
              textTransform: "uppercase",
            }}
          >
            {opts.kicker}
          </span>
          <span
            style={{
              fontSize: 54,
              fontWeight: 700,
              color: "#FAFAFA",
              lineHeight: 1.15,
            }}
          >
            {opts.title}
          </span>
          {opts.subtitle && (
            <span
              style={{
                fontSize: 22,
                color: "#A1A1AA",
                lineHeight: 1.4,
              }}
            >
              {opts.subtitle}
            </span>
          )}
          <span
            style={{
              display: "flex",
              marginTop: "auto",
              fontSize: 18,
              color: "#71717A",
            }}
          >
            Hans Amoguis — hanseo.tech
          </span>
        </div>
        {imageDataUri && (
          <div
            style={{
              display: "flex",
              position: "relative",
              width: "760px",
              height: "630px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageDataUri}
              alt=""
              width={760}
              height={630}
              style={{ objectFit: "cover" }}
            />
            <div
              style={{
                display: "flex",
                position: "absolute",
                top: 0,
                left: 0,
                width: "300px",
                height: "630px",
                background:
                  "linear-gradient(to right, #000000, rgba(0,0,0,0))",
              }}
            />
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
