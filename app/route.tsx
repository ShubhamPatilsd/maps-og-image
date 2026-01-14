import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log("req what is up gang");
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] || // real client IP
      req.headers.get("x-real-ip") || // fallback
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
      { width: 500, height: 500 }
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
          could not fetch location 😭
        </div>
      ),
      { width: 500, height: 500 }
    );
  }
}
