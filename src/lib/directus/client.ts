import { createDirectus, rest, authentication } from "@directus/sdk";
import type { DirectusSchema } from "./schema";

const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL || "http://localhost:8055";

export function getDirectusClient() {
  return createDirectus<DirectusSchema>(directusUrl)
    .with(authentication("json"))
    .with(rest());
}

export function getDirectusAdminClient() {
  const client = createDirectus<DirectusSchema>(directusUrl)
    .with(rest({
      onRequest: (options) => {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${process.env.DIRECTUS_ADMIN_TOKEN}`,
        };
        return options;
      },
    }));
  return client;
}
