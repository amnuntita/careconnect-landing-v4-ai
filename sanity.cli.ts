import { defineCliConfig } from "sanity/cli";

// The Sanity CLI doesn't read Next.js env files, so load .env.local here.
try {
  process.loadEnvFile(".env.local");
} catch {
  // Fall back to variables already set in the shell.
}

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  },
});
