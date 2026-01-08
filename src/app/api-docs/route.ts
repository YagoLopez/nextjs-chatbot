import { ApiReference } from "@scalar/nextjs-api-reference";

const config = {
  layout: "classic",
  darkMode: true,
  theme: "Elysia.js",
  spec: {
    url: "/openapi.json",
  },
};

export const GET = ApiReference(config as Partial<typeof ApiReference>);
