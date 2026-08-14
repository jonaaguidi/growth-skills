import { createMetaClient } from "../../lib/meta-client.js";

export const name = "list-accounts";

export const description =
  "Lista las cuentas de anuncios de Meta (Facebook/Instagram) accesibles con el token actual.";

export const inputSchema = {
  type: "object" as const,
  properties: {
    userId: {
      type: "string",
      description: "ID del usuario de Meta. Default: 'me' (usuario del token).",
    },
  },
};

export async function handler(args: { userId?: string }) {
  const client = createMetaClient();
  const result = await client.getAdAccounts(args.userId ?? "me");
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(result.data, null, 2),
      },
    ],
  };
}
