// netlify/functions/ssr.js
import * as build from '../../dist/server/index.js'; // adjust path if needed
import { createRequestHandler } from '@netlify/remix-adapter';

// Create Netlify-compatible request handler
const handleRequest = createRequestHandler({
  build,
  mode: process.env.NODE_ENV,
});

export async function handler(event) {
  // Convert Netlify event to Fetch API Request
  const request = new Request(event.rawUrl, {
    method: event.httpMethod,
    headers: event.headers,
    body:
      event.httpMethod === 'GET' || event.httpMethod === 'HEAD'
        ? undefined
        : event.body,
  });

  // Call Remix/Hydrogen handler
  const response = await handleRequest(request);

  // Convert Fetch Response to Netlify response
  return {
    statusCode: response.status,
    headers: Object.fromEntries(response.headers),
    body: await response.text(),
  };
}
