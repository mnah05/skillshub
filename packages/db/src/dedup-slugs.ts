import "dotenv/config";
import { createDb } from "./client.js";
import { skills, repos, skillEvents, skillFeedback } from "./schema.js";
import { eq, sql } from "drizzle-orm";

/**
 * Deduplicate skills by slug across ALL repos.
 * For each set of duplicate slugs, keeps the copy from the highest-star repo
 * and deletes the rest.
 */
async function main() {
  const db = createDb();

  // Find all slugs that appear more than once (across different repos)
  const duplicates = await db.execute(sql`
    SELECT
      s.slug,
      COUNT(*) AS cnt,
      array_agg(
        json_build_object(
          'id', s.id,
          'repo_id', s.repo_id,
          'star_count', r.star_count
        )
        ORDER BY r.star_count DESC, LENGTH(COALESCE(s.readme, '')) DESC
      ) AS entries
    FROM skills s
    JOIN repos r ON s.repo_id = r.id
    WHERE s.is_published = true
    GROUP BY s.slug
    HAVING COUNT(*) > 1
    ORDER BY COUNT(*) DESC
  `);

  const rows = duplicates.rows as Array<{
    slug: string;
    cnt: string;
    entries: Array<{ id: string; repo_id: string; star_count: number }>;
  }>;

  console.log(`Found ${rows.length} duplicate slug groups\n`);

  let totalDeleted = 0;

  for (const row of rows) {
    const entries = row.entries;
    const keepEntry = entries[0]; // highest star count
    const deleteEntries = entries.slice(1);

    console.log(
      `  "${row.slug}" (${row.cnt} copies) — keeping from repo with ${keepEntry.star_count} stars, deleting ${deleteEntries.length}`
    );

    for (const entry of deleteEntries) {
      // Delete referencing rows first (skill_events and skill_feedback have ON DELETE CASCADE
      // in schema but the DB constraint is not CASCADE for skill_events)
      await db.delete(skillEvents).where(eq(skillEvents.skillId, entry.id));
      await db.delete(skillFeedback).where(eq(skillFeedback.skillId, entry.id));
      await db.delete(skills).where(eq(skills.id, entry.id));
      totalDeleted++;
    }
  }

  console.log(`\nDeleted ${totalDeleted} inferior duplicate skills`);
  process.exit(0);
}

main().catch(console.error);
