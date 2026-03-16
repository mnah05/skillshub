import "dotenv/config";
import { createDb } from "./client.js";
import { repos, skills } from "./schema.js";
import { eq, desc, sql } from "drizzle-orm";

async function main() {
  const db = createDb();
  const data = await db.select({
    name: repos.name,
    githubOwner: repos.githubOwner,
    githubRepoName: repos.githubRepoName,
    starCount: repos.starCount,
    downloadCount: repos.downloadCount,
    skillCount: sql<number>`(SELECT count(*) FROM skills WHERE skills.repo_id = repos.id)::int`,
  }).from(repos).orderBy(desc(repos.starCount)).limit(10);
  console.log(JSON.stringify(data, null, 2));
  process.exit(0);
}
main();
