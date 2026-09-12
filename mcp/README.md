# Reuse QWitness from an MCP client

Install the repository dependencies with Node 22.23.1 and `npm ci`. Generate a dedicated signer with `npm run keygen`. Configure the server-only `GRAPH_API_KEY` in `.env.local`; an `OPENAI_API_KEY` is optional and enables actual LLM analysis. Never store credentials in the client configuration or commit them.

A client that supports local stdio servers can use the following configuration after replacing the two installation paths. These are explicit setup placeholders, not deployed resources:

```json
{
  "mcpServers": {
    "qwitness": {
      "command": "/absolute/path/to/node",
      "args": [
        "--env-file=/absolute/path/to/qwitness/.env.local",
        "--env-file=/absolute/path/to/qwitness/.secrets/signing.env",
        "--import", "/absolute/path/to/qwitness/node_modules/tsx/dist/loader.mjs",
        "/absolute/path/to/qwitness/mcp/server.ts"
      ]
    }
  }
}
```

Use `get_capabilities`, `create_market_receipt`, then `verify_receipt`. The creation tool accepts only the advertised question. The verification tool takes `{ "receipt": "serialized JSON", "trustedFingerprint": "sha384:..." }`; a pin is optional but must be supplied to establish a signer match. Obtain the full fingerprint independently from the intended signer, not from an untrusted receipt.

`npm run test:mcp` runs an actual SDK stdio client, lists tools, verifies a clearly labeled test-only receipt and attempts live creation. The evidence report distinguishes successful verification from unavailable live configuration. Successful live calls also save the returned receipt. Logs from the server go to stderr; stdout is protocol only.

The Web and MCP wrappers import `src/core/service.ts`; cryptographic verification uses the same `src/core/receipt.ts` as the standalone verifier. No separate mock MCP backend exists.
