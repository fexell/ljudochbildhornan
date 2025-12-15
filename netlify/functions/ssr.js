// netlify/functions/ssr.js
import * as build from '../../dist/server/index.js';
import { createRequestHandler } from '@netlify/remix-adapter';

const handleRequest = createRequestHandler({
  build,
  mode: process.env.NODE_ENV,
});

export async function handler(event) {
  const request = new Request(event.rawUrl, {
    method: event.httpMethod,
    headers: event.headers,
    body:
      event.httpMethod === 'GET' || event.httpMethod === 'HEAD'
        ? undefined
        : event.body,
  });

  const response = await handleRequest(request);

  return {
    statusCode: response.status,
    headers: Object.fromEntries(response.headers),
    body: await response.text(),
  };
}
