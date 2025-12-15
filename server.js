// server.js at project root
import { createRequestHandler } from "@vercel/remix";
import * as build from "./dist/server/index.js"; // compiled Remix build

export default createRequestHandler({
  build,
  mode: process.env.NODE_ENV,
});
