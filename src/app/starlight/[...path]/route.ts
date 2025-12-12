import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(req, await ctx.params);
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(req, await ctx.params);
}

export async function OPTIONS(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  return handleProxy(req, await ctx.params);
}

async function handleProxy(req: NextRequest, params: { path: string[] }) {
  const targetPath = params?.path?.length ? params.path.join("/") : "";
  const targetUrl = `${POSTHOG_HOST}/${targetPath}${req.nextUrl.search}`;

  // read body to avoid "duplex required" errors and for logging
  const isBodyAllowed = !(req.method === "GET" || req.method === "HEAD");
  const bodyBuffer = isBodyAllowed ? Buffer.from(await req.arrayBuffer()) : undefined;
  const hasBody = isBodyAllowed && bodyBuffer && bodyBuffer.length > 0;

  const headers = new Headers(req.headers);
  headers.set("host", new URL(POSTHOG_HOST).host);

  console.log("[PostHog proxy -> upstream]", {
    targetUrl,
    method: req.method,
    search: req.nextUrl.search,
    path: `/${targetPath}`,
    userAgent: req.headers.get("user-agent"),
    referer: req.headers.get("referer"),
    hasBody,
  });

  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: bodyBuffer,
      redirect: "manual",
    });
  } catch (error) {
    console.error("[PostHog proxy error]", { targetUrl, error });
    return NextResponse.json({ error: "Proxy fetch failed" }, { status: 502 });
  }

  const respHeaders = new Headers(upstreamResponse.headers);

  console.log("[PostHog proxy <- upstream]", {
    targetUrl,
    status: upstreamResponse.status,
    contentType: respHeaders.get("content-type"),
  });

  return new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: respHeaders,
  });
}
