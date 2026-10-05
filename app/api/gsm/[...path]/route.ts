import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

const DEFAULT_UPSTREAM = 'http://127.0.0.1:8001';

const upstreamBase = () =>
  (process.env.GSM_OPERATIONAL_API_URL || DEFAULT_UPSTREAM).replace(/\/$/, '');

const allowedPath = (path: string) =>
  path === 'admin' ||
  path === 'api/snapshot' ||
  path === 'api/admin/check' ||
  path === 'api/withdrawals' ||
  /^api\/withdrawals\/[^/]+$/.test(path);

async function proxy(request: Request, context: RouteContext) {
  const { path = [] } = await context.params;
  const normalizedPath = path
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  if (!allowedPath(normalizedPath)) {
    return NextResponse.json(
      { detail: 'Route GSM opérationnelle non autorisée.' },
      { status: 404 }
    );
  }

  const incomingUrl = new URL(request.url);
  const upstreamUrl = new URL(
    `${upstreamBase()}/${normalizedPath}${incomingUrl.search}`
  );

  const headers = new Headers();
  headers.set('accept', request.headers.get('accept') || 'application/json');

  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);

  const adminKey = request.headers.get('x-admin-key');
  if (adminKey) headers.set('x-admin-key', adminKey);

  const hasBody = !['GET', 'HEAD'].includes(request.method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  try {
    const response = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    });

    const responseHeaders = new Headers();
    const responseContentType =
      response.headers.get('content-type') || 'application/json; charset=utf-8';
    responseHeaders.set('content-type', responseContentType);
    responseHeaders.set('cache-control', 'no-store');

    if (
      normalizedPath === 'admin' &&
      responseContentType.toLowerCase().includes('text/html')
    ) {
      const html = await response.text();
      const rewrittenHtml = html
        .replaceAll('"/api/', '"/api/gsm/api/')
        .replaceAll("'/api/", "'/api/gsm/api/")
        .replaceAll('`/api/', '`/api/gsm/api/');

      return new Response(rewrittenHtml, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[GSM operational proxy]', error);
    return NextResponse.json(
      {
        detail:
          "La base opérationnelle GSM est indisponible. L'interface peut continuer en mode local.",
      },
      { status: 502 }
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
