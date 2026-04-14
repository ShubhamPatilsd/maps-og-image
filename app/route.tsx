import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const allHeaders: Record<string, string> = {};
  req.headers.forEach((value, key) => { allHeaders[key] = value; });

  const url = new URL(req.url);
  const queryParams: Record<string, string> = {};
  url.searchParams.forEach((value, key) => { queryParams[key] = value; });

  console.log("[REQUEST DUMP /]", JSON.stringify({
    method: req.method,
    url: req.url,
    queryParams,
    headers: allHeaders,
    geo: (req as NextRequest & { geo?: Record<string, unknown> }).geo ?? null,
    ip: (req as NextRequest & { ip?: string }).ip ?? null,
  }, null, 2));

  // Derive absolute base URL from the incoming request so this works on
  // localhost and any deployment without hardcoding a host.
  const base = `${url.protocol}//${url.host}`;
  const imageUrl = `${base}/image`;

  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="vro where u from" />
    <meta property="og:description" content="vro MIGHT be from somewhere" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:width" content="500" />
    <meta property="og:image:height" content="500" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="${imageUrl}" />
  </head>
  <body></body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
