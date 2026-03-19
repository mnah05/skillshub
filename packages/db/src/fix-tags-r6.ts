/**
 * R6 QA tag fixes:
 * - Remove wrong tags from specific skills
 * - Add tags to untagged trending skills from obra/superpowers and anthropics/skills
 *
 * Usage: npx tsx packages/db/src/fix-tags-r6.ts
 * Requires DATABASE_URL in .env
 */

import "dotenv/config";
import { createDb } from "./client.js";
import { sql } from "drizzle-orm";

const REMOVALS: Array<{ slug: string; tag: string }> = [
  { slug: "doc-coauthoring", tag: "auth" },
  { slug: "camsnap", tag: "security" },
  { slug: "audio-voice-recovery", tag: "auth" },
  { slug: "canvas-design", tag: "pdf" },
  { slug: "brand-guidelines", tag: "ai" },
  { slug: "skill-creator", tag: "performance" },
];

const ADDITIONS: Array<{ slug: string; tags: string[] }> = [
  // obra/superpowers
  { slug: "writing-skills", tags: ["writing", "documentation"] },
  { slug: "writing-plans", tags: ["writing", "planning"] },
  { slug: "systematic-debugging", tags: ["debugging", "development"] },
  { slug: "subagent-driven-development", tags: ["agents", "development"] },
  { slug: "requesting-code-review", tags: ["code-review", "development"] },
  { slug: "receiving-code-review", tags: ["code-review", "development"] },
  { slug: "finishing-a-development-branch", tags: ["git", "development"] },
  { slug: "executing-plans", tags: ["planning", "development"] },
  { slug: "dispatching-parallel-agents", tags: ["agents", "orchestration"] },
  { slug: "brainstorming", tags: ["planning", "creativity"] },
  // anthropics/skills
  { slug: "xlsx", tags: ["documents", "data"] },
  { slug: "pptx", tags: ["documents", "presentations"] },
  { slug: "internal-comms", tags: ["communication", "writing"] },
  { slug: "docx", tags: ["documents", "writing"] },
  { slug: "algorithmic-art", tags: ["creative", "visualization"] },
];

async function main() {
  const db = createDb();

  console.log("=== R6 Tag Fixes ===\n");

  // 1. Remove wrong tags
  console.log("--- Removing wrong tags ---");
  for (const { slug, tag } of REMOVALS) {
    const res = await db.execute(sql`
      UPDATE skills SET tags = array_remove(tags, ${tag}),
        updated_at = now()
      WHERE slug = ${slug} AND ${tag} = ANY(tags)
    `);
    const count = res.rowCount ?? 0;
    console.log(`  ${slug}: remove '${tag}' → ${count > 0 ? "done" : "not found/already clean"}`);
  }

  // 2. Add missing tags to untagged skills
  console.log("\n--- Adding tags to untagged skills ---");
  for (const { slug, tags } of ADDITIONS) {
    const pgArray = `{${tags.join(",")}}`;
    const res = await db.execute(sql`
      UPDATE skills SET tags = ${pgArray}::text[],
        updated_at = now()
      WHERE slug = ${slug}
        AND (tags IS NULL OR tags = '{}')
    `);
    const count = res.rowCount ?? 0;
    console.log(`  ${slug}: set [${tags.join(", ")}] → ${count > 0 ? "done" : "not found/already tagged"}`);
  }

  console.log("\nR6 tag fixes complete.");
  process.exit(0);
}

main();
