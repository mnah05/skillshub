import "dotenv/config";
import { createDb } from "./client.js";
import { skills, repos, users } from "./schema.js";
import { eq, sql, desc } from "drizzle-orm";

async function main() {
  const db = createDb();

  // Overall stats
  const [stats] = await db.select({
    totalSkills: sql<number>`count(*)::int`,
    published: sql<number>`count(*) filter (where is_published = true)::int`,
    withReadme: sql<number>`count(*) filter (where readme is not null and readme != '')::int`,
    withDesc: sql<number>`count(*) filter (where description is not null and description != '')::int`,
    withTags: sql<number>`count(*) filter (where array_length(tags, 1) > 0)::int`,
    emptyTags: sql<number>`count(*) filter (where tags = '{}')::int`,
  }).from(skills);
  console.log("=== SKILLS OVERVIEW ===");
  console.log(JSON.stringify(stats, null, 2));

  // Repo stats
  const [repoStats] = await db.select({
    totalRepos: sql<number>`count(*)::int`,
    zeroDownloads: sql<number>`count(*) filter (where download_count = 0)::int`,
    zeroStars: sql<number>`count(*) filter (where star_count = 0)::int`,
  }).from(repos);
  console.log("\n=== REPOS OVERVIEW ===");
  console.log(JSON.stringify(repoStats, null, 2));

  // User stats
  const [userStats] = await db.select({
    totalUsers: sql<number>`count(*)::int`,
    humans: sql<number>`count(*) filter (where role = 'human')::int`,
    agents: sql<number>`count(*) filter (where role = 'agent')::int`,
    withBsc: sql<number>`count(*) filter (where bsc_address is not null)::int`,
  }).from(users);
  console.log("\n=== USERS OVERVIEW ===");
  console.log(JSON.stringify(userStats, null, 2));

  // Top repos by skill count
  const topRepos = await db.select({
    owner: repos.githubOwner,
    repo: repos.githubRepoName,
    stars: repos.starCount,
    downloads: repos.downloadCount,
    skillCount: sql<number>`(SELECT count(*) FROM skills WHERE skills.repo_id = repos.id)::int`,
  }).from(repos).orderBy(desc(repos.starCount)).limit(10);
  console.log("\n=== TOP REPOS ===");
  topRepos.forEach(r => console.log(`  ${r.owner}/${r.repo}: ${r.skillCount} skills, ⭐${r.stars}, 📥${r.downloads}`));

  // Quality flags
  const [noReadme] = await db.select({
    count: sql<number>`count(*)::int`,
  }).from(skills).where(sql`readme is null or readme = ''`);
  console.log(`\n=== QUALITY FLAGS ===`);
  console.log(`Skills with no readme: ${noReadme.count}`);

  const [shortDesc] = await db.select({
    count: sql<number>`count(*)::int`,
  }).from(skills).where(sql`length(description) < 20 or description is null`);
  console.log(`Skills with short/no description (<20 chars): ${shortDesc.count}`);

  const dupes = await db.execute(sql`
    SELECT slug, count(*) as cnt FROM skills GROUP BY slug HAVING count(*) > 1 ORDER BY cnt DESC LIMIT 10
  `);
  console.log(`\nDuplicate slugs (same skill name, different repos):`);
  dupes.rows.forEach((r: any) => console.log(`  ${r.slug}: ${r.cnt} copies`));

  const [stillEmpty] = await db.select({
    count: sql<number>`count(*)::int`,
  }).from(skills).where(sql`tags = '{}'`);
  console.log(`\nSkills still with empty tags: ${stillEmpty.count}`);

  // Sample low-quality skills
  const lowQuality = await db.select({
    name: skills.name,
    slug: skills.slug,
    description: skills.description,
    tagsCount: sql<number>`array_length(tags, 1)`,
    hasReadme: sql<boolean>`readme is not null and readme != ''`,
  }).from(skills).where(sql`(description is null or length(description) < 20) and is_published = true`).limit(10);
  console.log("\n=== SAMPLE LOW-QUALITY SKILLS ===");
  lowQuality.forEach(s => console.log(`  ${s.slug}: desc="${s.description?.slice(0,50) || 'NULL'}" tags=${s.tagsCount || 0} readme=${s.hasReadme}`));

  process.exit(0);
}

main().catch(console.error);
