import "dotenv/config";
import { createDb } from "./client.js";
import { repos, skills } from "./schema.js";
import { eq, sql } from "drizzle-orm";

async function main() {
  const db = createDb();
  const all = await db.select({
    owner: repos.githubOwner,
    repo: repos.githubRepoName,
    skillCount: sql<number>`(select count(*) from skills where skills.repo_id = repos.id)`,
  }).from(repos);
  all.sort((a, b) => Number(b.skillCount) - Number(a.skillCount));
  all.forEach(r => console.log(`${String(r.skillCount).padStart(5)} ${r.owner}/${r.repo}`));
  console.log(`\nTotal repos: ${all.length}`);
  console.log(`Total skills: ${all.reduce((s, r) => s + Number(r.skillCount), 0)}`);
  process.exit(0);
}
main();
