import { createRequestHandler } from "@remix-run/cloudflare";
import * as build from "./build";  // ← プロジェクトルートの build を読み込む

export default {
  fetch: createRequestHandler(build, process.env.NODE_ENV),
};
