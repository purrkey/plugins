// Checks that every manifest carries the same version and that the two MCP
// configs point at the same server. Run: node scripts/check.mjs
import { readFileSync } from "node:fs";

const read = (path) => JSON.parse(readFileSync(path, "utf8"));
const errors = [];

const claudeMarket = read(".claude-plugin/marketplace.json");
const cursorMarket = read(".cursor-plugin/marketplace.json");
const versions = {
  "plugins/purrkey/plugin.json": read("plugins/purrkey/plugin.json").version,
  "plugins/purrkey/.claude-plugin/plugin.json": read(
    "plugins/purrkey/.claude-plugin/plugin.json",
  ).version,
  "plugins/purrkey/.cursor-plugin/plugin.json": read(
    "plugins/purrkey/.cursor-plugin/plugin.json",
  ).version,
  ".claude-plugin/marketplace.json": claudeMarket.plugins[0].version,
  ".cursor-plugin/marketplace.json (plugin)": cursorMarket.plugins[0].version,
  ".cursor-plugin/marketplace.json (metadata)": cursorMarket.metadata.version,
};
const expected = versions["plugins/purrkey/plugin.json"];
for (const [file, version] of Object.entries(versions)) {
  if (version !== expected) errors.push(`${file}: version ${version}, expected ${expected}`);
}

const claudeUrl = read("plugins/purrkey/.mcp.json").mcpServers.purrkey.url;
const cursorUrl = read("plugins/purrkey/mcp.json").mcpServers.purrkey.url;
const registryUrl = read("server.json").remotes[0].url;
for (const [file, url] of [["plugins/purrkey/mcp.json", cursorUrl], ["server.json", registryUrl]]) {
  if (url !== claudeUrl) errors.push(`${file}: MCP url ${url}, expected ${claudeUrl}`);
}

const skill = readFileSync("plugins/purrkey/skills/purrkey/SKILL.md", "utf8");
if (!/^---\nname: purrkey\ndescription: .+/m.test(skill)) {
  errors.push("SKILL.md: frontmatter must start with name and description");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`ok: version ${expected}, MCP ${claudeUrl}`);
