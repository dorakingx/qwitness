# Configure server credentials

1. Open [The Graph API key documentation](https://thegraph.com/docs/en/subgraphs/providers/subgraph-studio/managing-api-keys/) and use your own existing Graph account/API key. Configure an appropriate provider quota. Do not enable a paid plan or paid overages for this prototype without an explicit budget decision.
2. In the QWitness project root, create the local file only if it does not exist:

   ```sh
   test -f .env.local || cp .env.example .env.local
   ```

3. Set `GRAPH_API_KEY` in `.env.local` using your local editor. Keep the file private. Never paste the key in chat, source code, screenshots or a receipt. Do not add `NEXT_PUBLIC_`.
4. An existing, authorized `OPENAI_API_KEY` is optional. MCP tools and explicitly labeled deterministic analysis do not require an LLM API key. The optional LLM uses bounded requests and controlled monitoring selections; verify provider-side budget limits before enabling it.
5. Run `npm run test:live`. A missing or failing provider is an error, never a fixture fallback. Restart the local server after updating credentials.

The stable signer is already generated locally in `.secrets/signing.env`; it is excluded from Git and has file mode 0600. Do not regenerate or disclose this seed. A server-only Vercel production copy was configured for the new qwitness deployment.

For deployment, set the Graph key as a server-only production environment variable on the **qwitness** Vercel project, then redeploy. Never set secrets on an existing unrelated project. Confirm the public site's capabilities and execute one bounded live receipt workflow after deployment.

The application's 12-execution/hour process limit is not a global billing cap. Provider-side quotas are required to bound total usage across server instances. No purchase or paid overage is automatically authorized by configuration instructions.
