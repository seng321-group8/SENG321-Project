import { readFileSync } from "node:fs";

const root = new URL("../../", import.meta.url);
const spec = readFileSync(new URL("openapi.yaml", root), "utf8");
const client = readFileSync(new URL("frontend/src/api/endpoints.js", root), "utf8");

const operations = [...spec.matchAll(/operationId:\s*(\w+)/g)].map((match) => match[1]);
const exported = new Set([...client.matchAll(/export function (\w+)/g)].map((match) => match[1]));

const missing = operations.filter((id) => !exported.has(id));
const extra = [...exported].filter((name) => name !== "checkHealth" && !operations.includes(name));

if (missing.length > 0) console.error(`Missing in endpoints.js: ${missing.join(", ")}`);
if (extra.length > 0) console.error(`Not in openapi.yaml: ${extra.join(", ")}`);

if (missing.length > 0 || extra.length > 0) process.exit(1);
console.log(`OK: ${operations.length} operations match.`);