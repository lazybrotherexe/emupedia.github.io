export async function onRequest(context) {
  const path = context.params.path || "";
  const sourceUrl =
    "https://emupedia.net/emupedia-game-wolfenstein-3d/" + path;

  const originalUrl = new URL(context.request.url);
  const targetUrl = new URL(sourceUrl);
  targetUrl.search = originalUrl.search;

  const request = new Request(targetUrl.toString(), context.request);

  return fetch(request);
}
