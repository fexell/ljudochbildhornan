import * as app from '../../dist/server/index.js';

export async function handler(event, context) {
  const request = new Request(
    event.rawUrl,
    {
      method: event.httpMethod,
      headers: event.headers,
      body:
        event.httpMethod === 'GET' || event.httpMethod === 'HEAD'
          ? undefined
          : event.body,
    },
  );

  const response = await app.fetch(
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
