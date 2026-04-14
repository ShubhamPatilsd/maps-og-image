import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const allHeaders: Record<string, string> = {};
  req.headers.forEach((value, key) => { allHeaders[key] = value; });

  const url = new URL(req.url);
  const queryParams: Record<string, string> = {};
  url.searchParams.forEach((value, key) => { queryParams[key] = value; });

  console.log("[IMAGE REQUEST DUMP]", JSON.stringify({
    method: req.method,
    url: req.url,
    queryParams,
    headers: allHeaders,
    geo: (req as NextRequest & { geo?: Record<string, unknown> }).geo ?? null,
    ip: (req as NextRequest & { ip?: string }).ip ?? null,
  }, null, 2));

  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "8.8.8.8";

    const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
    const geo = await geoRes.json();

    const city = geo.city ?? "somewhere";
    const lat = geo.lat ?? 0;
    const lon = geo.lon ?? 0;

    const mapUrl =
      `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/` +
      `${lon},${lat},10.4/500x500` +
      `?access_token=${process.env.MAPBOX_TOKEN}`;

    console.log("mapUrl", mapUrl);

    return new ImageResponse(
      (
        <div
          style={{
            width: "500px",
            height: "500px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            backgroundImage: `url(${mapUrl})`,
            backgroundSize: "cover",
            fontSize: 48,
            paddingTop: "30px",
            paddingLeft: "30px",
            paddingRight: "30px",
            textAlign: "center",
            fontWeight: 700,
            color: "white",
            textShadow: "0 4px 20px rgba(0,0,0,0.8)",
          }}
        >
          vro MIGHT be from {city.toLowerCase()} 😭✌️💔
        </div>
      ),
      {
        width: 500,
        height: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "Content-Type": "image/png",
        },
      }
    );
  } catch (err) {
    console.log(err);
    return new ImageResponse(
      (
        <div
          style={{
            width: "500px",
            height: "500px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            fontSize: 48,
            paddingTop: "30px",
            paddingLeft: "30px",
            paddingRight: "30px",
            textAlign: "center",
            fontWeight: 700,
            color: "white",
            textShadow: "0 4px 20px rgba(0,0,0,0.8)",
          }}
        >
          could not fetch location 😭
        </div>
      ),
      {
        width: 500,
        height: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "Content-Type": "image/png",
        },
      }
    );
  }
}
