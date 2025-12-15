import * as mod from '../../dist/server/index.js';

const fetchHandler =
  mod.fetch ??
  mod.default?.fetch;

if (!fetchHandler) {
  throw new Error(
    'Hydrogen server build does not export a fetch handler',
  );
}

export async function handler(event, context) {
  const request = new Request(event.rawUrl, {
    method: event.httpMethod,
    headers: event.headers,
    body:
      event.httpMethod === 'GET' || event.httpMethod === 'HEAD'
        ? undefined
        : event.body,
  });

  const response = await fetchHandler(
    request,
    process.env,
    context,
  );

  return {
    statusCode: response.status,
    headers: Object.fromEntries(response.headers),
    body: await response.text(),
  };
}
