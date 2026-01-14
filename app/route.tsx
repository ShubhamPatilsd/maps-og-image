import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const ip = url.searchParams.get("ip") || "8.8.8.8"; // fallback

    // fetch location from free API
    const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
    const geo = await geoRes.json();
    // const geo = {
    //   status: "success",
    //   country: "United States",
    //   countryCode: "US",
    //   region: "CA",
    //   regionName: "California",
    //   city: "La Jolla",
    //   zip: "92092",
    //   lat: 32.8509,
    //   lon: -117.2722,
    //   timezone: "America/Los_Angeles",
    //   isp: "University of California, San Diego",
    //   org: "University of California, San Diego",
    //   as: "AS7377 University of California, San Diego",
    //   query: "128.54.148.246",
    // };

    const city = geo.city ?? "somewhere";
    const lat = geo.lat ?? 0;
    const lon = geo.lon ?? 0;

    // mapbox static map
    const mapUrl =
      `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/` +
      `${lon},${lat},10.4/500x500` +
      `?access_token=${process.env.MAPBOX_TOKEN}`;

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
    console.error(err);
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
