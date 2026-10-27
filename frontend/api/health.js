import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { createApp } = require("../lib/server.cjs");
const app = createApp();

export default function handler(req, res) {
  app(req, res);
}
