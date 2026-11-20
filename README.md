<p align="center">
  <a href="https://purrkey.app/?utm_source=github&utm_medium=readme&utm_campaign=geo_launch"><img src="plugins/purrkey/assets/icon.png" alt="Purrkey" width="96"></a>
</p>

<h1 align="center">Purrkey plugins</h1>

<p align="center">
  <a href="https://purrkey.app/?utm_source=github&utm_medium=readme&utm_campaign=geo_launch">purrkey.app</a> ·
  <a href="https://purrkey.app/docs/quickstart/mcp?utm_source=github&utm_medium=readme&utm_campaign=geo_launch">Docs</a> ·
  <a href="https://purrkey.app/tools?utm_source=github&utm_medium=readme&utm_campaign=geo_launch">Tool catalog</a> ·
  <a href="https://github.com/purrkey-ai/cli">CLI</a>
</p>

Official agent plugins for [Purrkey](https://purrkey.app/?utm_source=github&utm_medium=readme&utm_campaign=geo_launch), a pay-per-call tool marketplace for AI agents. Your agent finds the right tool for each task, sees the price and runs it with one key, no sign-ups.

The catalog lists over 1,100 endpoints: social data from TikTok, Instagram, YouTube, Reddit, X, Facebook and LinkedIn, plus Douyin, Xiaohongshu, Weibo and Bilibili; product, review and travel data from Amazon, eBay, Airbnb and Booking; and web search, scraping and crawling.

Each plugin adds two things:

| File | What it does |
| --- | --- |
| `plugins/purrkey/.mcp.json` (Claude Code), `plugins/purrkey/mcp.json` (Cursor) | Connects the hosted Purrkey MCP server at `https://api.purrkey.app/mcp` |
| `plugins/purrkey/skills/purrkey/SKILL.md` | Teaches the agent to discover a tool, inspect its schema and price, run it within a spending cap and recover the original Run instead of paying twice |

There is no executable code and no install script.

## Before you install

1. Create an API key at [purrkey.app/keys](https://purrkey.app/keys?utm_source=github&utm_medium=readme&utm_campaign=geo_launch). New accounts get $1 in free credit and there is no subscription.
2. Make the key available to your agent client as `PURRKEY_API_KEY`, through your shell profile or a secret manager. Keep it out of chat and project files.

## Install

### Claude Code

```
/plugin marketplace add purrkey/plugins
/plugin install purrkey@purrkey
```

Or from a terminal:

```sh
claude plugin marketplace add purrkey/plugins
claude plugin install purrkey@purrkey
```

Restart Claude Code with `PURRKEY_API_KEY` set, then check the connection with `/mcp`.

### Cursor

Install from this repository with `npx plugins add purrkey/plugins`, or add the MCP server by hand to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "purrkey": {
      "url": "https://api.purrkey.app/mcp",
      "headers": { "Authorization": "Bearer ${env:PURRKEY_API_KEY}" }
    }
  }
}
```

Restart Cursor after changing its environment, then check the connection under **Settings → Tools & MCP**.

### Codex

```sh
codex mcp add purrkey --url https://api.purrkey.app/mcp --bearer-token-env-var PURRKEY_API_KEY
```

To give Codex the skill too, copy `plugins/purrkey/skills/purrkey/` to `${CODEX_HOME:-$HOME/.codex}/skills/purrkey/`.

### Any other MCP client

Add a remote (streamable HTTP) MCP server:

- URL: `https://api.purrkey.app/mcp`
- Header: `Authorization: Bearer <your Purrkey API key>`

Setup for more clients is in the [MCP quickstart](https://purrkey.app/docs/quickstart/mcp?utm_source=github&utm_medium=readme&utm_campaign=geo_launch).

## Try it

Ask your agent something that needs live data, for example:

> Find the 10 most recent Xiaohongshu notes about "matcha latte" and summarize what people complain about.

The agent will `discover` candidate tools, `inspect` the one that fits, run it and report what it cost.

## Disclosure

Purrkey ([purrkey.app](https://purrkey.app)) is a **paid third-party service**. Before installing, know that:

- **Network calls.** Your agent sends tool requests to Purrkey (`api.purrkey.app`), which forwards them to the data provider that runs the tool.
- **Money.** Running a tool spends your prepaid Purrkey balance. `discover` and `inspect` are free. The skill treats your request as permission for the ordinary calls it needs, so it does not ask before each one. Every Run carries a maximum charge derived from the published price, and you can set account-wide daily and per-run caps at [purrkey.app/budget](https://purrkey.app/budget). Retrying a lost request with the same idempotency key returns the original Run and is not charged again.
- **Credentials.** The plugin reads your key from the `PURRKEY_API_KEY` environment variable. It never stores the key and the skill never asks you to paste it into chat.
- **No telemetry, hooks or background processes** are added by this plugin. It registers one MCP server and one skill.

## Development

```sh
node scripts/check.mjs           # versions and MCP URLs agree across manifests
claude plugin validate .         # Claude Code marketplace and plugin
```

When `SKILL.md` or an MCP config changes, bump the version in every manifest (`scripts/check.mjs` lists them). Claude Code and Cursor only deliver updates when the version changes.

Issues and pull requests are welcome. For account or billing questions, email [support@purrkey.app](mailto:support@purrkey.app).

## License

[MIT](LICENSE)
