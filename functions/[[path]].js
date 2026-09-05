export async function onRequest(context) {
  const path = context.params.path || "";

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

  const request = new Request(targetUrl.toString(), context.request);

  return fetch(request);
}
