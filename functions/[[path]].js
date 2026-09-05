export async function onRequest(context) {
  let path = context.params.path || "";

  if (Array.isArray(path)) {
    path = path.join("/");
  }

  const allowedPrefixes = [
    "emupedia-game-",
    "emupedia-app-",
    "emupedia-media-"
  ];

  const firstPart = path.split("/")[0];

  const shouldProxy = allowedPrefixes.some(prefix =>
    firstPart.startsWith(prefix)
  );

  if (!shouldProxy) {
    return context.next();
  }

  const originalUrl = new URL(context.request.url);

  const targetUrl = new URL(
    "https://emupedia.net/" + path
  );

  targetUrl.search = originalUrl.search;

  const headers = new Headers(context.request.headers);
  headers.delete("host");

  const request = new Request(targetUrl.toString(), {
    method: context.request.method,
    headers,
    body:
      context.request.method === "GET" ||
      context.request.method === "HEAD"
        ? undefined
        : context.request.body,
    redirect: "follow"
  });

  return fetch(request);
}
