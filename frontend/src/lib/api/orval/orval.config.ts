import { defineConfig } from "orval";

const target = "./schema.json";

export default defineConfig({
  api: {
    input: {
      target,
    },
    output: {
      mode: "tags-split",
      packageJson: "fake",
      baseUrl: process.env.NEXT_PUBLIC_API_URL,
      target: "./api/generated",
      schemas: "./api/generated/model",
      client: "react-query",
      prettier: true,
      clean: true,
      override: {
        mutator: {
          path: "./client.ts",
          name: "axiosInstance",
        },
      },
    },
  },
  apiZod: {
    input: {
      target,
    },
    output: {
      packageJson: "fake",
      mode: "tags-split",
      client: "zod",
      target: "./api/generated/zod",
      fileExtension: ".zod.ts",
    },
  },
});
