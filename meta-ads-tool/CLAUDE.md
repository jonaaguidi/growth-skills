# Meta Ads Tool

Servidor MCP para Meta (Facebook/Instagram) Ads.

## Estructura

- `src/index.ts` — entry point, registra tools y arranca StdioServerTransport.
- `src/lib/meta-client.ts` — cliente HTTP para la Graph API de Meta (Facebook/Instagram Ads).
- `src/tools/meta-ads/` — tools MCP: `list-accounts`, `audit-campaigns`, `get-insights`.
- `src/tools/research/` — placeholder para tools de research.

## Uso

```bash
cd meta-ads-tool
npm install
npx tsx src/index.ts          # arranca el server MCP por stdio
```

Necesita `META_ACCESS_TOKEN` en `.env` (o como variable de entorno).
