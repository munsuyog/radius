import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  dbCredentials: {
    url: "postgres://neondb_owner:npg_qaeP4c2xMnXU@ep-broad-mountain-a5fa2uhl-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require",
  },
});
